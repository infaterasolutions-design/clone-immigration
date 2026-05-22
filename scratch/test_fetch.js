const http = require('http');

const paths = [
  '/sitemap.xml',
  '/sitemap-news.xml',
  '/sitemap-categories.xml',
  '/sitemap-posts.xml',
  '/sitemap-pages.xml',
  '/sitemap-locations.xml',
  '/sitemap-shorts.xml'
];

async function checkSitemaps() {
  for (const path of paths) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`[${res.statusCode}] ${path} | Type: ${res.headers['content-type']} | Bytes: ${data.length}`);
          if (res.statusCode !== 200) {
            console.error(`Error: ${path} returned ${res.statusCode}`);
            console.error(data.slice(0, 500));
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Error fetching ${path}:`, err.message);
        resolve();
      });
    });
  }
}

checkSitemaps();
