import { generateRSSFeed } from "@/lib/rss";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const feed = await generateRSSFeed("citizenship", 10);
    return new Response(feed.rss2(), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("RSS generation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
