'use strict';
const semver = require("semver");
const { NODE_LOWER_VERSION } = require("./const.js");
const colors = require("colors");
const log = require("@universal-cli/log");
class Commander {
    // TODO
    constructor(args){
        if(!args){
            throw new Error(colors.red("无参数， 请传入参数"));
        }
        if(!Array.isArray(args)) {
            throw new Error(colors.red("传入参数必须是数组"));
        }
        this._args = args;
        let chain = Promise.resolve();
        chain = chain.then(() => this.checkNodeVersion());
        chain = chain.then(() => this.initArgs());
        chain =  chain.then(() => this.init());
        chain =  chain.then(() => this.exec());
        chain.catch((err) => { log.error(err) });

    }
    // 初始化参数
    initArgs(){
        this.cmds = this._args[this._args.length - 1];
        this.args = this._args.slice(0, this._args.length - 1);
    }
    // 检查node版本
    checkNodeVersion(){
        if(semver.gt(NODE_LOWER_VERSION, process.version)) {
            throw new Error(colors.green("你当前的node版本为") + colors.red(process.version) + "," + colors.green("脚手架最低node版本要求为") + colors.red(NODE_LOWER_VERSION) + "," +  colors.green("请升级node"))
        }
    }
    // 初始化准备
    init(){
        throw new Error(colors.green("子类必须实现init方法"));
    }
    // 命令执行
    exec(){
        throw new Error(colors.green("子类必须实现exec方法"));
    }

}

module.exports = Commander;
