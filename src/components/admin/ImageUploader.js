"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ImageUploader.module.css";

export default function ImageUploader({
  value = "",
  onChange,
  label = "Upload Image",
}) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const previewUrlRef = useRef(null);

  const preview = filePreview || value;

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    previewUrlRef.current = objectUrl;
    setFile(selectedFile);
    setFilePreview(objectUrl);
    setError("");
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("supabase_token");

      if (!token) {
        throw new Error("Please log in to the admin panel again.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Image upload failed.");
      }

      onChange?.(result.url);

      setFile(null);
      setFilePreview("");

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }

      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setFile(null);
    setFilePreview("");
    setError("");

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    onChange?.("");
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>

      {preview && (
        <div className={styles.preview}>
          <Image
            src={preview}
            alt="Selected image preview"
            width={220}
            height={150}
            unoptimized
            className={styles.image}
          />

          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeButton}
            disabled={uploading}
          >
            Remove image
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className={styles.input}
      />

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className={styles.uploadButton}
        >
          {uploading ? "Uploading..." : "Upload Selected Image"}
        </button>
      )}

      <p className={styles.help}>JPG, PNG or WebP. Maximum file size: 5 MB.</p>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}