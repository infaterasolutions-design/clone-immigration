import { supabase } from "./supabase";

/**
 * Gets the current authenticated user inside the admin panel.
 */
export async function getAdminUser() {
  try {
    // Temporarily suppress the specific Supabase console.error that triggers Next.js overlay
    let originalConsoleError;
    if (typeof console !== 'undefined') {
      originalConsoleError = console.error;
      console.error = (...args) => {
        const msg = args[0]?.message || args[0] || '';
        if (typeof msg === 'string' && msg.includes('Refresh Token Not Found')) return;
        originalConsoleError.apply(console, args);
      };
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (typeof console !== 'undefined' && originalConsoleError) {
      console.error = originalConsoleError;
    }
    
    if (error) {
      // If the refresh token is invalid, clear local storage aggressively
      if (error.message?.includes("Refresh Token Not Found") || error.status === 400) {
        if (typeof window !== "undefined") {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
        }
      }
      return null;
    }
    
    if (!session) return null;
  
    const { user } = session;
    if (!user) return null;
  
    // Fetch role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
  
    if (roleError) {
      console.error("Error fetching user role:", roleError);
    }
  
    return {
      ...user,
      role: roleData?.role || 'viewer' // fallback to viewer if no role found
    };
  } catch (err) {
    console.error("Unexpected auth error:", err);
    return null;
  }
}

/**
 * Login function
 */
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Logout function
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Fetch live events — uses the existing table structure
 */
export async function getAdminLiveEvents() {
  try {
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching admin live events:", error.message, error.details, error.hint);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching live events:", err);
    return [];
  }
}

/**
 * Upsert live event
 */
export async function saveLiveEvent(eventData) {
  try {
    if (eventData.id) {
      // Update existing
      const { id, ...updateFields } = eventData;
      const { data, error } = await supabase
        .from('live_events')
        .update(updateFields)
        .eq('id', id)
        .select();
      return { data, error };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('live_events')
        .insert([eventData])
        .select();
      return { data, error };
    }
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
}

/**
 * Delete live event
 */
export async function deleteLiveEvent(id) {
  const { error } = await supabase
    .from('live_events')
    .delete()
    .eq('id', id);
  return { error };
}

/**
 * Upload a file to the 'media' bucket and return its public URL
 */
export async function uploadMediaToSupabase(file) {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
}
