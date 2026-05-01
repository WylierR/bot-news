# bot-news
Fetch news from RSS feeds and send them to Discord automatically. Supports multiple sources, categories, and images.

---

## ✨ Features

* 🔗 Multiple RSS sources (news, social media, etc.)
* 🧠 Category-based filtering
* 🚫 Duplicate prevention
* 🖼️ Automatic image extraction (if available)
* 📩 Rich Discord embed formatting
* ⏱️ Scheduled fetching (auto update)

---

## 🧠 Workflow

This is how the application works step by step:

```text
RSS Sources → Fetch Data → Filter → Process → Send to Discord
```

### 1. Fetch RSS Feeds

The script periodically requests data from multiple RSS URLs (e.g. news websites or aggregated feeds).

### 2. Parse Data

Using an RSS parser, the XML response is converted into usable JavaScript objects.

### 3. Filter Content

* Select only the latest items
* Filter by category or keyword (optional)
* Skip already processed links (avoid duplicates)

### 4. Extract Information

From each item, the script extracts:

* Title
* Link
* Description
* Image (if available from enclosure/media/content)

### 5. Send to Discord

The processed data is sent to a Discord channel using a webhook with embed formatting:

* Title with clickable link
* Description preview
* Image preview (if available)
* Source/category label

### 6. Repeat Automatically

The process runs continuously using a timer (e.g. every 5 minutes).

---

## ⚙️ Installation

```bash
npm install
```

---

## ▶️ Usage

```bash
node rss.js
```

---

## 🔐 Environment Variables

Create variables in your deployment platform (e.g. Railway):

```env
WEBHOOK_URL=your_discord_webhook_url
```

---

## 🌐 Example RSS Sources

* CNN Indonesia RSS
* Detik RSS
* BBC RSS
* Custom RSS via RSS generators

---

## 🚀 Deployment

You can deploy this project on platforms like:

* Railway
* Render

This allows the bot to run 24/7 without relying on your local machine.

---

## ⚠️ Notes

* Not all RSS feeds include images
* Some sources may have rate limits
* Use a reasonable interval (recommended: ≥ 5 minutes)

---

## 📄 License

MIT License
