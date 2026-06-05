import { Feed } from "feed";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://www.unitedstatesimmigrationnews.com";

/**
 * Generates an RSS Feed instance populated with articles.
 * 
 * @param {string} [categoryFilter] - Optional category slug to filter articles. If omitted, returns all categories.
 * @param {number} [limit=20] - Maximum number of articles to include in the feed.
 * @returns {Promise<Feed>} The populated Feed instance.
 */
export async function generateRSSFeed(categoryFilter = null, limit = 20) {
  const feed = new Feed({
    title: "United States Immigration News",
    description: "Latest H-1B, Green Card, Visa, USCIS & Citizenship Updates",
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    image: `${SITE_URL}/images/logo.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, United States Immigration News`,
    updated: new Date(),
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${SITE_URL}/rss.xml`,
      h1b: `${SITE_URL}/rss/h1b.xml`,
      greenCard: `${SITE_URL}/rss/green-card.xml`,
      visa: `${SITE_URL}/rss/visa.xml`,
      citizenship: `${SITE_URL}/rss/citizenship.xml`,
      live: `${SITE_URL}/rss/live.xml`,
    },
    author: {
      name: "United States Immigration News",
      email: "contact@unitedstatesimmigrationnews.com",
      link: SITE_URL,
    },
  });

  try {
    let query = supabase
      .from("articles")
      .select("title, slug, cluster_slug, sub_title, main_image, author_name, category_label, category_slug, published_at, paragraphs")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(limit);

    if (categoryFilter) {
      if (categoryFilter === 'live') {
        query = query.in("category_slug", ["live", "breaking-news"]);
      } else {
        query = query.eq("category_slug", categoryFilter);
      }
    }

    const { data: articles, error } = await query;

    if (error) {
      console.error("Error fetching articles for RSS:", error);
      return feed;
    }

    if (articles) {
      articles.forEach((article) => {
        // Build the permanent article URL
        const url = article.cluster_slug
          ? `${SITE_URL}/${article.cluster_slug}/${article.slug}`
          : `${SITE_URL}/${article.slug}`;

        // Get rich text or plain text snippet
        let content = article.sub_title || "";
        if (article.paragraphs && article.paragraphs.length > 0) {
          content = article.paragraphs[0]; // first paragraph or rich HTML
        }

        feed.addItem({
          title: article.title,
          id: url, // guid
          link: url,
          description: article.sub_title,
          content: content,
          author: [
            {
              name: article.author_name || "Editorial Team",
            },
          ],
          date: new Date(article.published_at),
          category: [
            {
              name: article.category_label || "Immigration News",
            },
          ],
          image: article.main_image ? (article.main_image.startsWith("http") ? article.main_image : `${SITE_URL}${article.main_image}`) : `${SITE_URL}/images/logo.png`,
        });
      });
    }
  } catch (err) {
    console.error("RSS Feed Generation Exception:", err);
  }

  return feed;
}
