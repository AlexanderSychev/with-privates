'use strict';

const del = require('del');
const path = require('path');

function flatten(arr) {
    let result = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flatten(item));
        } else {
            result.push(item);
        }
    }
    return result;
}

function cleanDir(dir) {
    return new Promise((resolve) => {
        del([path.join(dir, '**', '*')], resolve);
    });
}

function main() {
    return Promise.all([
        cleanDir(path.join(__dirname, 'dist')),
        cleanDir(path.join(__dirname, 'lib')),
        cleanDir(path.join(__dirname, 'es6-module')),
    ]).then(flatten);
}

main().then(
    (files) => {
        console.log(`Deleted files:\n\n${files.join('\n')}`)
        process.exit(0);
    },
    (err) => {
        console.error(err);
        process.exit(1);
    },
);
