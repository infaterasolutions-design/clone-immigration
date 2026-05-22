import { getAllArticles } from "@/lib/mockData";
import { getLiveEvents } from "@/lib/liveUpdatesData";
import { getVideos } from "@/lib/supabaseHelpers";
import { getHomepageLayout } from "@/app/actions/homepageLayout";
import HomePageContent from "@/components/HomePageContent";

export const revalidate = 3600; // Cache the HTML for 1 hour instead of 60 seconds

export default async function Home() {
  const [articles, events, vids, layout] = await Promise.all([
    getAllArticles(),
    getLiveEvents(),
    getVideos(),
    getHomepageLayout()
  ]);
  const tickerItems = (events || []).slice(0, 5);

  return (
    <HomePageContent 
      articles={articles}
      tickerItems={tickerItems}
      videoArticles={vids}
      layout={layout}
    />
  );
}
