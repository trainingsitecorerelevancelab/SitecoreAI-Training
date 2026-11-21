'use client';

import { useMemo, useState } from 'react';

import type { InteriorProject } from './InteriorProjectShowcaseGet.types';

import styles from './InteriorProjectShowcaseGet.module.css';

interface Props {
  heading: string;
  description: string;
  projects: InteriorProject[];
  renderingId?: string;
}

export default function InteriorProjectShowcaseGetClient({
  heading,
  description,
  projects,
  renderingId,
}: Props) {
  const [selectedStyle, setSelectedStyle] = useState<string>('All');

  const stylesAvailable = useMemo(() => {
    const uniqueStyles = new Set(
      projects.map((project) => project.designStyle).filter((style) => Boolean(style))
    );

    return ['All', ...Array.from(uniqueStyles)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedStyle === 'All') {
      return projects;
    }

    return projects.filter((project) => project.designStyle === selectedStyle);
  }, [projects, selectedStyle]);

  return (
    <section className={styles.showcase} id={renderingId || undefined}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>OUR PORTFOLIO</span>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.description}>{description}</p>
        </header>

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

        {filteredProjects.length === 0 && (
          <p className={styles.empty}>No projects found for this style.</p>
        )}
      </div>
    </section>
  );
}
