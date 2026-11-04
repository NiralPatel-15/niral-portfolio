"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Mail, MessageSquare } from "./ui/Icons";
import Button from "./ui/Button";
import { useHero, useContact } from "@/lib/content-context";
import styles from "./Hero.module.css";

// Repeating typewriter animation
function TypewriterName({ name }) {
  const [displayedCharacters, setDisplayedCharacters] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const characters = Array.from(name);

  useEffect(() => {
    let timer;

    // Full name displayed: wait before deleting
    if (!isDeleting && displayedCharacters === characters.length) {
      timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    }

    // Name completely deleted: wait before typing again
    else if (isDeleting && displayedCharacters === 0) {
      timer = window.setTimeout(() => {
        setIsDeleting(false);
      }, 700);
    }

    // Type or delete one character
    else {
      timer = window.setTimeout(
        () => {
          setDisplayedCharacters((current) =>
            isDeleting ? current - 1 : current + 1,
          );
        },
        isDeleting ? 55 : 95,
      );
    }

    return () => window.clearTimeout(timer);
  }, [displayedCharacters, isDeleting, characters.length]);

  return (
    <h1 className={styles.name} aria-label={name}>
      <span aria-hidden="true">
        {characters.slice(0, displayedCharacters).map((character, index) => (
          <span key={`${index}-${character}`}>
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>

      <span className={styles.cursor} aria-hidden="true" />

      <span className={styles.srOnly}>{name}</span>
    </h1>
  );
}

// Validate email before displaying it
function isValidEmail(value) {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !value.includes("example.com")
  );
}

// Validate WhatsApp URL
function isValidWhatsApp(value) {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      url.hostname === "wa.me" &&
      /^\d+$/.test(url.pathname.replaceAll("/", ""))
    );
  } catch {
    return false;
  }
}

export default function Hero() {
  const hero = useHero();
  const contact = useContact();

  const [showContact, setShowContact] = useState(false);
  const contactRef = useRef(null);

  const name = hero?.name || "Niral Patel";

  const email = isValidEmail(contact?.email) ? contact.email : "";

  const whatsapp = isValidWhatsApp(contact?.whatsapp) ? contact.whatsapp : "";

  const hasContactOptions = Boolean(email || whatsapp);

  const resumeUrl = hero?.resume || "/resume/resume.pdf";

  // Close contact dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setShowContact(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowContact(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.greeting}>Hello, I&#39;m</p>

        {/* Repeating typewriter animation */}
        <TypewriterName key={name} name={name} />

        <h2 className={styles.title}>
          {hero?.title || "Full-Stack Developer"}
          <span className={styles.titleDot}>.</span>
        </h2>

        <p className={styles.subtitle}>
          {hero?.subtitle ||
            "Building scalable web applications, modern digital experiences, and database-driven products."}
        </p>

        <div className={styles.buttons}>
          {/* Download Resume */}
          <a href={resumeUrl} className={styles.resumeButton} download>
            <Download size={17} />
            <span>Download Resume</span>
          </a>

          {/* Contact dropdown */}
          <div className={styles.contactWrap} ref={contactRef}>
            <Button
              variant="secondary"
              icon={Mail}
              onClick={() => {
                if (!hasContactOptions) {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });

                  return;
                }

                setShowContact((current) => !current);
              }}
              aria-expanded={showContact}
              aria-haspopup="true"
            >
              Get In Touch
            </Button>

            {showContact && (
              <div className={styles.contactDropdown}>
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={styles.contactOption}
                    onClick={() => setShowContact(false)}
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}

                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactOption}
                    onClick={() => setShowContact(false)}
                  >
                    <MessageSquare size={16} />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.heroFooter}>
          <span>Based in India</span>
          <span className={styles.footerLine} />
          <span>Open to learning and building</span>
        </div>
      </div>
    </section>
  );
}
