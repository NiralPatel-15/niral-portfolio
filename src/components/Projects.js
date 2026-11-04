"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "./ui/Icons";
import Section, { SectionHeader } from "./ui/Section";
import { useProjects } from "@/lib/content-context";
import styles from "./Projects.module.css";

export default function Projects() {
  const projects = useProjects();
  const sliderRef = useRef(null);

  const showArrows = projects?.length > 3;
  const showSwipeHint = projects?.length > 1;

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.querySelector(`.${styles.card}`);

    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;
    const sliderStyles = window.getComputedStyle(slider);
    const gap =
      parseFloat(sliderStyles.columnGap) || parseFloat(sliderStyles.gap) || 24;

    slider.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  if (!projects?.length) return null;

  return (
    <Section id="projects">
      <div className={styles.sectionTop}>
        <SectionHeader>
          <h2>Selected Projects</h2>
        </SectionHeader>

        {showArrows && (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollSlider(-1)}
              aria-label="Previous projects"
            >
              ←
            </button>

            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollSlider(1)}
              aria-label="Next projects"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div
        className={styles.slider}
        ref={sliderRef}
        aria-label="Selected development projects"
      >
        {projects.map((project) => (
          <article
            className={styles.card}
            key={project.id || project.slug || project.title}
          >
            <Link
              href={`/projects/${project.slug}`}
              className={styles.cardLink}
              aria-label={`View ${project.title} project details`}
            >
              {project.image ? (
                <div className={styles.imageWrapper}>
                  <Image
                    src={project.image}
                    alt={`${project.title} project cover`}
                    width={800}
                    height={450}
                    unoptimized
                    className={styles.projectImage}
                  />
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.placeholderLabel}>
                    SELECTED DEVELOPMENT WORK
                  </span>

                  <span className={styles.placeholderTitle}>
                    {project.title}
                  </span>

                  <span className={styles.placeholderCaption}>
                    Project preview coming soon
                  </span>
                </div>
              )}

              <div className={styles.cardBody}>
                <h3 className={styles.title}>{project.title}</h3>

                <p className={styles.body}>{project.description}</p>

                <div className={styles.techs}>
                  {project.tech?.map((tech) => (
                    <span className={styles.tech} key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className={styles.features}>
                  {project.features?.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className={styles.footer}>
                  <span className={styles.link}>
                    View Project Details
                    <ExternalLink className={styles.linkIcon} />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {showSwipeHint && (
        <p className={styles.sliderHint}>
          Swipe or scroll to explore all projects
        </p>
      )}
    </Section>
  );
}
