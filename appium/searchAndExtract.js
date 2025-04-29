// appium/searchAndExtract.js
/**
 * 控制MyAppSearch应用：输入App名字 ➔ 获取查询结果 ➔ 返回Product IDs
 */
async function searchAndExtract(driver, appName) {
  try {
    // 1. 找到搜索输入框，点击并输入appName
    const searchField = await driver.$('XCUIElementTypeSearchField');
    await searchField.click();
    await searchField.setValue(appName);

    // 2. 等待结果出现（假设第一个元素是结果）
    await driver.pause(3000); // 可以根据App实际反应速度调整

    const firstResult = await driver.$('XCUIElementTypeCell');
    await firstResult.click();

    // 3. 等待进入详情页
    await driver.pause(3000);

    // 4. 提取页面中所有 Product ID （假设可以通过 text 匹配）
    const productIdElements = await driver.$$(`//*[contains(@label, "product_id")]`);
    const productIds = [];

    for (let el of productIdElements) {
      const label = await el.getAttribute('label');
      if (label) {
        productIds.push(label.trim());
      }
    }

    return {
      app: appName,
      products: productIds,
    };

  } catch (err) {
    console.error(`[searchAndExtract] 提取失败: ${appName} -> ${err.message}`);
    throw err;
  }
}

module.exports = searchAndExtract;
