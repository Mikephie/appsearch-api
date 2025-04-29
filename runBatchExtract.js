// runBatchExtract.js
const startSession = require('./appium/startSession');
const searchAndExtract = require('./appium/searchAndExtract');
const { readAppList, saveJson } = require('./utils/fileHelper');

async function run() {
  console.log('🚀 启动模拟器会话...');
  const driver = await startSession();

  const appList = readAppList();
  console.log(`📋 需要查询 ${appList.length} 个App`);

  const failedApps = [];

  for (const appName of appList) {
    console.log(`\n🔍 正在查询: ${appName}`);
    try {
      const data = await searchAndExtract(driver, appName);
      saveJson(appName, data);
      console.log(`✅ 成功提取: ${appName}`);
    } catch (err) {
      console.error(`❌ 提取失败: ${appName}`);
      failedApps.push(appName);
    }
  }

  console.log('\n🎯 批量提取完成！');
  if (failedApps.length > 0) {
    console.log('以下应用提取失败:');
    console.log(failedApps.join('\n'));
  }

  await driver.deleteSession();
  console.log('🛑 会话结束，退出。');
}

run().catch(err => {
  console.error('❗ 全局异常:', err);
  process.exit(1);
});
