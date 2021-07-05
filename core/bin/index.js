#! /usr/bin/env node 
const importLocal = require("import-local")
const core = require("../lib");
const log = require("npmlog");

if(importLocal(__filename)) {
    // npm 包运行
    log.info("bendi wenjian yingyongzhong")
} else {
    // 本地开发代码
    core();
}