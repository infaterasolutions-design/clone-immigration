import LiveUpdatePageContent from "@/components/LiveUpdatePageContent";

import { getLiveEventById } from "@/lib/liveUpdatesData";

export default async function IceNewsPage() {
  const event = await getLiveEventById("ice-immigration-enforcement-updates-live");
  return (
    <LiveUpdatePageContent
      event={event}
      breadcrumbLabel="ICE News"
      pageUrl="/ice-news/"
    />
  );
}
