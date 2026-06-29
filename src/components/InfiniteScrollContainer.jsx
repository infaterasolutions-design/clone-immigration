"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ArticleSection from "./ArticleSection";
import ScrollToTopButton from "./ScrollToTopButton";
import SidebarWidgets from "./SidebarWidgets";
import { fetchNextArticleAction } from "@/app/actions/article";

const MAX_ARTICLES = 4;

export default function InfiniteScrollContainer({ initialArticle, sidebarData, nextArticle, customWidgets = { mid: [], end: [] }, sponsoredContent = [] }) {
  // Initialize with initialArticle, and nextArticle if it exists
  const initialArticles = nextArticle ? [initialArticle, nextArticle] : [initialArticle];
  
  const [articles, setArticles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  // Only try to load more if we actually found a next article to begin with
  const [hasMore, setHasMore] = useState(initialArticles.length < MAX_ARTICLES && !!nextArticle);
  const [visibleArticle, setVisibleArticle] = useState(initialArticle.id);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const visibilityObserverRef = useRef(null);

  const fetchNextArticle = useCallback(async () => {
    if (isLoading || !hasMore || articles.length >= MAX_ARTICLES) return;

    try {
      setIsLoading(true);
      const currentLastArticle = articles[articles.length - 1];
      const nextArticle = await fetchNextArticleAction(currentLastArticle.slug, currentLastArticle.published_at);

      if (nextArticle) {
        setArticles((prev) => [...prev, nextArticle]);
        if (articles.length + 1 >= MAX_ARTICLES) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load next article:", error);
    } finally {
      setIsLoading(false);
    }
  }, [articles, isLoading, hasMore]);

  // Observer for triggering fetch
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNextArticle();
      }
    }, { rootMargin: "200px" });

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchNextArticle, hasMore]);

  // Observer for URL updates based on visibility
  useEffect(() => {
    if (visibilityObserverRef.current) visibilityObserverRef.current.disconnect();

    let timeoutId = null;

    visibilityObserverRef.current = new IntersectionObserver(
      (entries) => {
        // Find the intersecting marker
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        
        if (intersectingEntry) {
          const articleId = intersectingEntry.target.getAttribute("data-article-id");
          const articleSlug = intersectingEntry.target.getAttribute("data-article-slug");
          const articleTitle = intersectingEntry.target.getAttribute("data-article-title");
          
          if (articleId) {
            // Use functional state update to avoid dependency issues
            setVisibleArticle((prevVisibleId) => {
              // Only update URL and state if the article actually changed
              if (prevVisibleId !== articleId) {
                if (timeoutId) clearTimeout(timeoutId);
                
                // Debounce to prevent flickering on boundary micro-scrolls
                timeoutId = setTimeout(() => {
                  if (articleSlug) {
                    window.history.replaceState(null, "", `/${articleSlug}`);
                  } else {
                    window.history.replaceState(null, "", `/article/${articleId}`);
                  }
                  if (articleTitle) {
                    document.title = `${articleTitle} | US Immigration News`;
                  }
                }, 150);
                
                return articleId;
              }
              return prevVisibleId;
            });
          }
        }
      },
      { rootMargin: "-10% 0px -30% 0px", threshold: 0 } // Trigger when the title enters the lower-middle viewport
    );

    const markers = document.querySelectorAll(".article-top-marker");
    markers.forEach((marker) => {
      visibilityObserverRef.current.observe(marker);
    });

    return () => {
      if (visibilityObserverRef.current) visibilityObserverRef.current.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [articles]); // Removed visibleArticle from dependencies

  const scrollToNextArticle = () => {
    const currentIndex = articles.findIndex((a) => a.id === visibleArticle);
    const isNextAvailable = currentIndex >= 0 && currentIndex < articles.length - 1;
    
    if (isNextAvailable) {
      const nextArticle = articles[currentIndex + 1];
      const el = document.getElementById(`article-${nextArticle.id}`);
      if (el) {
        const yOffset = -20;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else if (hasMore && loaderRef.current) {
      loaderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentIndex = articles.findIndex((a) => a.id === visibleArticle);
  const isNextDisabled = currentIndex === articles.length - 1 && !hasMore;

  return (
    <>
      <div className="pt-4 md:pt-8 pb-0 px-3 md:px-4 lg:px-24 max-w-[1298px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
        <div className="lg:col-span-8 flex flex-col gap-2 md:gap-3">
          {articles.map((article, index) => (
            <ArticleSection key={`article-${article.id}`} article={article} isFirst={index === 0} customWidgets={index === 0 ? customWidgets : { mid: [], end: [] }} sponsoredContent={sponsoredContent} />
          ))}
          
          {/* Loading Indicator / Sentinel */}
          {hasMore && articles.length < MAX_ARTICLES && (
            <div ref={loaderRef} className="py-8 flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Next Story...</span>
            </div>
          )}

          {/* End of Feed Message and Mobile Sidebar */}
          {(!hasMore || articles.length >= MAX_ARTICLES) && (
            <>
              <div className="block lg:hidden mt-12 mb-16">
                <SidebarWidgets className="w-full" initialData={sidebarData} />
              </div>
              <div className="py-20 text-center text-slate-400 text-sm font-medium">
                You've reached the end of the feed.
              </div>
            </>
          )}
        </div>

        {/* Sidebar Section (Desktop) */}
        <div className="hidden lg:block lg:col-span-4">
          <SidebarWidgets className="w-full" initialData={sidebarData} />
        </div>
      </div>

      {/* Fixed Bottom "Up Next" Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 sm:px-6 py-2.5 sm:py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1298px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            {/* Mobile: one line */}
            <div className="flex sm:hidden items-center gap-1 min-w-0 max-w-[160px]">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest whitespace-nowrap">Reading:</span>
              <span className="text-[10px] font-bold truncate text-slate-800">
                {articles.find((a) => a.id === visibleArticle)?.title || articles[0].title}
              </span>
            </div>
            {/* Desktop: two lines (unchanged) */}
            <div className="hidden sm:block">
              <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">Currently Reading</div>
              <div className="text-sm font-bold max-w-xs truncate text-slate-800">
                {articles.find((a) => a.id === visibleArticle)?.title || articles[0].title}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 whitespace-nowrap">Article {currentIndex >= 0 ? currentIndex + 1 : 1} of {hasMore ? "4" : articles.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
             <button 
               onClick={scrollToNextArticle}
               disabled={isNextDisabled}
               className={`px-3 sm:px-6 py-1.5 sm:py-2 bg-primary text-on-primary rounded-full text-[10px] sm:text-xs font-bold hover:scale-105 transition-all ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-sm hover:shadow-md'}`}
             >
               Next Story
             </button>
             <ScrollToTopButton />
          </div>
        </div>
      </div>
    </>
  );
}
