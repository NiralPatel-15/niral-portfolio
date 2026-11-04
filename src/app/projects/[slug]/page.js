import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { projects as fallbackProjects } from "@/data/projects";
import styles from "./ProjectDetails.module.css";

export const dynamic = "force-dynamic";

async function getProject(slug) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&select=*`,
        {
          headers: {
            apikey: supabaseKey,
          },
          cache: "no-store",
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) return data[0];
      } else {
        console.error("Supabase project fetch failed:", await response.text());
      }
    }
  } catch (error) {
    console.error("Project loading error:", error);
  }

  return fallbackProjects.find((item) => item.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found | Niral Patel" };
  }

  return {
    title: `${project.title} | Niral Patel`,
    description: project.subtitle || project.description,
    openGraph: {
      title: `${project.title} | Niral Patel`,
      description: project.subtitle || project.description,
      type: "article",
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectDetailsPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <Link href="/#projects" className={styles.backLink}>
            <span aria-hidden="true">←</span>
            Back to all projects
          </Link>

          <header className={styles.hero}>
            <div className={styles.eyebrow}>
              <span className={styles.dot} />
              {project.category || "Selected Project"}
            </div>

            <h1 className={styles.title}>{project.title}</h1>

            <p className={styles.subtitle}>
              {project.subtitle || project.description}
            </p>

            <div className={styles.meta}>
              <div>
                <span className={styles.metaLabel}>MY ROLE</span>
                <span className={styles.metaValue}>
                  {project.role || "Full-Stack Development"}
                </span>
              </div>

              <div>
                <span className={styles.metaLabel}>PROJECT TYPE</span>
                <span className={styles.metaValue}>
                  {project.category || "Development Project"}
                </span>
              </div>
            </div>
          </header>

          <section className={styles.cover}>
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} project preview`}
                className={styles.coverImage}
                width={1600}
                height={900}
                sizes="(max-width: 767px) 100vw, 1120px"
                priority
                unoptimized
              />
            ) : (
              <div className={styles.coverPlaceholder}>
                <span className={styles.coverNumber}>
                  PROJECT / SELECTED WORK
                </span>
                <span className={styles.coverName}>{project.title}</span>
                <span className={styles.coverCaption}>
                  SELECTED DEVELOPMENT WORK
                </span>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <span className={styles.sectionNumber}>01 / OVERVIEW</span>
            <h2>About the project</h2>
            <p>{project.overview || project.description}</p>
          </section>

          <section className={styles.twoColumns}>
            <div className={styles.infoBlock}>
              <span className={styles.sectionNumber}>02 / CHALLENGE</span>
              <h2>The challenge</h2>
              <p>{project.challenge || project.description}</p>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.sectionNumber}>03 / SOLUTION</span>
              <h2>The solution</h2>
              <p>{project.solution || project.overview}</p>
            </div>
          </section>

          {project.features?.length > 0 && (
            <section className={styles.section}>
              <span className={styles.sectionNumber}>04 / CAPABILITIES</span>
              <h2>Key features</h2>

              <div className={styles.featureGrid}>
                {project.features.map((feature, index) => (
                  <div className={styles.feature} key={feature}>
                    <span className={styles.featureIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.tech?.length > 0 && (
            <section className={styles.section}>
              <span className={styles.sectionNumber}>05 / TECHNOLOGY</span>
              <h2>Technology stack</h2>
              <p className={styles.stackIntro}>
                Technologies and tools used in this project.
              </p>

              <div className={styles.techGrid}>
                {project.tech.map((tech) => (
                  <span className={styles.tech} key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {project.architecture?.length > 0 && (
            <section className={styles.section}>
              <span className={styles.sectionNumber}>06 / IMPLEMENTATION</span>
              <h2>Technical architecture</h2>

              <div className={styles.architecture}>
                {project.architecture.map((item, index) => (
                  <div className={styles.architectureItem} key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(project.github || project.demo) && (
            <section className={styles.projectLinks}>
              <div>
                <span className={styles.sectionNumber}>
                  EXPLORE THE PROJECT
                </span>
                <h2>Interested in the implementation?</h2>
              </div>

              <div className={styles.linkGroup}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryLink}
                  >
                    GitHub Repository ↗
                  </a>
                )}

                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryLink}
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </section>
          )}

          <footer className={styles.bottomNav}>
            <Link href="/#projects">← Explore more projects</Link>
            <Link href="/#contact">Let&#39;s work together ↗</Link>
          </footer>
        </div>
      </main>

      <Footer />
    </>
  );
}
