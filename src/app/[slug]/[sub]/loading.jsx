export default function Loading() {
  return (
    <div className="pt-4 md:pt-8 pb-0 px-3 md:px-4 lg:px-24 max-w-[1298px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative animate-pulse">
      <div className="lg:col-span-8 flex flex-col gap-2 md:gap-3">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-slate-200 rounded-md w-32 mb-4"></div>

        {/* Title skeleton */}
        <div className="h-10 md:h-12 bg-slate-200 rounded-md w-3/4 mb-5"></div>
        
        {/* Subtitle skeleton */}
        <div className="h-6 bg-slate-200 rounded-md w-full mb-2"></div>
        <div className="h-6 bg-slate-200 rounded-md w-5/6 mb-8"></div>
        
        {/* Author info skeleton */}
        <div className="flex items-center gap-4 mb-4 pb-2 border-b border-slate-100">
          <div className="w-14 h-14 rounded-md bg-slate-200 shrink-0"></div>
          <div className="flex flex-col gap-2 w-48">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>

        {/* Hero image skeleton */}
        <div className="w-full aspect-[16/9] bg-slate-200 rounded-xl mb-8"></div>

        {/* First paragraph skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-slate-200 rounded w-full"></div>
          <div className="h-5 bg-slate-200 rounded w-full"></div>
          <div className="h-5 bg-slate-200 rounded w-5/6"></div>
          <div className="h-5 bg-slate-200 rounded w-full"></div>
          <div className="h-5 bg-slate-200 rounded w-4/5"></div>
        </div>
      </div>
      
      {/* Sidebar skeleton */}
      <div className="hidden lg:block lg:col-span-4">
        <div className="h-[600px] bg-slate-100 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
