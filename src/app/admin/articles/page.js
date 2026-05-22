"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import DataTable from "../../../components/admin/DataTable";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminArticles() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    setLoading(true);
    let { data, error } = await supabase.from("articles").select("*").order("published_at", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("Error fetching articles:", error);
      // Fallback if sorting fails
      const fallback = await supabase.from("articles").select("*");
      data = fallback.data;
    }
    setArticles(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    // First, delete any linked videos to avoid foreign key constraint violations
    await supabase.from("videos").delete().eq("article_id", id);
    
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error && (error.message || error.code || error.details)) { 
      console.error("Delete error:", JSON.stringify(error));
      showToast(`Failed to delete: ${error.message || error.details || error.code}`, "error"); 
      return; 
    }
    showToast("Article deleted");
    fetchArticles();
  }

  async function toggleFeatured(article) {
    const { error } = await supabase.from("articles").update({ is_featured: !article.is_featured }).eq("id", article.id);
    if (error) { showToast("Failed to update", "error"); return; }
    showToast(article.is_featured ? "Removed from featured" : "Marked as featured");
    fetchArticles();
  }

  const filtered = (() => {
    let result = articles;
    if (filter === "featured") result = articles.filter(a => a.is_featured);
    else if (filter !== "all" && !filter.startsWith("sort_")) result = articles.filter(a => a.category_label === filter);

    if (filter === "sort_likes") result = [...result].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    if (filter === "sort_saves") result = [...result].sort((a, b) => (b.saves_count || 0) - (a.saves_count || 0));
    if (filter === "sort_shares") result = [...result].sort((a, b) => (b.shares_count || 0) - (a.shares_count || 0));
    
    return result;
  })();

  const categories = [...new Set(articles.map(a => a.category_label).filter(Boolean))];

  const columns = [
    { key: "title", label: "Title", render: (row) => (
      <div style={{ maxWidth: 300 }}>
        <span style={{ fontWeight: 600, color: "#1e293b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {row.title}
        </span>
        {row.is_featured && <span style={{ fontSize: "0.65rem", color: "#eab308", marginTop: 2, display: "inline-block" }}>⭐ Featured</span>}
      </div>
    )},
    { key: "category_label", label: "Category", render: (row) => (
      <span className="admin-badge admin-badge-active">{row.category_label || "—"}</span>
    )},
    { key: "author_name", label: "Author" },
    { key: "status", label: "Status", render: (row) => {
      const isScheduled = row.status === "published" && row.published_at && new Date(row.published_at) > new Date();
      return (
        <span className={`admin-badge ${row.status === "draft" ? "admin-badge-inactive" : isScheduled ? "admin-badge-scheduled" : "admin-badge-active"}`}>
          {row.status === "draft" ? "Draft" : isScheduled ? "Scheduled" : "Published"}
        </span>
      );
    }},
    { key: "likes_count", label: "Likes", render: (row) => (
      <span style={{ fontWeight: "bold", color: "#64748b" }}>{row.likes_count || 0}</span>
    )},
    { key: "saves_count", label: "Saves", render: (row) => (
      <span style={{ fontWeight: "bold", color: "#64748b" }}>{row.saves_count || 0}</span>
    )},
    { key: "shares_count", label: "Shares", render: (row) => (
      <span style={{ fontWeight: "bold", color: "#64748b" }}>{row.shares_count || 0}</span>
    )},
    { key: "published_at", label: "Go-Live", render: (row) => (
      <span style={{ color: "#71717a", fontSize: "0.8rem" }}>
        {row.published_at ? new Date(row.published_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "—"}
      </span>
    )},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading articles...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Articles</h1>
          <p className="admin-page-subtitle">{articles.length} total · {articles.filter(a => a.is_featured).length} featured</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => router.push('/admin/articles/new')}>
            + New Article
          </button>
        </RoleGuard>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <button className={`admin-btn admin-btn-sm ${filter === "all" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("all")}>All ({articles.length})</button>
        <button className={`admin-btn admin-btn-sm ${filter === "featured" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("featured")}>⭐ Featured</button>
        <div style={{ width: 1, height: 20, backgroundColor: "#e2e8f0", margin: "0 4px" }} />
        <button className={`admin-btn admin-btn-sm ${filter === "sort_likes" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("sort_likes")}>Most Liked</button>
        <button className={`admin-btn admin-btn-sm ${filter === "sort_saves" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("sort_saves")}>Most Saved</button>
        <button className={`admin-btn admin-btn-sm ${filter === "sort_shares" ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter("sort_shares")}>Most Shared</button>
        <div style={{ width: 1, height: 20, backgroundColor: "#e2e8f0", margin: "0 4px" }} />
        {categories.map(cat => (
          <button key={cat} className={`admin-btn admin-btn-sm ${filter === cat ? "admin-btn-primary" : "admin-btn-ghost"}`} onClick={() => setFilter(cat)}>{cat}</button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No articles found. Create your first article!"
        actions={(row) => (
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleFeatured(row)} title="Toggle featured">
                {row.is_featured ? "★" : "☆"}
              </button>
              <a className="admin-btn admin-btn-ghost admin-btn-sm" href={`/${row.slug}`} target="_blank" rel="noopener noreferrer">
                View
              </a>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => router.push(`/admin/articles/${row.id}/edit`)}>
                Edit
              </button>
              <RoleGuard user={user} allowedRoles={["super_admin"]}>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(row.id)}>
                  Delete
                </button>
              </RoleGuard>
            </div>
          </RoleGuard>
        )}
      />

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
