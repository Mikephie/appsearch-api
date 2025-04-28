export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "Missing app ID" });
    return;
  }

  const url = `https://itunes.apple.com/lookup?id=${id}&country=us`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "iTunes Search/1.0",
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (data.resultCount === 0) {
      res.status(404).json({ error: "App not found" });
      return;
    }

    const app = data.results[0];

    res.status(200).json({
      appId: app.trackId,
      bundleId: app.bundleId,
      appName: app.trackName,
      productIds: [],
    });
  } catch (err) {
    res.status(502).json({ error: "Fetch failed", message: err.message });
  }
}
