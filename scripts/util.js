import { spawn } from "child_process";
import { request } from 'https';

// Helper function to do an HTTP request and return a promise for its completion
// from https://gist.github.com/ktheory/df3440b01d4b9d3197180d5254d7fb65 (modified slightly)
export const requestPromise = (urlOptions, data) => {
    return new Promise((resolve, reject) => {
      const req = request(urlOptions,
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
  };

// Helper function to run an external executable via spawn, pipe back output, and report the result via a promise
export const spawnPromise = (command, args) => {
    args = args || [];
    return new Promise((resolve, reject) => {
        console.log("SPAWNING: " + command + " " + args.join(" "))
        const build = spawn(command, args, {
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
            if (code === 0) {
                resolve();
            } else {
                reject(`Child process exited with code ${code}`);
            }
        });
    });
}
