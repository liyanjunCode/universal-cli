'use strict';

const log = require("npmlog");

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info";
log.heading = "universal-cli";
log.headingStyle = { fg: "red", bg: "blue" }

module.exports = log;
