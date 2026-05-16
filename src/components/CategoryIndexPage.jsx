import Link from "next/link";
import Image from "next/image";
import SidebarWidgets from "./SidebarWidgets";

const FALLBACK_IMAGE = "/images/logo.png";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function getExcerpt(article) {
  if (article.sub_title) return article.sub_title;
  if (article.paragraphs && article.paragraphs[0]) return stripHtml(article.paragraphs[0]).slice(0, 200);
  return "";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function CategoryIndexPage({ category, subcategories, articles, activeSubcategory }) {
  const isAllActive = !activeSubcategory;

  return (
    <div className="max-w-[1298px] mx-auto px-3 md:px-4 lg:px-24 py-6 md:py-8 mb-12">
      
      {/* Header */}
      <div className="mb-6 md:mb-10 pb-4 md:pb-6 border-b border-slate-200">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold headline-font text-slate-900 mb-2 md:mb-4">
          {activeSubcategory
            ? subcategories.find(s => s.slug === activeSubcategory)?.name || category.name
            : category.name}
        </h1>
        {category.description && (
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Subcategory Filter Bar */}
      {subcategories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 -mt-2">
          <Link
            href={`/${category.slug}/`}
            className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-full border shadow-sm transition-all hover:shadow-md ${
              isAllActive
                ? "border-primary bg-primary text-white"
                : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary bg-white"
            }`}
          >
            All
          </Link>
          {subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${category.slug}/${sub.slug}/`}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-full border transition-all hover:shadow-sm ${
                activeSubcategory === sub.slug
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary bg-white"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          {articles.length === 0 ? (
            <div className="text-slate-500 py-10 text-center bg-slate-50 rounded-xl border border-slate-100">
              No articles found in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {articles.map((article) => (
                <Link
                  href={`/${article.slug}`}
                  key={article.id}
                  className="group flex flex-col space-y-3 md:space-y-4 cursor-pointer block border border-transparent hover:border-slate-100 pb-4 rounded-xl transition-all hover:shadow-lg bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl w-full">
                    <Image
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={article.main_image || FALLBACK_IMAGE}
                      alt={article.title}
                    />
                    <div className="absolute top-3 left-3 bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest rounded-sm shadow-md">
                      {article.category_label || category.name}
                    </div>
                  </div>
                  <div className="px-3 md:px-4 space-y-2 md:space-y-3 flex-grow">
                    <h3 className="text-lg md:text-xl font-extrabold headline-font leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                      {getExcerpt(article)}
                    </p>
                    <div className="flex items-center gap-3 pt-3 md:pt-4 text-[11px] text-slate-500 font-medium tracking-widest uppercase border-t border-slate-100 mt-auto">
                      <span className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {article.read_time || "5 min read"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 hidden lg:block">
          <SidebarWidgets showLiveCoverage={true} />
        </div>
      </div>
    </div>
  );
}
