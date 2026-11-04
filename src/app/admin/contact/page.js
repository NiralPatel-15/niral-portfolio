"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const initialForm = {
  whatsapp: "",
  email: "",
  github: "",
  linkedin: "",
  facebook: "",
  instagram: "",
};

const fields = [
  {
    name: "whatsapp",
    label: "WhatsApp URL",
    type: "url",
    placeholder: "https://wa.me/...",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    name: "github",
    label: "GitHub URL",
    type: "url",
    placeholder: "https://github.com/...",
  },
  {
    name: "linkedin",
    label: "LinkedIn URL",
    type: "url",
    placeholder: "https://linkedin.com/in/...",
  },
  {
    name: "facebook",
    label: "Facebook URL",
    type: "url",
    placeholder: "https://facebook.com/...",
  },
  {
    name: "instagram",
    label: "Instagram URL",
    type: "url",
    placeholder: "https://instagram.com/...",
  },
];

export default function AdminContact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadContact() {
      try {
        const data = await api.admin.fetch("contact");

        if (active && data?.[0]) {
          setForm({
            ...initialForm,
            ...data[0],
          });
        }
      } catch (err) {
        console.error("Contact loading error:", err);
        if (active) {
          setMsg("Unable to load contact details.");
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadContact();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError(false);

    try {
      await api.admin.fetch("contact", {
        method: "PATCH",
        query: "?id=eq.1",
        body: {
          ...form,
          updated_at: new Date().toISOString(),
        },
      });

      setMsg("Contact details saved successfully!");
    } catch (err) {
      console.error("Contact save error:", err);
      setMsg("Unable to save contact details. Please try again.");
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Contact Information</h1>
        <p className="pageDesc">
          Manage your email, WhatsApp and social media links.
        </p>
      </div>

      {msg && (
        <div
          className="successMsg"
          role="status"
          style={error ? { color: "#dc2626" } : undefined}
        >
          {msg}
        </div>
      )}

      {loading ? (
        <div className="card">Loading contact details...</div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="card">
            <div className="cardTitle">Contact Details</div>

            {fields.map((field) => (
              <div className="field" key={field.name}>
                <label className="label" htmlFor={field.name}>
                  {field.label}
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  className="input"
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <button className="saveBtn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
