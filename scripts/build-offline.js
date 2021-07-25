#!/usr/bin/env node

import "firebase/firestore";
import languages from '../languages';
import { getAssetInfo } from '../assetInfo';
import { requestPromise, spawnPromise } from './util';

const fs = require('fs');
// NOTE: must initialize this with a service account for the target Firebase environment
const serviceAccount = require("./service-account.json");
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://" + serviceAccount.project_id + ".firebaseio.com"
});

const firestore = admin.firestore();

const bundledLanguages = process.argv.slice(2);
process.env.BUNDLED_LANGUAGES = bundledLanguages.join(',');
const releaseChannel = "offline-"+process.env.BUNDLED_LANGUAGES.replace(',','');

// Clear existing downloads folder
const targetDirectory = './assets/downloaded';
if (fs.existsSync(targetDirectory)) {
    fs.rmdirSync(targetDirectory,{
        recursive: true,
        force: true
    });
}
fs.mkdirSync(targetDirectory);

const assetListFile = fs.createWriteStream('./assets/downloaded/master-list.js');
assetListFile.write('module.exports = [');

const bundle = firestore.bundle(releaseChannel);

Promise.all(bundledLanguages.map((value, _, array) => {
    // Determine full list of assets to download
    const lang = languages.find(lang => lang.languageCode == value);
    if (!lang) {
        throw new Error("Invalid language: " + value);
    }
    const promises = [];
    promises.push(firestore.collection('languages').doc(value).get().then(doc => {
        if (doc.exists && doc.data()) {
            bundle.add(doc);
        }
    }));
    promises.push(firestore.collection('sets').where('languageID','==',value).get().then(result => {
        const assets = [];
        bundle.add(`language-${value}`,result);
        result.docs.map(set => {
            if (set.exists && set.data()) {

                // Queue download of video/audio for lesson if available
                set.data().lessons.forEach(lesson => {
                    if (lesson.hasAudio) {
                        assets.push(getAssetInfo("audioSource", lesson.id));
                    }
                    if (lesson.hasVideo) {
                        assets.push(getAssetInfo("videoSource", lesson.id));
                    }
                })
            }
        });
        return assets;
    }));
    return Promise.all(promises);
})).then(results => {
    // Coalesce into actual array of files to download
    var files = [];
    const coalesce = (fileOrFiles) => {
        if (typeof fileOrFiles === 'string') {
            files.push(fileOrFiles);
        } else if (typeof fileOrFiles === 'object') {
            fileOrFiles.forEach(object => {
                coalesce(object);
            })
        }
    };
    coalesce(results);
    return files;
}).then(files => {
    // Write bundle to file
    const file = `./assets/downloaded/all.firebase-bundle`;
    assetListFile.write(`\r\n\trequire('../.${file}')`);
    fs.writeFile(file, bundle.build(),  "binary", function(err) {
        if (err) {
            throw err;
        } else {
            console.log(`Built Firebase bundle: ${file}`);
        }
    });

    // Download audio/video files
    const fileDownloads = [];
    console.log('Downloading audio/video files...');
    files.forEach(remoteFileName => {
        // NOTE: Path is relative to project root, not scripts folder
        const localFileName = targetDirectory + "/" + decodeURIComponent(remoteFileName.split('/').pop().split('?')[0]);
        fileDownloads.push(requestPromise(remoteFileName).then(response => {
            const buffer = Buffer.from(response.body);
            fs.mkdirSync(localFileName.split('/').slice(0,-1).join('/'), {recursive: true});
            const file = fs.createWriteStream(localFileName);
            file.write(buffer);
            file.close();
            assetListFile.write(`,\r\n\trequire('../.${localFileName}')`);
        },reason => {
            console.log('WARN: Failed to download ' + remoteFileName);
        }));
    })
    return Promise.all(fileDownloads);
}).then(_ => {
    assetListFile.write('];');
    assetListFile.close();
    // Publish to update assets
    return spawnPromise("expo", ["publish",
        "--release-channel",releaseChannel]);
}).then(_ => {
    // Run APK build
    return spawnPromise("expo", ["build:android",
        "-t","apk",
        "--release-channel",releaseChannel]);
}).then(
    _ => {
        process.exit(0);
    },
    (error) => {
        // Handle all the errors here.
        console.error(error);
        process.exit(1);
    }
);
