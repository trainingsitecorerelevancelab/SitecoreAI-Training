'use client';

import { useEffect, useMemo, useState } from 'react';

import type { InteriorProject } from './InteriorProjectShowcase.types';

import styles from './InteriorProjectShowcase.module.css';

interface Props {
  heading: string;
  description: string;
  rootPath: string;
  renderingId?: string;
}

export default function InteriorProjectShowcaseClient({
  heading,
  description,
  rootPath,
  renderingId,
}: Props) {
  // -------------------------------
  // State
  // -------------------------------

  const [projects, setProjects] = useState<InteriorProject[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------
  // Fetch projects from Next.js API
  // -------------------------------

  useEffect(() => {
    if (!rootPath) {
      setProjects([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function loadProjects() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/interior-projects?rootPath=${encodeURIComponent(rootPath)}`,
          {
            method: 'GET',
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load projects. HTTP status: ${response.status}`);
        }

        const data: InteriorProject[] = await response.json();

        if (!controller.signal.aborted) {
          setProjects(data);
          setSelectedStyle('All');
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error loading interior projects:', err);
          setError('Unable to load interior projects. Please try again later.');
          setProjects([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      controller.abort();
    };
  }, [rootPath]);

  // -------------------------------
  // Build available design styles
  // -------------------------------

  const stylesAvailable = useMemo(() => {
    const uniqueStyles = new Set(
      projects.map((project) => project.designStyle).filter((style) => Boolean(style))
    );

    return ['All', ...Array.from(uniqueStyles)];
  }, [projects]);

  // -------------------------------
  // Filter projects locally
  // -------------------------------

  const filteredProjects = useMemo(() => {
    if (selectedStyle === 'All') {
      return projects;
    }

    return projects.filter((project) => project.designStyle === selectedStyle);
  }, [projects, selectedStyle]);

  // -------------------------------
  // Render component
  // -------------------------------

  return (
    <section className={styles.showcase} id={renderingId || undefined}>
      <div className={styles.container}>
        {/* Heading and description */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>OUR PORTFOLIO</span>

          <h2 className={styles.heading}>{heading}</h2>

          <p className={styles.description}>{description}</p>
        </header>

        {/* Loading indicator */}
        {loading && (
          <div className={styles.empty} role="status">
            Loading interior projects...
          </div>
        )}

        {/* Error message */}
        {!loading && error && (
          <div className={styles.empty} role="alert">
            {error}
          </div>
        )}

        {/* Show projects only after successful loading */}
        {!loading && !error && (
          <>
            {/* Design style filters */}
            <div className={styles.filters}>
              {stylesAvailable.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  aria-pressed={selectedStyle === style}
                  className={selectedStyle === style ? styles.activeFilter : styles.filterButton}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Project cards */}
            <div className={styles.grid}>
              {filteredProjects.map((project) => (
                <article className={styles.card} key={project.id}>
                  <div className={styles.imageWrapper}>
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className={styles.projectImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>Image unavailable</div>
                    )}
                  </div>

                  <div className={styles.cardContent}>
                    <span className={styles.category}>{project.designStyle}</span>

                    <h3 className={styles.projectTitle}>{project.title}</h3>

                    <p className={styles.projectDescription}>{project.description}</p>

                    <span className={styles.location}>{project.location}</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty results */}
            {filteredProjects.length === 0 && (
              <p className={styles.empty}>No projects found for this style.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
