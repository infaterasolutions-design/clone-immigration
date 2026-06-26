import { supabase } from "./supabase";

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getCategories() {
  // Use global to persist across Next.js HMR/Fast Refresh
  if (global.cachedCategories && Date.now() - global.cacheTimestamp < CACHE_TTL) {
    return global.cachedCategories;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  const rows = data || [];
  const parents = rows.filter((r) => !r.parent_slug);
  const children = rows.filter((r) => r.parent_slug);

  const tree = parents.map((p) => ({
    ...p,
    subcategories: children
      .filter((c) => c.parent_slug === p.slug)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
  }));

  global.cachedCategories = tree;
  global.cacheTimestamp = Date.now();
  return tree;
}

/**
 * Get a single parent category by its slug.
 */
export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

/**
 * Get a subcategory by parent slug + sub slug.
 */
export async function getSubcategoryBySlug(parentSlug, subSlug) {
  const parent = await getCategoryBySlug(parentSlug);
  if (!parent) return null;
  return parent.subcategories?.find((s) => s.slug === subSlug) || null;
}

/**
 * Get a set of all parent category slugs (used for route matching).
 */
export async function getAllParentSlugs() {
  const categories = await getCategories();
  return new Set(categories.map((c) => c.slug));
}

/**
 * Quick check: is a given slug a parent category?
 */
export async function isParentCategory(slug) {
  const slugs = await getAllParentSlugs();
  return slugs.has(slug);
}

/**
 * Get a flat list of all categories (parents + children) for use in admin dropdowns.
 */
export async function getAllCategoriesFlat() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching flat categories:", error);
    return [];
  }
  return data || [];
}

// Keep a sync export for backward compat with any component that imported CATEGORIES
export const CATEGORIES = [];
