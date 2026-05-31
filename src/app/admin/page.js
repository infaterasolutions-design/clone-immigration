"use client";
import { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    subscribers: 0,
    liveEvents: 0,
    videos: 0,
    users: 0,
    activeLive: 0,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: articleCount },
          { count: subscriberCount },
          { count: liveEventCount },
          { count: videoCount },
          { count: userCount },
          { count: activeLiveCount },
        ] = await Promise.all([
          supabase.from("articles").select("*", { count: "exact", head: true }),
          supabase.from("subscribers").select("*", { count: "exact", head: true }),
          supabase.from("live_events").select("*", { count: "exact", head: true }),
          supabase.from("videos").select("*", { count: "exact", head: true }),
          supabase.from("user_roles").select("*", { count: "exact", head: true }),
          supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "active"),
        ]);
        
        let recentFetched = [];
        const { data: orderedRecent, error: recentErr } = await supabase.from("articles").select("id, title, category_label, published_at").order("published_at", { ascending: false }).limit(5);
        if (recentErr) {
          const { data: unorderedRecent } = await supabase.from("articles").select("id, title, category_label, published_at").limit(5);
          recentFetched = unorderedRecent || [];
        } else {
          recentFetched = orderedRecent || [];
        }

        const { data: allPublished } = await supabase.from("articles").select("id, last_reviewed_date, published_at").eq("status", "published");
        let overdueCount = 0;
        if (allPublished) {
          const now = new Date();
          overdueCount = allPublished.filter(a => {
            const refDate = a.last_reviewed_date ? new Date(a.last_reviewed_date) : (a.published_at ? new Date(a.published_at) : null);
            if (!refDate) return false;
            return (now - refDate) / (1000 * 60 * 60 * 24) >= 365;
          }).length;
        }

        setStats({
          articles: articleCount || 0,
          subscribers: subscriberCount || 0,
          liveEvents: liveEventCount || 0,
          videos: videoCount || 0,
          users: userCount || 0,
          activeLive: activeLiveCount || 0,
          overdueReviews: overdueCount,
        });
        setRecentArticles(recentFetched || []);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p style={{ color: "#71717a" }}>Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back. Here&apos;s what&apos;s happening with your content.</p>
        </div>
      </div>

      {stats.overdueReviews > 0 && (
        <div style={{ marginBottom: 24, padding: "16px 20px", backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444", borderRadius: "6px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>🚨</span>
          <div>
            <h3 style={{ color: "#991b1b", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>Action Required: Content Reviews Overdue</h3>
            <p style={{ color: "#b91c1c", fontSize: "0.8rem", marginTop: "4px", marginBottom: "8px" }}>
              {stats.overdueReviews} {stats.overdueReviews === 1 ? 'article has' : 'articles have'} not been reviewed in over 12 months.
            </p>
            <a href="/admin/articles" style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 700, color: "#991b1b", textDecoration: "underline" }}>
              Review them now
            </a>
          </div>
        </div>
      )}

      <div className="admin-stats-grid">
        <StatsCard title="Total Articles" value={stats.articles} icon="📰" color="blue" />
        <StatsCard title="Subscribers" value={stats.subscribers} icon="📧" color="green" />
        <StatsCard title="Live Events" value={stats.liveEvents} icon="🔴" color="red" />
        <StatsCard title="Active Live" value={stats.activeLive} icon="⚡" color="orange" />
        <StatsCard title="Videos" value={stats.videos} icon="🎬" color="purple" />
        <StatsCard title="Admin Users" value={stats.users} icon="👤" color="cyan" />
      </div>

      <div className="admin-section">
        <h3 className="admin-section-title">Recent Articles</h3>
        {recentArticles.length === 0 ? (
          <p style={{ color: "#52525b", fontSize: "0.85rem" }}>No articles yet.</p>
        ) : (
          <table className="admin-table" style={{ background: "transparent" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: "#1e293b", maxWidth: 350, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.title}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-active">{a.category_label || "—"}</span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {a.published_at ? new Date(a.published_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
