"use client";
import { useEffect, useState } from "react";
import { 
  getAllSponsoredContent, 
  createSponsoredContent, 
  updateSponsoredContent, 
  deleteSponsoredContent as removeSponsoredContent 
} from "../../../app/actions/sponsoredActions";
import { revalidateServerPath } from "../../../app/actions/revalidate";
import { uploadMediaToSupabase } from "../../../lib/adminHelpers";
import DataTable from "../../../components/admin/DataTable";
import RoleGuard from "../../../components/admin/RoleGuard";

export default function AdminSponsoredContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);
  const user = typeof window !== "undefined" ? window.__adminUser : null;

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    setLoading(true);
    const { data } = await getAllSponsoredContent();
    setContent(data || []);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(formData) {
    let error;
    if (formData.id) {
      const { id, ...updateData } = formData;
      const res = await updateSponsoredContent(id, updateData);
      error = res.error;
    } else {
      const res = await createSponsoredContent(formData);
      error = res.error;
    }

    if (error) { 
      showToast(error, "error"); 
      return; 
    }
    
    // Clear cache for homepage and all articles since sponsored content shows everywhere
    await revalidateServerPath("/", "layout");
    
    showToast(editItem ? "Sponsored content updated" : "Sponsored content created");
    setShowModal(false);
    setEditItem(null);
    fetchContent();
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this sponsored post?")) return;
    const { error } = await removeSponsoredContent(id);
    if (error) { showToast(error, "error"); return; }
    showToast("Sponsored post deleted");
    fetchContent();
  }

  const columns = [
    { key: "title", label: "Title", render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {row.image_url ? (
           <img src={row.image_url} alt="thumbnail" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
        ) : (
           <div style={{ width: 40, height: 40, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#94a3b8" }}>No Img</div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, color: "#1e293b", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.title}</span>
          <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{row.sponsor_name}</span>
        </div>
      </div>
    )},
    { key: "url", label: "Destination URL", render: (row) => (
      <a href={row.destination_url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "0.8rem", textDecoration: "underline", maxWidth: "200px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {row.destination_url}
      </a>
    )},
    { key: "sort_order", label: "Order", render: (row) => (
       <span style={{ fontWeight: 600, color: "#475569" }}>{row.sort_order}</span>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`admin-badge ${row.is_active ? "admin-badge-active" : "admin-badge-inactive"}`}>
        {row.is_active ? "🟢 Active" : "⚫ Inactive"}
      </span>
    )},
    { key: "dates", label: "Campaign Dates", render: (row) => {
      if (!row.start_date && !row.end_date) return <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Always On</span>;
      return (
        <div style={{ display: "flex", flexDirection: "column", fontSize: "0.75rem", color: "#64748b" }}>
          <span>Start: {row.start_date ? new Date(row.start_date).toLocaleDateString() : "Any"}</span>
          <span>End: {row.end_date ? new Date(row.end_date).toLocaleDateString() : "Any"}</span>
        </div>
      );
    }},
  ];

  if (loading) return <p style={{ color: "#71717a" }}>Loading sponsored content...</p>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sponsored Content</h1>
          <p className="admin-page-subtitle">{content.length} posts · {content.filter(e => e.is_active).length} active</p>
        </div>
        <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
          <button className="admin-btn admin-btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            + New Post
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        data={content}
        emptyMessage="No sponsored posts found."
        actions={(row) => (
          <RoleGuard user={user} allowedRoles={["super_admin", "editor"]}>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setEditItem(row); setShowModal(true); }}>
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

      {showModal && (
        <SponsoredModal
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}

      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

function SponsoredModal({ item, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: item?.title || "",
    sponsor_name: item?.sponsor_name || "",
    description: item?.description || "",
    destination_url: item?.destination_url || "",
    image_url: item?.image_url || "",
    is_active: item?.is_active ?? true,
    sort_order: item?.sort_order ?? 0,
    start_date: item?.start_date ? new Date(item.start_date).toISOString().split('T')[0] : "",
    end_date: item?.end_date ? new Date(item.end_date).toISOString().split('T')[0] : "",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaToSupabase(file);
      if (url) setForm(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    
    // Parse dates to full ISO or null
    payload.start_date = payload.start_date ? new Date(payload.start_date + "T00:00:00Z").toISOString() : null;
    payload.end_date = payload.end_date ? new Date(payload.end_date + "T23:59:59Z").toISOString() : null;
    payload.sort_order = parseInt(payload.sort_order) || 0;

    if (item?.id) payload.id = item.id;
    await onSave(payload);
    setSaving(false);
  }

  // Styles
  const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.95rem", color: "#1e293b", outline: "none", transition: "border-color 0.2s", background: "#fff" };
  const textareaStyle = { ...inputStyle, resize: "vertical", fontFamily: "inherit" };
  const sectionStyle = { background: "#f8fafc", borderRadius: 10, padding: "1.25rem", border: "1px solid #e2e8f0" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 820, maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
              {item ? "Edit Sponsored Post" : "Create Sponsored Post"}
            </h3>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: item ? "#dbeafe" : "#dcfce7", color: item ? "#1d4ed8" : "#15803d" }}>
              {item ? "Editing" : "New"}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Title */}
              <div>
                <label style={labelStyle}>Headline / Title *</label>
                <input
                  style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="What is the latest on ETFs?"
                  required
                />
              </div>

              {/* Sponsor Name */}
              <div>
                <label style={labelStyle}>Sponsor Name *</label>
                <input
                  style={inputStyle}
                  name="sponsor_name"
                  value={form.sponsor_name}
                  onChange={handleChange}
                  placeholder="e.g. MarketViews"
                  required
                />
              </div>

              {/* Destination URL */}
              <div>
                <label style={labelStyle}>Destination URL *</label>
                <input
                  style={inputStyle}
                  type="url"
                  name="destination_url"
                  value={form.destination_url}
                  onChange={handleChange}
                  placeholder="https://example.com/campaign"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Short Description (Optional)</label>
                <textarea
                  style={textareaStyle}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief context or tagline..."
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} name="is_active" value={form.is_active} onChange={handleChange}>
                    <option value={true}>🟢 Active</option>
                    <option value={false}>⚫ Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input
                    style={inputStyle}
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>Lower numbers appear first</p>
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Start Date (Optional)</label>
                  <input
                    style={inputStyle}
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={labelStyle}>End Date (Optional)</label>
                  <input
                    style={inputStyle}
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Hero Image */}
              <div style={sectionStyle}>
                <label style={labelStyle}>Thumbnail Image</label>
                {form.image_url ? (
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    <img src={form.image_url} alt="Thumbnail" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image_url: "" }))}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: "0.9rem" }}
                    >×</button>
                  </div>
                ) : (
                  <div style={{ border: "2px dashed #cbd5e1", borderRadius: 8, padding: "2rem 1rem", textAlign: "center", cursor: "pointer", position: "relative" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                    />
                    <div style={{ fontSize: "2rem", marginBottom: 4 }}>📷</div>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                      {uploading ? "Uploading..." : "Click or drag to upload"}
                    </p>
                  </div>
                )}
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 8, textAlign: "center" }}>If left empty, the site's default fallback image will be used.</p>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #e2e8f0" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 24px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", background: "#fff", color: "#64748b" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading || !form.title || !form.sponsor_name || !form.destination_url}
              style={{ padding: "10px 28px", border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", background: saving ? "#94a3b8" : "#4f46e5", color: "#fff", boxShadow: "0 4px 14px rgba(79,70,229,0.3)", transition: "all 0.2s" }}
            >
              {saving ? "Saving..." : item ? "💾 Update Post" : "🚀 Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
