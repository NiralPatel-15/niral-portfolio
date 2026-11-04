"use client";

import { useContact } from "@/lib/content-context";
import { ArrowUp, Mail } from "lucide-react";
import { Github, Linkedin } from "./ui/Icons";
import styles from "./Footer.module.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function isValidProfileUrl(url) {
  return (
    typeof url === "string" &&
    url.startsWith("https://") &&
    !url.includes("yourusername") &&
    !url.includes("example.com")
  );
}

function InstagramIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const contact = useContact();

  const email =
    contact?.email && contact.email !== "your.email@example.com"
      ? contact.email
      : null;

  const github = contact?.github || contact?.social?.github;
  const linkedin = contact?.linkedin || contact?.social?.linkedin;
  const instagram = contact?.instagram || contact?.social?.instagram;

  function handleNavigation(e, href) {
    e.preventDefault();

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a
              href="#home"
              className={styles.logo}
              onClick={(e) => handleNavigation(e, "#home")}
            >
              Niral Patel<span>.</span>
            </a>

            <p className={styles.description}>
              Full-Stack Developer and MCA student passionate about building
              modern web applications and meaningful digital experiences.
            </p>

            <div className={styles.socials}>
              {isValidProfileUrl(github) && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  title="GitHub"
                >
                  <Github size={19} />
                </a>
              )}

              {isValidProfileUrl(linkedin) && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  title="LinkedIn"
                >
                  <Linkedin size={19} />
                </a>
              )}

              {isValidProfileUrl(instagram) && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram profile"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label="Send email"
                  title="Email"
                >
                  <Mail size={19} />
                </a>
              )}
            </div>
          </div>

          <div className={styles.navigation}>
            <h3 className={styles.heading}>Explore</h3>

            <nav className={styles.links} aria-label="Footer navigation">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.connect}>
            <h3 className={styles.heading}>Let&#39;s Connect</h3>

            <p>
              Have an opportunity, a project idea, or just want to connect? I&#39;d
              be happy to hear from you.
            </p>

            <a
              href="#contact"
              className={styles.contactLink}
              onClick={(e) => handleNavigation(e, "#contact")}
            >
              Get in touch <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Niral Patel. All rights reserved.
          </p>

          <p className={styles.madeWith}>Designed & built with care.</p>

          <button
            type="button"
            className={styles.backToTop}
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}