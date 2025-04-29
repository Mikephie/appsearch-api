// utils/fileHelper.js
const fs = require('fs');
const path = require('path');
const config = require('../config');

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readAppList(filePath = './app_list.txt') {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#')); // 忽略空行和注释
}

function saveJson(appName, data) {
  ensureDirExists(config.outputDir);
  const filePath = path.join(config.outputDir, `${appName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  ensureDirExists,
  readAppList,
  saveJson,
};
