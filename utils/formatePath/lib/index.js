'use strict';
const path = require("path");

module.exports = formatepath;

function formatepath(root) {
    // TODO
    const sep = path.sep;
    if(root && typeof root == "string") {
        if(sep == "/"){
            return root;
        } else {
            return root.replace(/\\/g, "/");
        }
    }
    return root;
}
