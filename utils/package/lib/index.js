'use strict';
const pathExists = require("path").sync
const npminstall = require("npminstall");
const fse = require("fs-extra");
const { getDefautRegister, getNpmLatestVersion } = require("get-npm-info");


class Package {
    // TODO
    constructor({targetPath, storePath, packageName, packageVersion}){
        this.targetPath = targetPath;
        this.storePath = storePath;
        this.packageName = packageName;
        this.packageVersion = packageVersion;
        this.cachfilePathPrefix = packageName.replace("/", "_");
    }
    get cachPath(){
        return path.resolve(this.storePath, `_${this.cachfilePathPrefix}@${this.packageVersion}@${this.packageName}`);
    }
    get specailCachPath(packageVersion){
        return path.resolve(this.storePath, `_${this.cachfilePathPrefix}@${packageVersion}@${this.packageName}`);
    }
    async prepare(){
        // 缓存目录不存在就创建
        if(this.storePath && pathExists(this.storePath)) {
            await fse.mkdirp(this.storePath);
        }
        // 如果版本是latest就获取最新的版本号
        if(this.packageVersion == 'latest') {
            this.packageVersion = await this.getNpmLatestVersion(this.packageName);
        }
    }
    // 需要下载的包是否存在
    exists(){
        if(this.storePath) {
            await this.prepare();
            return pathExists(this.cachPath);
        } else {
            return pathExists(this.targetPath);
        }
    }
    install(){
        npminstall({
            storePath: this.storePath,
            pkgs: [
                {
                    name: this.packageName, 
                    version: this.packageVersion
                }
            ],
            root: this.targetPath,
            registry: getDefautRegister()
        })
    }
    update(){

    }
}
module.exports = Package;
