"use client";

import { useState, useEffect } from "react";
import RoleGuard from "@/components/admin/RoleGuard";
import { getRecycleBinItems, restoreFromRecycleBin, permanentlyDelete } from "@/app/actions/recycleBin";

export default function RecycleBinPage() {
  const user = typeof window !== "undefined" ? window.__adminUser : null;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { success, data, error } = await getRecycleBinItems();
    if (success) {
      setItems(data || []);
    } else {
      showToast(`Failed to load items: ${error}`, "error");
    }
    setLoading(false);
  }

  async function handleRestore(id) {
    if (!confirm("Are you sure you want to restore this item to its original location?")) return;
    
    const { success, error } = await restoreFromRecycleBin(id);
    if (success) {
      showToast("Item restored successfully");
      fetchItems();
    } else {
      showToast(`Failed to restore: ${error}`, "error");
    }
  }

  async function handlePermanentDelete(id) {
    if (!confirm("WARNING: This will permanently delete this item forever. This action cannot be undone!")) return;
    
    const { success, error } = await permanentlyDelete(id);
    if (success) {
      showToast("Item permanently deleted");
      fetchItems();
    } else {
      showToast(`Failed to delete: ${error}`, "error");
    }
  }

  return (
    <RoleGuard user={user} allowedRoles={["super_admin"]}>
      <div className="admin-page animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="admin-title">Recycle Bin</h1>
            <p className="admin-subtitle">View and restore deleted articles and categories</p>
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={fetchItems}>
            <span className="material-symbols-outlined">refresh</span> Refresh
          </button>
        </div>

        <div className="admin-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">autorenew</span>
              <p>Loading recycle bin...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">delete_outline</span>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Recycle Bin is empty</h3>
              <p className="text-slate-500">No deleted items found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th>Title / Name</th>
                    <th>Type</th>
                    <th>Deleted At</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">ID: {item.original_id}</p>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          {item.original_table === "articles" ? "Article" : item.original_table === "categories" ? "Category" : item.original_table}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-slate-600 whitespace-nowrap">
                          {new Date(item.deleted_at).toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="admin-btn admin-btn-sm" 
                            style={{ backgroundColor: "#10b981", color: "white" }}
                            onClick={() => handleRestore(item.id)}
                          >
                            <span className="material-symbols-outlined text-[16px]">restore</span> Restore
                          </button>
                          <button 
                            className="admin-btn admin-btn-danger admin-btn-sm" 
                            onClick={() => handlePermanentDelete(item.id)}
                          >
                            <span className="material-symbols-outlined text-[16px]">delete_forever</span> Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {toast && (
          <div className={`admin-toast ${toast.type === "error" ? "admin-toast-error" : "admin-toast-success"}`}>
            {toast.message}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
