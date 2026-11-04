"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TagInput from "@/components/admin/TagInput";
import ImageUploader from "@/components/admin/ImageUploader";

const empty = {
  title: "",
  degree: "",
  period: "",
  institution: "",
  details: [],
  status: "",
  achievement: "",
  image: "",
  order_index: 0,
};

export default function AdminEducation() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await api.admin.fetch("education", {
        query: "?order=order_index.asc",
      });
      setItems(data || []);
    } catch (error) {
      console.error("Education loading error:", error);
      setMsg("Error loading education entries.");
    }
  }

  function startEdit(item) {
    setMsg("");

    setEditing(
      item
        ? {
            ...item,
            details: item.details || [],
            image: item.image || "",
          }
        : { ...empty },
    );
  }

  
async function save(e) {
  e.preventDefault();
  setSaving(true);
  setMsg("");

  try {
    if (editing.id) {
      await api.admin.fetch("education", {
        method: "PATCH",
        query: `?id=eq.${editing.id}`,
        body: editing,
      });
    } else {
      await api.admin.fetch("education", {
        method: "POST",
        body: editing,
      });
    }

    setMsg("Education entry saved successfully!");
    setEditing(null);
    await load();
  } catch (error) {
    console.error("Education save error:", error);
    setMsg("Error saving education entry. Please try again.");
  } finally {
    setSaving(false);
  }
}


  async function remove(id) {
    if (!confirm("Delete this education entry?")) return;

    try {
      await api.admin.fetch("education", {
        method: "DELETE",
        query: `?id=eq.${id}`,
      });

      setMsg("Education entry deleted.");
      await load();
    } catch (error) {
      console.error("Education delete error:", error);
      setMsg("Error deleting education entry.");
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Education</h1>
        <p className="pageDesc">Manage your education entries.</p>
      </div>

      {msg && <div className="successMsg">{msg}</div>}

      {editing && (
        <form onSubmit={save}>
          <div className="card">
            <div className="cardTitle">
              {editing.id ? "Edit Entry" : "New Entry"}
            </div>

            <div className="inputRow">
              <div className="field">
                <label className="label">Title</label>
                <input
                  className="input"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label className="label">Degree</label>
                <input
                  className="input"
                  value={editing.degree}
                  onChange={(e) =>
                    setEditing({ ...editing, degree: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="inputRow">
              <div className="field">
                <label className="label">Period</label>
                <input
                  className="input"
                  value={editing.period}
                  onChange={(e) =>
                    setEditing({ ...editing, period: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label className="label">Institution</label>
                <input
                  className="input"
                  value={editing.institution}
                  onChange={(e) =>
                    setEditing({ ...editing, institution: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Status</label>
              <input
                className="input"
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
                placeholder="e.g. In Progress"
              />
            </div>

            <div className="field">
              <label className="label">Achievement</label>
              <input
                className="input"
                value={editing.achievement}
                onChange={(e) =>
                  setEditing({ ...editing, achievement: e.target.value })
                }
                placeholder="e.g. Academic achievement"
              />
            </div>

            <div className="field">
              <ImageUploader
                label="Education Image"
                value={editing.image}
                onChange={(imageUrl) => {
                  setEditing((current) => ({
                    ...current,
                    image: imageUrl,
                  }));
                  setMsg(
                    "Image uploaded. Click Save to update this education entry.",
                  );
                }}
              />
            </div>

            <div className="field">
              <label className="label">Order</label>
              <input
                className="input"
                type="number"
                value={editing.order_index ?? 0}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    order_index: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Details</label>
              <TagInput
                tags={editing.details}
                onChange={(value) => setEditing({ ...editing, details: value })}
                placeholder="Add detail and press Enter"
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="saveBtn" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="deleteBtn"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {!editing && (
        <button
          className="addBtn"
          onClick={() => startEdit(null)}
          style={{ marginBottom: 20 }}
        >
          + Add Education Entry
        </button>
      )}

      {items.map((item) => (
        <div key={item.id} className="entryCard">
          <div className="entryHeader">
            <span className="entryTitle">{item.title}</span>

            <div className="entryActions">
              <button
                className="saveBtn"
                style={{ padding: "6px 14px", fontSize: 11 }}
                onClick={() => startEdit(item)}
              >
                Edit
              </button>

              <button className="deleteBtn" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "#a0a3b5" }}>
            {item.degree} &middot; {item.period}
          </div>
        </div>
      ))}
    </div>
  );
}
