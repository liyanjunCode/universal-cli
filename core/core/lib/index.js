'use strict';
const path = require("path");
const pkg = require("../package.json")
const log = require("@universal-cli/log");
const semver = require("semver");
const colors = require("colors/safe");
const { Command } = require("commander");

const { NODE_LOWER_VERSION, DEFAULT_CLI_HOME } = require("./const");
const pathExists = require("path-exists").sync;
const userHome = require("homedir")();
const {
  getNpmInfo,
  getVersions,
  getLatestVersion,
  getFilterFile,
} = require("@universal-cli/get-npm-info");

function core() {
    // 1. 脚手架环境准备
    try{
        prepare();
         // 2. 命令注册
        registerCommand();
        // 3. 命令执行
    } catch(err) {
        console.log(err)
    }
   
    
   
}
//  脚手架环境准备工作
function prepare(){
    checkUniVersion();
    checkNodeVersion();
    checkUserRoot();
    checkUserHome();
    checkArgs();
    getDotEnv();
    checkVersion();
}
// 命令注册
function registerCommand() {
    const program = new Command();
    program.name("universal-cli").usage("command [options]").
    version(pkg.version).
    option("-h, --help", "帮助信息").
    parse(process.argv)
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
    if(!userHome && !pathExists(userHome)) {
        log.warn(colors.red("主目录不存在"))
    }
}
// 解析参数
function checkArgs(){
    const args = require("minimist")(process.argv.slice(2));
    if (args.debug){
        process.env.LOG_LEVEL = "verbose"
    } else {
        process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
}
function getDotEnv(){
    const dotEnv = require("dotenv");
    const dotenvPath = path.resolve(userHome, ".env");
    if (pathExists(dotenvPath)) {
        dotEnv.config({
            path: dotenvPath
        });
    }
    createDefaultConfig();
}
function createDefaultConfig() {
  const config = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    config['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    config["cliHome"] = path.join(userHome, DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = config["cliHome"];
}
async function checkVersion(){
    const pkgName = pkg.name;
    const pkgVersion = pkg.version;
    const pkgInfo = await getNpmInfo(pkgName);
    const versions = getVersions(pkgInfo.versions);
    const filterVersions = getFilterFile(versions, pkgVersion);
    const latestVersion = getLatestVersion(filterVersions);
    if(latestVersion) {
        log.warn(colors.yellow(`当前npm最新版本为${latestVersion},您当前的版本为${pkgVersion},请使用 npm isntall ${pkgName}进行插件更新升级`));
    }
}
module.exports = core;
