#!/usr/bin/env node

import db from '../firebase/db';
import languages from '../languages';
import { getAssetInfo } from '../assetInfo';
import { requestPromise, spawnPromise } from './util';
import "firebase/firestore";

const fs = require('fs');

const bundledLanguages = process.argv.slice(2);
process.env.BUNDLED_LANGUAGES = bundledLanguages.join(',');
const releaseChannel = "offline-"+process.env.BUNDLED_LANGUAGES.replace(',','');

Promise.all(bundledLanguages.map((value, _, array) => {
    // Determine full list of assets to download
    const lang = languages.find(lang => lang.languageCode == value);
    if (!lang) {
        throw new Error("Invalid language: " + value);
    }
    const promises = [];
    promises.push(db.collection('languages').doc(value).get().then(doc => {
        if (doc.exists && doc.data()) {
            // TODO: Queue download of firebase bundle for language
            // console.log(doc.data());
        }
    }));
    promises.push(db.collection('sets').where('languageID','==',value).get().then(result => {
        const assets = [];
        result.docs.map(set => {
            if (set.exists && set.data()) {
                // TODO: Queue download of firebase bundle for set
                // console.log(set.data());

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
    // Clear existing downloads folder
    const targetDirectory = './assets/downloaded';
    if (fs.existsSync(targetDirectory)) {
        fs.rmdirSync(targetDirectory,{
            recursive: true,
            force: true
        });
    }
    fs.mkdirSync(targetDirectory);

    // Download the files
    const fileDownloads = [];
    console.log('Downloading audio/video files...');
    files.forEach(remoteFileName => {
        // NOTE: Path is relative to project root, not scripts folder
        const localFileName = targetDirectory + "/" + remoteFileName.split('/').pop().split('?')[0];
        fileDownloads.push(requestPromise(remoteFileName).then(response => {
            const buffer = Buffer.from(response.body);
            const file = fs.createWriteStream(localFileName);
            file.write(buffer);
            file.close();
        },reason => {
            console.log('WARN: Failed to download ' + remoteFileName);
        }));
    })
    return Promise.all(fileDownloads);
}).then(_ => {
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
