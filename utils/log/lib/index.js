'use strict';

const log = require("npmlog");

log.level = process.env.debug ? process.env.debug : "info";
log.heading = "universal-cli";
log.headingStyle = {fg: "red", bg: "blue"}
log.addLevel("sucess", 2000, {bg: "yellow", fg: "black"})

module.exports = log;
