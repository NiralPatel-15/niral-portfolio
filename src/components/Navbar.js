"use client";

import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      let current = "";

      for (const link of [...links].reverse()) {
        const id = link.href.slice(1);
        const section = document.getElementById(id);

        if (section && section.getBoundingClientRect().top <= 150) {
          current = id;
          break;
        }
      }

      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function handleNavClick(e, href) {
    e.preventDefault();
    setOpen(false);

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <nav className={cn(styles.nav, scrolled && styles.navScrolled)}>
      <div className={styles.inner}>
        <a
          href="#home"
          className={styles.logo}
          onClick={(e) => handleNavClick(e, "#home")}
          aria-label="Niral Patel home"
        >
          Niral Patel<span className={styles.logoDot}>.</span>
        </a>

        <button
          className={cn(styles.hamburger, open && styles.hamburgerOpen)}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="portfolio-navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <ul
          id="portfolio-navigation"
          className={cn(styles.links, open && styles.linksOpen)}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  styles.link,
                  active === link.href.slice(1) && styles.linkActive,
                )}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
