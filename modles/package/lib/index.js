'use strict';
const path = require("path");
const pathExists = require("path-exists").sync;
const pkgDir = require('pkg-dir').sync;
const npminstall = require("npminstall");
const fse = require("fs-extra");
const formatepath = require("@universal-cli/formatepath");
const { getDefautRegister, getNpmLatestVersion } = require("@universal-cli/get-npm-info");


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
    // 获取特定版本的缓存目录
    specailCachPath(packageVersion){
        return path.resolve(this.storePath, `_${this.cachfilePathPrefix}@${packageVersion}@${this.packageName}`);
    }
    async prepare(){
        // 缓存目录不存在就创建
        if(this.storePath && !pathExists(this.storePath)) {
            await fse.mkdirp(this.storePath);
        }
        // 如果版本是latest就获取最新的版本号
        if(this.packageVersion == 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName);
        }
    }
    // 需要下载的包是否存在
    async exists(){
        if(this.storePath) {
            await this.prepare();
            return pathExists(this.cachPath);
        } else {
            return pathExists(this.targetPath);
        }
    }
    async install(){
        await npminstall({
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
    async update(){
        await this.prepare();
        // 获取最新版本号
        const latestPackageVersion = await getNpmLatestVersion(this.packageName);
        // 获取最新版本号的缓存目录
        const specialCachPath = this.specailCachPath(latestPackageVersion);
        // 如果不存在最新版本的缓存就下载
        if(!pathExists(specialCachPath)) {
            await npminstall({
                storePath: this.storePath,
                pkgs: [
                    {
                        name: this.packageName, 
                        version: latestPackageVersion
                    }
                ],
                root: this.targetPath,
                registry: getDefautRegister()
            })
        }
        // 缓存最新的版本
        this.packageVersion = latestPackageVersion; 
    }
    // 获取包的入口文件
     getRootfilePath(){
        const _getRootFile = (packageRoot) => {
            const dir =  pkgDir(packageRoot);
            if(dir) {
                // 加载package,json文件
                const pkg = require(path.resolve(dir, "./package.json"));
                if(pkg && pkg.main) {
                    // 兼容mac和window格式化路径
                    return formatePath(path.resolve(dir, pkg.main));
                }
            }
            return null;
        }
        if(this.storePath){
            return _getRootFile(this.cachPath);
        } else {
            return _getRootFile(this.targetPath);
        }
    }
}
module.exports = Package;
