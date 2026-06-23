"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getArticlesByAuthor } from "@/app/actions/authorActions";

const FALLBACK_IMAGE = "/images/logo.png";

export default function AuthorArticleList({ initialArticles, authorName, totalCount }) {
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length < totalCount);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextOffset = articles.length;
      const newArticles = await getArticlesByAuthor(authorName, 15, nextOffset);
      
      if (newArticles.length > 0) {
        setArticles(prev => [...prev, ...newArticles]);
        if (articles.length + newArticles.length >= totalCount || newArticles.length < 15) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Failed to load more articles:", e);
    } finally {
      setLoading(false);
    }
  };

  if (articles.length === 0) {
    return <p className="text-slate-500 text-sm">No articles published yet.</p>;
  }

  return (
    <div className="space-y-0">
      {articles.map((article) => {
        const articleUrl = article.cluster_slug
          ? `/${article.cluster_slug}/${article.slug}`
          : `/${article.slug}`;

        return (
          <article
            key={article.id}
            className="group pb-4 mb-4 border-b border-slate-100 flex gap-4 md:gap-6"
          >
            <Link prefetch={true} href={articleUrl} className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {article.category_label}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] text-slate-400 font-medium uppercase">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold headline-font group-hover:text-primary transition-colors mb-1 text-slate-900 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed hidden md:block">
                {article.sub_title}
              </p>
            </Link>

            <Link prefetch={true}
              href={articleUrl}
              className="w-[110px] h-[75px] md:w-[160px] md:h-[106px] overflow-hidden flex-shrink-0 block bg-slate-100 relative rounded-md"
            >
              {article.main_image ? (
                <Image
                  src={article.main_image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 110px, 160px"
                />
              ) : (
                <Image
                  src={FALLBACK_IMAGE}
                  alt={article.title}
                  fill
                  className="object-cover p-4 opacity-50 mix-blend-multiply group-hover:scale-105 transition-transform duration-500 grayscale"
                  sizes="(max-width: 768px) 110px, 160px"
                />
              )}
            </Link>
          </article>
        );
      })}

      {hasMore && (
        <div className="pt-6 pb-2 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold uppercase tracking-widest text-xs rounded-full hover:bg-slate-50 hover:text-primary hover:border-slate-300 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
