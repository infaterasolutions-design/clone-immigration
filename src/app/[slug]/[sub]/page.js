import CategoryIndexPage from "@/components/CategoryIndexPage";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categoryConfig";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ISR
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug, sub } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Not Found" };

  const subcategory = await getSubcategoryBySlug(slug, sub);
  if (!subcategory) return { title: "Not Found" };

  return {
    title: subcategory.seo_title || `${subcategory.name} | ${category.name} - United States Immigration News`,
    description: subcategory.seo_description || subcategory.description || `Latest ${subcategory.name} news and updates.`,
    alternates: {
      canonical: `https://www.unitedstatesimmigrationnews.com/${category.slug}/${subcategory.slug}/`,
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
  };
}

export default async function SubcategoryPage({ params }) {
  const { slug, sub } = await params;

  // Validate parent category exists
  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  // Validate subcategory exists under this parent
  const subcategory = await getSubcategoryBySlug(slug, sub);
  if (!subcategory) return notFound();

  // Fetch articles for this exact subcategory
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("category_slug", slug)
    .eq("sub_category_slug", sub)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(50);

  return (
    <CategoryIndexPage
      category={category}
      subcategories={category.subcategories || []}
      articles={articles || []}
      activeSubcategory={sub}
    />
  );
}
