"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import styles from "./login.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.auth.login(email.trim(), password);

      if (!data?.access_token) {
        throw new Error("Login failed. Please check your credentials.");
      }

      localStorage.setItem("supabase_token", data.access_token);

      if (data.refresh_token) {
        localStorage.setItem("supabase_refresh", data.refresh_token);
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.visualPanel}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>N</span>
          <span>Niral Patel</span>
        </div>

        <div className={styles.visualContent}>
          <p className={styles.eyebrow}>Portfolio CMS</p>

          <h1 className={styles.visualTitle}>
            Your work.
            <br />
            Your story.
            <br />
            <span>Your space.</span>
          </h1>

          <p className={styles.visualDescription}>
            A dedicated workspace to manage your portfolio, showcase your
            projects and keep your professional presence up to date.
          </p>
        </div>

        <div className={styles.visualFooter}>
          © {new Date().getFullYear()} Niral Patel. All rights reserved.
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.mobileBrand}>
            <span className={styles.brandMark}>N</span>
            <span>Niral Patel</span>
          </div>

          <p className={styles.formEyebrow}>Administrator access</p>

          <h2 className={styles.heading}>Welcome back.</h2>

          <p className={styles.description}>
            Sign in to access your portfolio workspace.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="admin-email">
                Email address
              </label>

              <input
                id="admin-email"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="admin-password">
                Password
              </label>

              <div className={styles.inputWrap}>
                <input
                  id="admin-password"
                  className={`${styles.input} ${styles.passwordInput}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !email.trim() || !password}
            >
              {loading ? "Signing you in..." : "Sign in to workspace"}
            </button>
          </form>

          <Link href="/" className={styles.backLink}>
            ← Back to portfolio
          </Link>
        </div>
      </section>
    </main>
  );
}
