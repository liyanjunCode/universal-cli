// 'use strict';
const path = require("path");
const log = require("@universal-cli/log");
const Package = require("@universal-cli/package");
const pkg = require("../package.json");
const spawn = require("@universal-cli/spawn");
module.exports = exec;

// 用于多团队的动态加载初始化命令， 各团队可根据自身业务定制自己的初始化逻辑
const commandInit = {
    init: "@universal-cli/init"
}
// 缓存依赖的目录
const catchDir = "dependences";
async function exec() {
    // TODO
    let targetPath = process.env.CLI_TARGET_PATH;
    let homePath = process.env.CLI_HOME_PATH;
    let storePath = '';
    // 动态获取执行的包名称
    const args = Array.from(arguments);
    const command = args[args.length - 1];
    const packageName = commandInit[command.name()];
    const packageVersion = "latest";
    log.verbose(targetPath, "targetPath");
    log.verbose(homePath, "homePath");
    // targetPath用于判断是否执行本地代码
    // 如果targetPath不存在则去下载或更新package
    let package;
    if(!targetPath) {
        targetPath = path.resolve(homePath, catchDir);
        storePath = path.resolve(targetPath, 'node_modules');
        package = new Package({
            storePath,
            targetPath,
            packageName,
            packageVersion
        });
        if(!package.exists()){
            //不存在下载 
            await package.install();
        } else {
            // 存在更新
            await package.update();
        }
    } else {
        // 执行本地代码的初始化
        package = new Package({
            storePath,
            targetPath,
            packageName,
            packageVersion
        });
    }
    //  判断入口文件是否存在, 就动态生成命令并用子线程执行
    const rootPath = package.getRootfilePath();
    if(rootPath) {
        try {
            const o = Object.create(null);
            Object.keys(command).forEach((key, val) => {
                if(command.hasOwnProperty(key) && !key.startsWith("_") && key != "parent"){
                    o[key] = command[key];
                } 
            })
            args[args.length - 1] = o;
            const code = `require('${rootPath}').call(null,${JSON.stringify(args)})`;
            const child = spawn("node", ["-e", code], { cwd: process.cwd(), stdio: "inherit"});
            child.on("error", e => {
                log.error(e.message);
                process.exit(1);
            })
            child.on("exit", e => {
                log.verbose("命令执行成功" + e);
                process.exit(e);
            })
        } catch(err) {
            log.error(err);
        }
    }
}
