'use strict';
const pkg = require("../package.json")
const log = require("@universal-cli/log");
const semver = require("semver");
const colors = require("colors/safe");
const { NODE_LOWER_VERSION } = require("./const");
const { getNpmInfo, getVersions, getLatestVersion } = require('@universal-cli/get-npm-info');


let userHome;
function core() {
    // 1. 前期准备工作
    try{
        prepare();
    } catch(err) {
        console.log(err)
    }
    // 2. 命令注册
    // 3. 命令执行
   
}
//  脚手架环境准备工作
function prepare(){
    checkUniVersion();
    checkNodeVersion();
    checkUserRoot();
    checkUserHome();
    checkArgs();
    checkVersion();
}
// 检查脚手架当前版本
function checkUniVersion() {
    log.info( "脚手架版本为", pkg.version);
}
// 查看node版本
function checkNodeVersion(){
    if(semver.gt(NODE_LOWER_VERSION, process.version)) {
        throw new Error(colors.green("你当前的node版本为") + colors.red(process.version) + "," + colors.green("脚手架最低node版本要求为") + colors.red(NODE_LOWER_VERSION) + "," +  colors.green("请升级node"))
    }
}

// 查看用户权限并更改， 防止用户使用管理员权限导致不兼容
function checkUserRoot(){
    const rootCheck = require("root-check");
    rootCheck(); 
}
//  获取用户主目录, 主要是为了向主目录中写入缓存
function checkUserHome(){
    userHome = require("homedir")();
    
    log.info("用户主目录", userHome);
}
// 解析参数
function checkArgs(){
    const args = require("minimist")(process.argv.slice(2));
    args.debug && (log.level = "verbose");
    log.verbose("111", "2222")
}

async function checkVersion(){
    const pkgName = pkg.name;
    const pkgVersion = pkg.version;
    const pkgInfo = await getNpmInfo(pkgName);
    const versions = getVersions(pkgInfo.versions);
    
    versions.filter(version => semver.satisfies(version, `>${pkgVersion}`)).sort((a, b) => semver.gt(a, b) ? -1 : 1);
    console.log(versions,"versions")
    const latestVersion = getLatestVersion(versions);
    console.log(latestVersion)
}
module.exports = core;
