const express = require('express');
const path = require('path')
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
var os = require("os");

const fetch = require('node-fetch');

const app = express();
const PORT = 8080;
const CACHINGTIME = 300 // time between cache updates in seconds
let baseUrl;

// Enable CORS for all routes
app.use(cors());

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static('static'));

app.get("/", function (req, res) {
  res.render('pages/index')
  // res.sendFile(path.join(__dirname, 'static', 'html', 'index.html'))
})

app.get("/home", function (req, res) {
  res.render('pages/home')
  // res.sendFile(path.join(__dirname, 'static', 'html', 'index.html'))
})

app.get("/favicon.ico", function (req, res) {
  res.sendFile(path.join(__dirname, 'static', 'images', 'WebbedLogo_blue2.png'))
})

app.get("/feed", function (req, res) {
  // const baseUrl = `${req.protocol}://${req.get("host")}`;
  const now = new Date();
  let xml = fs.readFileSync(path.join(__dirname, 'static', 'xml', 'tutorial_feed.xml'), 'utf8');
  xml = xml.replaceAll('{{BASE_URL}}', `http://${baseUrl}`);
  xml = xml.replaceAll('{{TIME_NOW}}', now);
  xml = xml.replaceAll('{{TIME_NOW_1}}', (new Date(now-60000*1)).toString());
  xml = xml.replaceAll('{{TIME_NOW_2}}', (new Date(now-60000*2)).toString());
  xml = xml.replaceAll('{{TIME_NOW_3}}', (new Date(now-60000*3)).toString());

  res.type('application/rss+xml').send(xml);
});

app.get("/tutorial", function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const rssCache = {};

const pLimit = require('p-limit');
const proxyLimit = pLimit(25);


// RSS/Atom feed proxy
app.get('/api/rss-proxy', async (req, res) => {
  let { url } = req.query;
  if (!baseUrl) { baseUrl = req.headers.host }
  if (url.includes(req.headers.host)) {
    url = url.replace(req.headers.host, "localhost:8080").replace("https://","http://")
  }

  if (!url) {
    return res.status(400).send('Missing "url" query parameter');
  }

  if (url in rssCache && (Date.now() - rssCache[url].timestamp) < (CACHINGTIME * 1000)) {
    res.send(rssCache[url].data);
    return;
  }

  try {
    const data = await proxyLimit(async () => {
      const response = await axios.get(url, {
        responseType: 'text',
        headers: { Accept: 'application/xml,text/xml,*/*' }
      });
      return response.data;
    });

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Content-Disposition', 'inline');
    console.log(url);
    res.send(data);

    rssCache[url] = {
      timestamp: Date.now(),
      data
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error.message);
    res.status(500).send('Failed to fetch RSS feed');
  }
});

// API Endpoint to get Channel ID (Code from edebu on GitHub: https://github.com/edebu/youtube-channel-id-finder)
app.post('/api/get-channel-id', async (req, res) => {
    const youtubeUrl = req.body.url;
    if (!youtubeUrl) {
        return res.status(400).json({ error: 'YouTube URL is required.' });
    }

    try {
        // console.log(`Fetching URL: ${youtubeUrl}`);
        // Fetch the HTML content of the YouTube channel page
        const response = await fetch(youtubeUrl, {
            headers: {
                // Mimic a browser user agent to avoid simple blocks
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();

        // Look for the channel ID using a regular expression
        // Common patterns: "externalId":"UC..." or <meta itemprop="channelId" content="UC...">
        const match = html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/<meta\s+itemprop="channelId"\s+content="(UC[\w-]{22})"/);

        if (match && match[1]) {
            const channelId = match[1];
            // console.log(`Found Channel ID: ${channelId}`);
            res.json({ channelId });
        } else {
            console.error('Could not find Channel ID in the page source.');
            res.status(404).json({ error: 'Could not find Channel ID. The URL might be incorrect, private, or the page structure might have changed.' });
        }
    } catch (error) {
        console.error('Error fetching or parsing YouTube URL:', error);
        res.status(500).json({ error: 'An error occurred while processing the URL.' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`RSS Proxy running on http://localhost:${PORT}`);
});
