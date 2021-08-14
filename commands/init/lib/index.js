'use strict';
const fs = require("fs");
const Commander = require("@universal-cli/Commander");
const log = require("@universal-cli/log");
const fse = require("fs-extra");
const inquirer = require('inquirer');

class InitComand extends Commander{
    async init(){
        this.projectName = this.args[0];
        this.force =  this.args[1].force;
        try {
            const projectInfo = await this.prepare();
            console.log(projectInfo)
        } catch(err){
            log.error(err);
        }
        
    }
    exec(){

    }
    async prepare(){
        const root = process.cwd();
       
        // 如果不为空文件夹， 就要询问用户是否清空
        if(!this.isEmptyDir(root)) {
            let result;
            // 如果用户未输入强制清空文件， 需要询问
            if(!this.force) {
                result = (await inquirer.prompt([{
                    type: "confirm",
                    name: "clear",
                    message:"文件夹为非空， 是否继续创建?",
                    default: false,
                }])).clear
            }
            if(!result){return;}
            // 确认是否真的清空文件夹
            const { forceClear } = await inquirer.prompt([{
                type: "confirm",
                name: "forceClear",
                message:"是否确定清空文件夹继续创建？",
                default: false,
            }])
            if(forceClear) {
                fse.emptyDirSync(root);
            } 
        }
        return this.getProjecInfo();
    }
    async getProjecInfo(){
        function isValidName(v) {
            return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
        }
        const projectInfo = {};
        const TEMEPLATE_PROJECT = "项目";
        const TEMEPLATE_COMPONENT = "组件";
        let projectNameValid = false;
        if(isValidName(this.projectName)){
            projectNameValid = true;
            projectInfo.projectName = this.projectName;
        }
        const { type } = await inquirer.prompt([{
            type: "list",
            name: "type",
            message:"请选择创建类型",
            default: TEMEPLATE_PROJECT,
            choices:[
                {
                    name:"项目",
                    value:TEMEPLATE_PROJECT
                },
                {
                    name:"组件",
                    value:TEMEPLATE_COMPONENT
                }   
            ]
        }]);
        const inquirerList = [];
        if(this.projectName){
            projectInfo.projectName = this.projectName;
        } else {
            inquirerList.push({
                type: "input",
                name: "projectName",
                message:`请输入${type}名称`,
                default: "uni-project",
                validate(name){
                    console.log(name, 22)
                    return true;
                }
            })
        }
        inquirerList.push({
            type: "input",
            name: "version",
            message:"请输入版本号",
            default: "1.0.0",
        })
        if(type === TEMEPLATE_PROJECT) {
           
        } else if(type === TEMEPLATE_COMPONENT) {
            inquirerList.push({
                type: "input",
                name: "description",
                message:"请输入描述信息",
                default: "",
            })
        }
        const res = await inquirer.prompt(inquirerList);
        return {...res, type };
    }
    isEmptyDir(root){
        let files = fs.readdirSync(root);
        files = files.filter(file => !(file.startsWith(".") || ~~file.indexOf("node_modules") == 0));
        return files.length == 0;
    }

}

function init(args) {
    // TODO
    return new InitComand(args)
}

module.exports = init;
module.exports.Commander = Commander
