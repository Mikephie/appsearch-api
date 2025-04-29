// config.js
module.exports = {
  appiumServer: {
    host: '127.0.0.1',
    port: 4723, // Appium 默认端口
  },
  device: {
    platformName: 'iOS',
    deviceName: 'iPhone 15', // 你的模拟器名字，按实际情况改
    platformVersion: '17.4', // 模拟器系统版本
    automationName: 'XCUITest',
    appPackage: 'com.myappsearch', // MyAppSearch的Bundle ID，注意确认
  },
  timeouts: {
    implicit: 5000, // 查找元素的默认超时时间（毫秒）
    appLaunch: 10000, // 启动App后的等待时间（毫秒）
  },
  outputDir: './extracted', // 提取结果保存目录
};
