"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminAbout() {
  const [form, setForm] = useState({
    image: "",
    paragraphs: [],
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.admin.fetch("about").then((data) => {
      if (data && data[0]) {
        setForm({
          image: data[0].image || "",
          paragraphs: data[0].paragraphs || [],
        });
      }
    });
  }, []);

  function handleParagraphChange(index, value) {
    const updated = [...form.paragraphs];
    updated[index] = value;

    setForm({ ...form, paragraphs: updated });
  }

  function addParagraph() {
    setForm({
      ...form,
      paragraphs: [...form.paragraphs, ""],
    });
  }

  function removeParagraph(index) {
    setForm({
      ...form,
      paragraphs: form.paragraphs.filter((_, i) => i !== index),
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      await api.admin.fetch("about", {
        method: "PATCH",
        query: "?id=eq.1",
        body: {
          ...form,
          updated_at: new Date().toISOString(),
        },
      });

      setMsg("About section saved successfully!");
    } catch (error) {
      console.error("About save error:", error);
      setMsg("Error saving About section. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">About Section</h1>
        <p className="pageDesc">Edit your about section content.</p>
      </div>

      {msg && <div className="successMsg">{msg}</div>}

      <form onSubmit={handleSave}>
        <div className="card">
          <div className="cardTitle">About Content</div>

          <div className="field">
            <ImageUploader
              label="Profile Image"
              value={form.image}
              onChange={(imageUrl) => {
                setForm((current) => ({
                  ...current,
                  image: imageUrl,
                }));
                setMsg(
                  "Image uploaded. Click Save Changes to update your About section.",
                );
              }}
            />
          </div>

          <div className="field">
            <label className="label">Paragraphs</label>

            {form.paragraphs.map((paragraph, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <textarea
                  className="textarea"
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />

                <button
                  type="button"
                  className="deleteBtn"
                  onClick={() => removeParagraph(index)}
                  style={{
                    height: 42,
                    alignSelf: "flex-start",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="addBtn"
              onClick={addParagraph}
              style={{ marginTop: 8 }}
            >
              + Add Paragraph
            </button>
          </div>

          <button className="saveBtn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}