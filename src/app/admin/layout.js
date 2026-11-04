"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import "./admin.css";

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "D" }],
  },
  {
    title: "Portfolio Content",
    items: [
      { href: "/admin/hero", label: "Hero Section", icon: "H" },
      { href: "/admin/about", label: "About", icon: "A" },
      { href: "/admin/education", label: "Education", icon: "E" },
      { href: "/admin/experience", label: "Experience", icon: "X" },
      { href: "/admin/skills", label: "Skills", icon: "S" },
      { href: "/admin/projects", label: "Projects", icon: "P" },
      { href: "/admin/contact", label: "Contact", icon: "C" },
    ],
  },
];

export default function AdminLayout({ children }) {
  const [authStatus, setAuthStatus] = useState("checking");
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    let active = true;

    async function verifyAuth() {
      const token = localStorage.getItem("supabase_token");

      if (!token) {
        if (active) {
          setAuthStatus("unauthenticated");
          router.replace("/admin/login");
        }
        return;
      }

      try {
        const user = await api.auth.me(token);

        if (!active) return;

        if (user) {
          setAuthStatus("authenticated");
        } else {
          setAuthStatus("unauthenticated");
          router.replace("/admin/login");
        }
      } catch {
        if (!active) return;
        setAuthStatus("unauthenticated");
        router.replace("/admin/login");
      }
    }

    verifyAuth();

    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  function handleLogout() {
    localStorage.removeItem("supabase_token");
    localStorage.removeItem("supabase_refresh");
    setAuthStatus("unauthenticated");
    router.replace("/admin/login");
  }

  if (isLoginPage) return children;

  if (authStatus === "checking") {
    return (
      <div className="adminLoading">
        <div className="loadingMark">N</div>
        <span>Preparing your workspace...</span>
      </div>
    );
  }

  if (authStatus !== "authenticated") return null;

  const currentPage = navGroups
    .flatMap((group) => group.items)
    .find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    );

  return (
    <div className="adminLayout">
      {menuOpen && (
        <button
          type="button"
          className="adminOverlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside className={`adminSidebar ${menuOpen ? "adminSidebarOpen" : ""}`}>
        <div className="adminBrand">
          <div className="adminBrandMark">N</div>
          <div className="adminBrandText">
            <span>Niral Patel</span>
            <small>PORTFOLIO CMS</small>
          </div>

          <button
            type="button"
            className="adminClose"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="adminSidebarContent">
          {navGroups.map((group) => (
            <div className="adminNavGroup" key={group.title}>
              <div className="adminNavHeading">{group.title}</div>

              <nav className="adminNav">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`adminNavLink ${
                        isActive ? "adminNavLinkActive" : ""
                      }`}
                    >
                      <span className="adminNavIcon">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && <span className="adminNavIndicator" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="adminSidebarBottom">
          <Link href="/" target="_blank" className="adminPreviewLink">
            <span className="adminPreviewIcon">↗</span>
            View live website
          </Link>

          <div className="adminProfile">
            <div className="adminAvatar">N</div>
            <div className="adminProfileInfo">
              <span>Niral Patel</span>
              <small>Administrator</small>
            </div>
            <button
              type="button"
              className="adminLogout"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              ↗
            </button>
          </div>
        </div>
      </aside>

      <div className="adminMain">
        <header className="adminTopbar">
          <div className="adminTopbarLeft">
            <button
              type="button"
              className="adminMenuButton"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
            >
              <span />
              <span />
              <span />
            </button>

            <div className="adminBreadcrumb">
              <span>Workspace</span>
              <span className="breadcrumbDivider">/</span>
              <strong>{currentPage?.label || "Dashboard"}</strong>
            </div>
          </div>

          <div className="adminTopbarRight">
            <span className="adminStatus">
              <span className="statusDot" />
              Workspace active
            </span>

            <Link href="/" target="_blank" className="adminTopPreview">
              Preview website ↗
            </Link>
          </div>
        </header>

        <main className="adminContent">{children}</main>

        <footer className="adminFooter">
          <span>© {new Date().getFullYear()} Niral Patel</span>
          <span>Portfolio Content Management</span>
        </footer>
      </div>
    </div>
  );
}
