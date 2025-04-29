// appium/startSession.js
const wdio = require('webdriverio');
const config = require('../config');

async function startSession() {
  const opts = {
    path: '/wd/hub',
    port: config.appiumServer.port,
    hostname: config.appiumServer.host,
    capabilities: {
      platformName: config.device.platformName,
      deviceName: config.device.deviceName,
      platformVersion: config.device.platformVersion,
      automationName: config.device.automationName,
      bundleId: config.device.appPackage,
      noReset: true,
      newCommandTimeout: 300, // 会话超时时间
    },
  };

  const driver = await wdio.remote(opts);
  await driver.pause(config.timeouts.appLaunch); // 等待App完全打开
  await driver.setImplicitTimeout(config.timeouts.implicit);
  return driver;
}

module.exports = startSession;
