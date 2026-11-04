"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const sections = [
  {
    key: "hero",
    label: "Hero Section",
    icon: "H",
    path: "/admin/hero",
    hint: "Introduction and headline",
  },
  {
    key: "about",
    label: "About",
    icon: "A",
    path: "/admin/about",
    hint: "Your profile and story",
  },
  {
    key: "education",
    label: "Education",
    icon: "E",
    path: "/admin/education",
    hint: "Academic background",
  },
  {
    key: "experience",
    label: "Experience",
    icon: "X",
    path: "/admin/experience",
    hint: "Professional experience",
  },
  {
    key: "skill_categories",
    label: "Skills",
    icon: "S",
    path: "/admin/skills",
    hint: "Technologies and expertise",
  },
  {
    key: "projects",
    label: "Projects",
    icon: "P",
    path: "/admin/projects",
    hint: "Portfolio projects",
  },
  {
    key: "contact",
    label: "Contact",
    icon: "C",
    path: "/admin/contact",
    hint: "Contact information",
  },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const results = await Promise.all(
          sections.map(async (section) => {
            try {
              const data = await api.admin.fetch(section.key);

              return [section.key, Array.isArray(data) ? data.length : 0];
            } catch {
              return [section.key, null];
            }
          }),
        );

        if (active) {
          setCounts(Object.fromEntries(results));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const totalItems = Object.values(counts).reduce(
    (total, value) => (typeof value === "number" ? total + value : total),
    0,
  );

  return (
    <div className="adminDashboard">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Dashboard overview</h1>
          <p className="pageDesc">
            Manage your portfolio, content and professional presence.
          </p>
        </div>
      </div>

      <section className="dashboardWelcome">
        <div className="dashboardWelcomeText">
          <div className="dashboardEyebrow">YOUR WORKSPACE</div>

          <h2 className="dashboardWelcomeTitle">Welcome back, Niral.</h2>

          <p className="dashboardWelcomeDesc">
            Your portfolio content is managed from one place. Keep your profile
            and projects up to date.
          </p>
        </div>

        <div className="dashboardWelcomeMark">N</div>
      </section>

      <div className="dashboardSectionHeading">
        <h2>Content overview</h2>
        <span>
          {loading
            ? "Loading content..."
            : `${totalItems} records across your sections`}
        </span>
      </div>

      <div className="dashboardGrid">
        {sections.map((section) => {
          const count = counts[section.key];

          return (
            <Link key={section.key} href={section.path} className="dashCard">
              <div className="dashCardTop">
                <span className="dashCardIcon">{section.icon}</span>

                <span className="dashCardArrow">↗</span>
              </div>

              <div>
                <div className="dashCardLabel">{section.label}</div>

                <div className="dashCardCount">
                  {loading
                    ? "—"
                    : count === null || count === undefined
                      ? "!"
                      : count}
                </div>

                <div className="dashCardHint">{section.hint}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="dashboardSectionHeading">
        <h2>Quick actions</h2>
        <span>Manage your portfolio faster</span>
      </div>

      <div className="dashboardQuickActions">
        <Link href="/admin/projects" className="dashboardQuickAction">
          <span className="quickActionIcon">P</span>
          <span className="quickActionText">
            <strong>Manage projects</strong>
            <small>Update your featured work</small>
          </span>
        </Link>

        <Link href="/admin/skills" className="dashboardQuickAction">
          <span className="quickActionIcon">S</span>
          <span className="quickActionText">
            <strong>Update skills</strong>
            <small>Maintain your technical profile</small>
          </span>
        </Link>

        <Link href="/admin/contact" className="dashboardQuickAction">
          <span className="quickActionIcon">C</span>
          <span className="quickActionText">
            <strong>Contact details</strong>
            <small>Keep your contact information current</small>
          </span>
        </Link>
      </div>
    </div>
  );
}
