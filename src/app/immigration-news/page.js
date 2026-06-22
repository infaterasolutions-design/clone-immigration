import LiveUpdatePageContent from "@/components/LiveUpdatePageContent";

import { getLiveEventById } from "@/lib/liveUpdatesData";

export default async function ImmigrationNewsPage() {
  const event = await getLiveEventById("immigration-news-today-trump-announcements-uscis-updates-policy-developments");
  return (
    <LiveUpdatePageContent
      event={event}
      breadcrumbLabel="Immigration News"
      pageUrl="/immigration-news/"
    />
  );
}
