import { supabase } from "./supabase";

let cachedCategories = null;
let cacheTimestamp = 0;
const CACHE_TTL = 120000; // 2 minutes

/**
 * Fetch all categories from the normalized table and
 * build a tree structure: parents with nested children arrays.
 */
export async function getCategories() {
  if (cachedCategories && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedCategories;
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

  // Separate parents and children
  const parents = rows.filter((r) => !r.parent_slug);
  const children = rows.filter((r) => r.parent_slug);

  // Attach children to each parent
  const tree = parents.map((p) => ({
    ...p,
    subcategories: children
      .filter((c) => c.parent_slug === p.slug)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
  }));

  cachedCategories = tree;
  cacheTimestamp = Date.now();
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
