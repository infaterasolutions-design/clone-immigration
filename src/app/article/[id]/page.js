import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { fetchArticleInitialData } from "@/app/actions/article";
import { getActiveSponsoredContent } from "@/app/actions/sponsoredActions";
import { notFound } from "next/navigation";

export default async function ArticleByIdPage({ params }) {
  const { id } = await params;
  
  // 1. Fetch initial SSR article and sponsored content
  const [article, { data: sponsoredContent }] = await Promise.all([
    fetchArticleInitialData(id),
    getActiveSponsoredContent(),
  ]);

  const now = new Date();
  const publishedAt = article?.published_at 
    ? new Date(article.published_at) 
    : null;

  if (
    !article ||
    article.status !== 'published' ||
    (publishedAt && publishedAt > now)
  ) {
    return notFound();
  }
  
  // 2. Delegate rendering entirely to the smart client orchestrator
  return (
    <InfiniteScrollContainer initialArticle={article} sponsoredContent={sponsoredContent || []} />
  );
}
