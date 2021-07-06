#! /usr/bin/env node 
const importLocal = require("import-local")
const core = require("../lib");

if(importLocal(__filename)) {
    // npm 包运行
    require("npmlog").info("universal-cli", "运行的是npm下载版本");
} else {
    // 本地开发代码
    core();
}