import Link from 'next/link';
import Image from 'next/image';

export default function RelatedArticles({ title, articles, variant }) {
  if (!articles || articles.length === 0) return null;

  if (variant === 'mid') {
    // Parse the category from "Read More on [Category]" if possible
    let prefix = "Read More on ";
    let category = "";
    if (title.startsWith(prefix)) {
      category = title.substring(prefix.length);
    } else {
      prefix = title;
    }

    return (
      <div className="border border-slate-200 rounded-lg py-5 px-6 my-8 bg-[#fafaf9]">
        <p className="text-[13px] text-slate-400 mb-3">
          {category ? (
            <>
              Read More on <span className="font-bold underline text-slate-800">{category}</span>
            </>
          ) : (
            title
          )}
        </p>
        <ul className="list-none p-0 m-0">
          {articles.map((article, idx) => (
            <li key={article.url || idx} className={`py-3.5 flex items-center gap-4 ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
              <div className="flex-grow">
                <Link href={article.url || '#'} className="block group">
                  <h4 className="text-[15px] font-semibold text-slate-800 leading-snug mb-1 group-hover:text-primary related-articles-title transition-colors">
                    {article.title}
                  </h4>
                </Link>
                <span className="text-xs text-slate-400">
                  {article.read_time || '5 min read'}
                </span>
              </div>
              <Link href={article.url || '#'} className="flex-shrink-0">
                <Image
                  src={article.main_image || '/images/logo.png'}
                  alt={article.title}
                  width={80}
                  height={56}
                  className="object-cover rounded w-[80px] h-[56px] related-articles-img"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === 'end') {
    return (
      <div className="my-12 py-8 border-y border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 whitespace-nowrap">
            {title}
          </h3>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <ul className="list-none p-0 m-0">
          {articles.map((article, idx) => (
            <li key={article.url || idx} className={`py-4 flex items-center gap-4 ${idx !== articles.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <Link href={article.url || '#'} className="flex-shrink-0 block">
                <Image
                  src={article.main_image || '/images/logo.png'}
                  alt={article.title}
                  width={96}
                  height={72}
                  className="object-cover rounded-md w-[96px] h-[72px] related-articles-img"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={article.url || '#'} className="block group">
                  <h4 className="text-[15px] font-semibold text-slate-800 leading-snug group-hover:text-primary related-articles-title transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
                <span className="text-xs text-slate-400 mt-1 block">
                  {article.read_time || '5 min read'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
