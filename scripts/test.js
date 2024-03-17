const assert = require("assert");
const { join } = require("path");

const APP = require("../lib/app");


function assertEquals(actualPackagePath, expectedPackageObj) {
    assert.deepEqual(require(actualPackagePath), expectedPackageObj);
}


const emittedFiles = process.argv.slice(2).includes("--dry")
? [
    "/Users/Privat/Desktop/extend-package-json/test/package.json",
    "/Users/Privat/Desktop/extend-package-json/test/packages/package-a/package.json",
    "/Users/Privat/Desktop/extend-package-json/test/packages/package-b/package.json"
]
: APP.emitExtendedPackageJSON("./test/", {
    force: true
})
.map(outPath => join(outPath, "./package.json"));


assertEquals(emittedFiles[0], {
    private: true,
    version: "1.0.0",
    scripts: {
        "run-all": "./run-all.sh"
    },
    author: "Jane Doe",
    license: "ISC",
    workspaces: [
        "./packages/*"
    ]
});

assertEquals(emittedFiles[1], {
    private: true,
    version: "0.0.1",
    scripts: {
        test: "test example"
    },
    author: "Jane Doe",
    license: "ISC",
    name: "test-package-a",
    description: "Package A"
});

assertEquals(emittedFiles[2], {
    private: true,
    version: "0.0.2",
    scripts: {
        test: "test example"
    },
    author: "Jane Doe",
    license: "ISC",
    name: "test-package-b",
    keywords: [ "b" ]
});

console.log("\x1b[32mAll tests passed with success.\x1b[0m")