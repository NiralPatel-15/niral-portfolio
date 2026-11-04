"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TagInput from "@/components/admin/TagInput";
import ImageUploader from "@/components/admin/ImageUploader";

const empty = {
  title: "",
  slug: "",
  category: "",
  subtitle: "",
  description: "",
  overview: "",
  challenge: "",
  solution: "",
  role: "Full-Stack Development",
  image: "",
  tech: [],
  features: [],
  architecture: [],
  github: "",
  demo: "",
  order_index: 0,
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await api.admin.fetch("projects", {
        query: "?order=order_index.asc",
      });

      setItems(data || []);
    } catch (error) {
      console.error("Projects loading error:", error);
      setMsg("Error loading projects.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item) {
    setMsg("");

    setEditing(
      item
        ? {
            ...empty,
            ...item,
            tech: item.tech || [],
            features: item.features || [],
            architecture: item.architecture || [],
          }
        : { ...empty },
    );
  }

  function updateField(field, value) {
    setEditing((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function save(e) {
    e.preventDefault();

    if (!editing) return;

    const slug = createSlug(editing.slug || editing.title);

    if (!slug) {
      setMsg("Please enter a valid project title or slug.");
      return;
    }

    setSaving(true);
    setMsg("");

    try {
      const payload = {
        title: editing.title.trim(),
        slug,
        category: editing.category,
        subtitle: editing.subtitle,
        description: editing.description,
        overview: editing.overview,
        challenge: editing.challenge,
        solution: editing.solution,
        role: editing.role,
        image: editing.image,
        tech: editing.tech,
        features: editing.features,
        architecture: editing.architecture,
        github: editing.github,
        demo: editing.demo,
        order_index: Number(editing.order_index) || 0,
      };

      if (editing.id) {
        await api.admin.fetch("projects", {
          method: "PATCH",
          query: `?id=eq.${editing.id}`,
          body: payload,
        });
      } else {
        await api.admin.fetch("projects", {
          method: "POST",
          body: payload,
        });
      }

      setEditing(null);
      setMsg("Project saved successfully!");
      await load();
    } catch (error) {
      console.error("Project save error:", error);
      setMsg("Error saving project. Check the console for details.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.admin.fetch("projects", {
        method: "DELETE",
        query: `?id=eq.${id}`,
      });

      setMsg("Project deleted successfully.");
      await load();
    } catch (error) {
      console.error("Project delete error:", error);
      setMsg("Error deleting project.");
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Projects</h1>
        <p className="pageDesc">
          Manage project information, images, technologies and case studies.
        </p>
      </div>

      {msg && <div className="successMsg">{msg}</div>}

      {editing && (
        <form onSubmit={save}>
          <div className="card">
            <div className="cardTitle">
              {editing.id ? "Edit Project" : "New Project"}
            </div>

            <h3 className="label">01 / Project Identity</h3>

            <div className="inputRow">
              <div className="field">
                <label className="label">Project Title *</label>
                <input
                  className="input"
                  value={editing.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Project Slug *</label>
                <input
                  className="input"
                  value={editing.slug}
                  onChange={(e) =>
                    updateField("slug", createSlug(e.target.value))
                  }
                  placeholder="aitradex"
                  required
                />
              </div>
            </div>

            <div className="inputRow">
              <div className="field">
                <label className="label">Category</label>
                <input
                  className="input"
                  value={editing.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  placeholder="Fintech Learning Platform"
                />
              </div>

              <div className="field">
                <label className="label">Your Role</label>
                <input
                  className="input"
                  value={editing.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  placeholder="Full-Stack Development"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Subtitle</label>
              <input
                className="input"
                value={editing.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="A short project introduction"
              />
            </div>

            <div className="field">
              <label className="label">Description *</label>
              <textarea
                className="textarea"
                value={editing.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
            </div>

            <h3 className="label">02 / Project Cover</h3>

            <div className="field">
              <ImageUploader
                label="Project Cover Image"
                value={editing.image}
                onChange={(imageUrl) => updateField("image", imageUrl)}
              />
            </div>

            <h3 className="label">03 / Project Story</h3>

            <div className="field">
              <label className="label">Overview</label>
              <textarea
                className="textarea"
                rows={5}
                value={editing.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                placeholder="Explain what this project does..."
              />
            </div>

            <div className="field">
              <label className="label">Challenge</label>
              <textarea
                className="textarea"
                rows={4}
                value={editing.challenge}
                onChange={(e) => updateField("challenge", e.target.value)}
                placeholder="What problem were you solving?"
              />
            </div>

            <div className="field">
              <label className="label">Solution</label>
              <textarea
                className="textarea"
                rows={4}
                value={editing.solution}
                onChange={(e) => updateField("solution", e.target.value)}
                placeholder="How did you approach the problem?"
              />
            </div>

            <h3 className="label">04 / Project Capabilities</h3>

            <div className="field">
              <label className="label">Key Features</label>
              <TagInput
                tags={editing.features}
                onChange={(value) => updateField("features", value)}
                placeholder="Add feature and press Enter"
              />
            </div>

            <div className="field">
              <label className="label">Technology Stack</label>
              <TagInput
                tags={editing.tech}
                onChange={(value) => updateField("tech", value)}
                placeholder="Add technology and press Enter"
              />
            </div>

            <div className="field">
              <label className="label">Technical Architecture</label>
              <TagInput
                tags={editing.architecture}
                onChange={(value) => updateField("architecture", value)}
                placeholder="Add architecture detail and press Enter"
              />
            </div>

            <h3 className="label">05 / Project Links</h3>

            <div className="inputRow">
              <div className="field">
                <label className="label">GitHub Repository URL</label>
                <input
                  className="input"
                  type="url"
                  value={editing.github || ""}
                  onChange={(e) => updateField("github", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="field">
                <label className="label">Live Demo URL</label>
                <input
                  className="input"
                  type="url"
                  value={editing.demo || ""}
                  onChange={(e) => updateField("demo", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <h3 className="label">06 / Display Settings</h3>

            <div className="field">
              <label className="label">Display Order</label>
              <input
                className="input"
                type="number"
                value={editing.order_index ?? 0}
                onChange={(e) =>
                  updateField("order_index", Number(e.target.value))
                }
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button className="saveBtn" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Project"}
              </button>

              <button
                type="button"
                className="deleteBtn"
                onClick={() => setEditing(null)}
                disabled={saving}
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
          + Add Project
        </button>
      )}

      {loading && <p>Loading projects...</p>}

      {!loading &&
        items.map((item) => (
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
              {item.category || "Project"} · {item.tech?.join(", ")}
            </div>
          </div>
        ))}
    </div>
  );
}