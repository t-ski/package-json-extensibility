const fs = require("fs");
const { join, isAbsolute } = require("path");


const _config = {
    extendsPackageJsonFilename: "package.extends.json",
    sharedPackageJsonFilename: "package.shared.json"
};


module.exports.emitExtendedPackageJSON = function(packagePath, options = {}) {
    const packageDirPath = join(
        isAbsolute(packagePath) ? "" : process.cwd(),
        packagePath
    )
    .replace(/(\/package.json)?$/, "");
    
    let rootPackageJsonPath = join(packageDirPath, _config.extendsPackageJsonFilename);
    rootPackageJsonPath = !fs.existsSync(rootPackageJsonPath)
    ? join(packageDirPath, "package.json")
    : rootPackageJsonPath;
    if(!fs.existsSync(rootPackageJsonPath)) {
        throw new SyntaxError(`Root package does not provide a ${_config.extendsPackageJsonFilename} or package.json`);
    }
    const rootPackageJson = require(rootPackageJsonPath);
    
    const workspacePaths = rootPackageJson.workspaces || [];
    if(!workspacePaths.length) {
        throw new ReferenceError("Package does not provide workspaces");
    }

    const sharedPackageJsonPath = join(packageDirPath, _config.sharedPackageJsonFilename);
    const sharedPackageJson = fs.existsSync(sharedPackageJsonPath)
    ? require(sharedPackageJsonPath)
    : {};

    const outFilePaths = [];
    const writePackageJsonFile = (path) => {
        const extendsPackageJsonPath = join(path, _config.extendsPackageJsonFilename);
        if(!fs.existsSync(extendsPackageJsonPath)) return;

        const packageJsonPath = join(path, "./package.json");
        if(!options.force && fs.existsSync(packageJsonPath)) {
            throw new SyntaxError(`Package does already contain a package.json '${path}'`);
        }
        
        const extendsPackageJson = require(extendsPackageJsonPath);
        fs.writeFileSync(packageJsonPath, JSON.stringify({
            ...sharedPackageJson,
            ...extendsPackageJson
        }, null, options.indent || 4));

        outFilePaths.push(path);
    };

    writePackageJsonFile(packageDirPath);

    workspacePaths
    .map(workspacePath => {
        if(!/\/\*$/.test(workspacePath)) return workspacePath;
        const workspaceDirPath = join(packageDirPath, workspacePath.slice(0, -2));
        return fs.readdirSync(workspaceDirPath, {
            withFileTypes: true
        })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => join(workspaceDirPath, dirent.name));
    })
    .flat()
    .filter(workspacePath => fs.existsSync(workspacePath))
    .forEach(workspacePath => writePackageJsonFile(workspacePath));

    return outFilePaths;
};