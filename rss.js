const Parser = require("rss-parser");
const axios = require("axios");

const parser = new Parser({
  headers: { "User-Agent": "Mozilla/5.0" },
});

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// daftar kategori
// const SOURCES = JSON.parse(process.env.SOURCES_JSON || "[]");
const SOURCES = [
  {
    name: "Teknologi",
    url: "https://www.cnnindonesia.com/teknologi/rss",
    color: 3447003,
  },
  {
    name: "Nasional",
    url: "https://www.cnnindonesia.com/nasional/rss",
    color: 15105570,
  },
  {
    name: "Internasional",
    url: "https://www.cnnindonesia.com/internasional/rss",
    color: 15105570,
  },
  {
    name: "Olahraga",
    url: "https://www.cnnindonesia.com/olahraga/rss",
    color: 15105570,
  },
  {
    name: "otomotif",
    url: "https://www.cnnindonesia.com/otomotif/rss",
    color: 15105570,
  },
  {
    name: "Hiburan",
    url: "https://www.cnnindonesia.com/hiburan/rss",
    color: 15105570,
  },
  {
    name: "Ekonomi",
    url: "https://www.cnnindonesia.com/ekonomi/rss",
    color: 15105570,
  },
];

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
    sentLinks = new Set([...sentLinks].slice(-50));
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

checkFeeds(); // jalan langsung
setInterval(checkFeeds, 5 * 60 * 1000);
