'use strict';
const pkg = require("../package.json")
const log = require("@universal-cli/log");

let userHome;
function core() {
    // 1. 前期准备工作
    prepare();
    // 2. 命令注册
    // 3. 命令执行
   
}
//  脚手架环境准备工作
function prepare(){
    checkUniVersion();
    checkNodeVersion();
    checkUserHome();
}
// 检查脚手架当前版本
function checkUniVersion() {
    log.info("universal-cli", "版本为：%j", pkg.version);
}
// 查看node版本
function checkNodeVersion(){
    log.info("node", "版本为 %j", process.version);
}

// 查看用户权限并更改
function rootCheck(){
    const rootCheck = require("root-check");
    rootCheck();
}
//  获取用户主目录
function checkUserHome(){
    userHome = require("homedir")();
    
    log.info("homedir", "用户主目录 %j", userHome);
}
module.exports = core;
