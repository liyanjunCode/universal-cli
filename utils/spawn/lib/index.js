'use strict';
const child = require("child_process");
module.exports = spawn;

function spawn(command, options, args) {
    // TODO
    const win = process.platform == "win32";
    const cmd = win ? 'cmd' : command;
    const cmdArgs = win ? ["/c"].concat(command, options) : options;
    return child.spawn(cmd, cmdArgs, args || {});
}
