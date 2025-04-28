export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "Missing app ID" });
    return;
  }

  const iTunesLookup = async (appId) => {
    const url = `https://itunes.apple.com/lookup?id=${appId}&country=us`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "iTunes Search/1.0",
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    if (data.resultCount === 0) throw new Error("App not found in iTunes");
    return data.results[0];
  };

  const AppSearchDetail = async (appId) => {
    const url = `https://api.appsearch.apple.com/v1/app/detail?id=${appId}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AppStore/3.0 iOS/17.0.1 model/iPhone14,2 hw/iPhone",
        "X-Device-Id": crypto.randomUUID(), // 模拟设备ID
        "Accept": "application/json",
        "Accept-Language": "en-US",
        "Connection": "keep-alive"
      }
    });
    if (!response.ok) throw new Error("AppSearch detail fetch failed");
    const detail = await response.json();
    return detail;
  };

  const detectRevenueCat = async (bundleId) => {
    const endpoints = [
      `https://api.revenuecat.com/v1/offerings`,
      `https://${bundleId}.revenuecat.com/v1/offerings`
    ];

    for (const endpoint of endpoints) {
      try {
        const resp = await fetch(endpoint, {
          method: "GET",
          headers: {
            "X-Platform": "ios",
            "X-Version": "3.13.0",
            "X-Client-Bundle-ID": bundleId,
            "X-Client-Version": "1.0",
            "User-Agent": "RevenueCat-iOS/3.13.0"
          },
          timeout: 3000
        });

        if (!resp.ok) continue;

        const data = await resp.json();
        const products = [];

        if (data && data.offerings) {
          Object.values(data.offerings).forEach(offering => {
            if (offering?.packages) {
              offering.packages.forEach(pkg => {
                if (pkg?.identifier) products.push(pkg.identifier);
              });
            }
          });
        }

        if (products.length > 0) return products;
      } catch (err) {
        // continue trying next
      }
    }

    return [];
  };

  try {
    // 第一步：iTunes基本资料
    const appInfo = await iTunesLookup(id);

    // 第二步：补充AppSearch detail
    let detail = null;
    try {
      detail = await AppSearchDetail(id);
    } catch (e) {
      // 忽略 detail失败，不影响主流程
    }

    // 第三步：自动探测RevenueCat产品列表
    let productIds = [];
    try {
      productIds = await detectRevenueCat(appInfo.bundleId);
    } catch (e) {
      // 探测失败就保持空
    }

    res.status(200).json({
      appId: appInfo.trackId,
      bundleId: appInfo.bundleId,
      appName: appInfo.trackName,
      productIds: productIds,
      appSearchDetail: detail || null
    });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
