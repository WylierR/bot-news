const Parser = require("rss-parser");
const axios = require("axios");

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0" },
});

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// daftar kategori
const SOURCES = JSON.parse(process.env.SOURCES_JSON || "[]");

// simpan history
let sentLinks = new Set();

async function checkFeeds() {
  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items.slice(0, 2)) {
        if (sentLinks.has(item.link)) continue;

        sentLinks.add(item.link);

        const imageUrl = extractImage(item);

        await axios.post(WEBHOOK_URL, {
          embeds: [
            {
              title: item.title,
              url: item.link,
              description: item.contentSnippet || "Tidak ada deskripsi",
              color: source.color,
              footer: {
                text: source.name,
              },
              timestamp: new Date().toISOString(),
              image: imageUrl ? { url: imageUrl } : undefined,
            },
          ],
        });

        console.log(`[${source.name}]`, item.title);
      }
    } catch (err) {
      console.error(`Error ${source.name}:`, err.message);
    }
  }

  // batasi memory
  if (sentLinks.size > 100) {
    sentLinks.clear();
  }
}

function extractImage(item) {
  // 1. enclosure
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  // 2. media:content
  if (item["media:content"]?.url) {
    return item["media:content"].url;
  }

  // 3. media:thumbnail
  if (item["media:thumbnail"]?.url) {
    return item["media:thumbnail"].url;
  }

  // 4. ambil dari HTML <img>
  if (item.content) {
    const match = item.content.match(/<img.*?src="(.*?)"/);
    if (match) return match[1];
  }

  return null;
}

// jalan tiap 5 menit
setInterval(checkFeeds, 5 * 60 * 1000);
