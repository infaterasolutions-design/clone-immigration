"use server";

import { supabase } from "@/lib/supabase";

/**
 * Fetch ALL sponsored content (for admin panel)
 */
export async function getAllSponsoredContent() {
  try {
    const { data, error } = await supabase
      .from("sponsored_content")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error fetching all sponsored content:", error);
    return { error: error.message };
  }
}

/**
 * Fetch ACTIVE sponsored content (for frontend)
 * Filters by is_active=true and valid date ranges, limited to 6 items.
 */
export async function getActiveSponsoredContent() {
  try {
    const now = new Date().toISOString();
    
    // We want active items where (start_date is null OR start_date <= now) 
    // AND (end_date is null OR end_date >= now)
    const { data, error } = await supabase
      .from("sponsored_content")
      .select("*")
      .eq("is_active", true)
      .or(`start_date.is.null,start_date.lte."${now}"`)
      .or(`end_date.is.null,end_date.gte."${now}"`)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error fetching active sponsored content:", error);
    return { error: error.message };
  }
}

/**
 * Create a new sponsored content post
 */
export async function createSponsoredContent(payload) {
  try {
    const { data, error } = await supabase
      .from("sponsored_content")
      .insert([payload])
      .select();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error creating sponsored content:", error);
    return { error: error.message };
  }
}

/**
 * Update a sponsored content post
 */
export async function updateSponsoredContent(id, payload) {
  try {
    const { data, error } = await supabase
      .from("sponsored_content")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error updating sponsored content:", error);
    return { error: error.message };
  }
}

/**
 * Delete a sponsored content post
 */
export async function deleteSponsoredContent(id) {
  try {
    const { error } = await supabase
      .from("sponsored_content")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting sponsored content:", error);
    return { error: error.message };
  }
}
