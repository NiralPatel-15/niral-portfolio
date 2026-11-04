"use client";

import Image from "next/image";
import Section, { SectionHeader } from "./ui/Section";
import { Github, Linkedin, User } from "./ui/Icons";
import { useAbout, useContact } from "@/lib/content-context";
import styles from "./About.module.css";

export default function About() {
  const about = useAbout();
  const contact = useContact();

  return (
    <Section id="about">
      <SectionHeader>
        <h2>About Me</h2>
      </SectionHeader>

      <div className={styles.grid}>
        <div className={styles.text}>
          {about?.paragraphs?.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className={styles.imageWrap}>
          <div className={styles.imageGlow} />

          <div className={styles.imagePlaceholder}>
            {about?.image ? (
              <Image
                src={about.image}
                alt="Niral Patel"
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}

            <div style={about?.image ? { display: "none" } : {}}>
              <User />
              <span>Your Photo Here</span>
            </div>
          </div>

          <div className={styles.socialOverlay}>
            <a
              href={contact?.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <Github size={22} />
            </a>

            <a
              href={contact?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
