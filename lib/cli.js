#!/usr/bin/env node


const { readFileSync } = require("fs");
const { join } = require("path");

const { emitExtendedPackageJSON } = require("./app");


const ARGS = process.argv.slice(2);


function parseFlag(name, shorthand) {
    const nameIndex = ARGS.indexOf(`--${name}`);
    const shorthandIndex = ARGS.indexOf(`-${shorthand}`);
    
    return !(!~nameIndex && !~shorthandIndex)
    ? ARGS[Math.max(nameIndex, shorthandIndex)]
    : null;
}


if(parseFlag("help", "h")) {
    console.log(readFileSync(join(__dirname, "./_help.txt")).toString());

    process.exit(0);
}


const PATH = !/^-/.test(ARGS[0] || "-") ? ARGS[0] : "./";

const emittedFiles = emitExtendedPackageJSON(PATH, {
    force: parseFlag("force", "f")
});


emittedFiles
.forEach(emittedFile => console.log(`\x1b[32mEmitted '${emittedFile}'\x1b[0m`));


// TODO: Watch flag (?)