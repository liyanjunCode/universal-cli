'use strict';
const axios = require("axios");

async function getNpmInfo(pkgName, origin) {
    if(!pkgName) {
        return null;
    }
    const register = getNpmRegister(pkgName, origin);
    const npmInfo = await getNpm(register);
    return npmInfo;
}

function getNpmRegister(pkgName, origin) {
    return origin ? origin + "/" + pkgName :  getDefautRegister(pkgName);
}
// 获取默认注册信息
function getDefautRegister(pkgName, isOrigin) {
    return (isOrigin ? "https://registry.npmjs.org/" : "https://registry.npm.taobao.org/") + pkgName
}

async function getNpm(register) {
    const res = await axios.get(register);
    if(res.status == 200) {
        return res.data;
    }
    return null;
}
function getVersions(versionData){
    return versionData ? ["1.1.5","0.1.5","1.2.5", ...Object.keys(versionData), "0.1.3","0.1.2","0.1.0"] : [];
}
function getLatestVersion(versions){
    if(versions && versions.length > 0) {
        return versions[0];
    }
    return null;
}
module.exports = {
    getNpmInfo,
    getVersions,
    getLatestVersion
};
