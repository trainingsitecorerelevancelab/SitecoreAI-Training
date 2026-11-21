'use client';
import { event } from '@sitecore-cloudsdk/events/browser';
import { useEffect, useState } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';

import type {
  GalleryGraphQLResponse,
  GraphQLInteriorProject,
  PersonalizedProjectGalleryProps,
} from './PersonalizedProjectGallery.types';
import styles from './PersonalizedProjectGallery.module.css';

export function PersonalizedProjectGalleryView({
  data,
  stylesClass,
}: {
  data: GalleryGraphQLResponse;
  stylesClass?: string;
}) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const datasource = data.datasource;
  const projects = [...(datasource?.projects?.targetItems ?? [])].sort((first, second) => {
    const firstPriority = Number(first.priority?.value);
    const secondPriority = Number(second.priority?.value);
    return (
      (Number.isFinite(secondPriority) ? secondPriority : 0) -
      (Number.isFinite(firstPriority) ? firstPriority : 0)
    );
  });

  const handleProjectInterest = async (project: GraphQLInteriorProject) => {
    setSelectedProject(project.id);

    const eventData = {
      type: 'INTERIOR_PROJECT_INTEREST',
      projectId: project.id,
      designStyle: project.designStyle?.value,
      roomType: project.roomType?.value,
    };

    try {
      await event({
        type: 'INTERIOR_PROJECT_INTEREST',
        channel: 'WEB',
        language: document.documentElement.lang || 'en',
        page: window.location.pathname,
        extensionData: {
          projectId: project.id,
          designStyle: project.designStyle?.value ?? '',
          roomType: project.roomType?.value ?? '',
        },
      });
      console.log('Personalization event:', eventData);
    } catch (error) {
      console.error('Unable to track project interest', error);
    }
  };

  if (!datasource) {
    return <p>No interior design projects available.</p>;
  }

  return (
    <section className={`${styles.gallery} ${stylesClass ?? ''}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          {datasource.heading?.value && (
            <Text tag="h2" field={{ value: datasource.heading.value }} className={styles.heading} />
          )}
          {datasource.description?.value && (
            <Text
              tag="p"
              field={{ value: datasource.description.value }}
              className={styles.description}
            />
          )}
        </header>

        {projects.length === 0 ? (
          <p>No interior design projects available.</p>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => (
              <article
                className={styles.card}
                key={project.id}
                data-priority={project.priority?.value}
              >
                {project.projectImage?.jsonValue && (
                  <div className={styles.imageWrapper}>
                    <Image field={project.projectImage.jsonValue} className={styles.image} />
                  </div>
                )}

                <div className={styles.cardContent}>
                  {project.designStyle?.value && (
                    <span className={styles.category}>{project.designStyle.value}</span>
                  )}
                  {project.projectTitle?.value && (
                    <Text
                      tag="h3"
                      field={{ value: project.projectTitle.value }}
                      className={styles.projectTitle}
                    />
                  )}
                  {project.projectDescription?.value && (
                    <Text
                      tag="p"
                      field={{ value: project.projectDescription.value }}
                      className={styles.projectDescription}
                    />
                  )}

                  {project.roomType?.value && (
                    <div className={styles.metadata}>
                      <span>Room: {project.roomType.value}</span>
                    </div>
                  )}

                  <div className={styles.actions}>
                    {project.projectLink?.jsonValue && (
                      <Link field={project.projectLink.jsonValue} className={styles.viewLink} />
                    )}
                    <button
                      type="button"
                      className={styles.interestButton}
                      onClick={() => handleProjectInterest(project)}
                    >
                      {selectedProject === project.id ? 'Interested ✓' : 'I Like This Design'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Default({ rendering, page, params }: PersonalizedProjectGalleryProps) {
  const [data, setData] = useState<GalleryGraphQLResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const datasourceId = rendering.dataSource;
  const language = page?.locale ?? 'en';

  useEffect(() => {
    if (!datasourceId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadGallery = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch('/api/personalized-project-gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ datasourceId, language }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: GalleryGraphQLResponse = await response.json();
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error ? loadError.message : 'Unable to load project gallery'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadGallery();
    return () => controller.abort();
  }, [datasourceId, language]);

  if (!datasourceId) {
    return <div>No datasourceId provided</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div role="alert">Error: {error}</div>;
  }
  if (!data?.datasource) {
    return <div>No data found for the provided datasourceId</div>;
  }

  return <PersonalizedProjectGalleryView data={data} stylesClass={params?.styles} />;
}

export default Default;
