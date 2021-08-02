'use strict';
const pathExists = require("path").sync
const npminstall = require("npminstall");



class Package {
    // TODO
    constructor({targetPath, storePath, packageName, packageVersion}){
        this.targetPath = targetPath;
        this.storePath = storePath;
        this.packageName = packageName;
        this.packageVersion = packageVersion;
    }
    // 需要下载的包是否存在
    exists(){
        // 缓存目录加上规格化的包名
        // if(pathExists("./package.json")){
        //     console.log(111111111)
        // }
        console.log(this.storePath,this.targetPath, 111111111)
        npminstall({
            storePath: this.storePath,
            pkgs: [
                {
                    name: this.packageName, 
                    version: this.packageVersion
                }
            ],
            root: this.targetPath,
            registry: "https://registry.npmjs.org"
        })
    }
}
module.exports = Package;
