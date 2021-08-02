'use strict';
const path = require("path");
const log = require("@universal-cli/log");
const Package = require("@universal-cli/package");
const pkg = require("../package.json");
module.exports = exec;

// 用于多团队的动态加载初始化命令， 各团队可根据自身业务定制自己的初始化逻辑
const commandInit = {
    init: "@universal-cli/init"
}
// 缓存依赖的目录
const catchDir = "dependences";
function exec(name, options, command) {
    // TODO
    let targetPath = process.env.CLI_TARGET_PATH;
    let homePath = process.env.CLI_HOME_PATH;
    let storePath = '';
    // 动态获取执行的包名称
    const packageName = commandInit[command.name()];
    const packageVersion = "latest";
    log.verbose(targetPath, "targetPath");
    log.verbose(homePath, "homePath");
    // targetPath用于判断是否执行本地代码
    // 如果targetPath不存在则去下载或更新package
    if(!targetPath) {
        targetPath = path.resolve(homePath, catchDir);
        storePath = path.resolve(targetPath, 'node_moudles');
        new Package({
            storePath,
            targetPath,
            packageName,
            packageVersion
        })
    } else {
        // 执行本地代码的初始化
    }
}
