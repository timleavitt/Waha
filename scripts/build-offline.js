#!/usr/bin/env node

import db from '../firebase/db';
import languages from '../languages';
import { getAssetInfo } from '../assetInfo';
import "firebase/firestore";

const fs = require('fs');
const { exec, spawn } = require("child_process");
const https = require('https');

const bundledLanguages = process.argv.slice(2);
process.env.BUNDLED_LANGUAGES = bundledLanguages.join(',');

// Helper function to do an HTTP request and return a promise for its completion
// from https://gist.github.com/ktheory/df3440b01d4b9d3197180d5254d7fb65 (modified slightly)
const requestPromise = ((urlOptions, data) => {
    return new Promise((resolve, reject) => {
      const req = https.request(urlOptions,
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk.toString()));
          res.on('error', reject);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode <= 299) {
              resolve({statusCode: res.statusCode, headers: res.headers, body: body});
            } else {
              reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
            }
          });
        });
      req.on('error', reject);
      if (data) {
        req.write(data, 'binary');
      }
      req.end();
    });
  });

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
}).then(
    _ => {
        // Run APK build
        // TODO: Is it possible to do this locally?
        console.log('Running APK build');
        const releaseChannel = "offline-"+process.env.BUNDLED_LANGUAGES.replace(',','');
        const build = spawn("expo",["build:android","-t","apk","--release-channel",releaseChannel],{
            shell: true
        });

        build.stdout.on("data", data => {
            console.log(`${data}`);
        });

        build.stderr.on("data", data => {
            console.error(`${data}`);
        });

        build.on('error', (error) => {
            console.error(`ERROR: ${error.message}`);
        });

        build.on("close", code => {
            console.log(`Child process exited with code ${code}`);
            process.exit(code);
        });
    },
    (error) => {
        console.error(error);
        process.exit(1);
    }
);
