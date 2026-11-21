'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import type {
  InteriorProjectSearchProject,
  InteriorProjectSearchResponse,
  SearchCriteria,
} from './InteriorProjectSearch.types';
import styles from './InteriorProjectSearch.module.css';

interface Props {
  templateId: string;
  rootId: string;
  renderingId?: string;
}

function getImageSource(image: unknown): string {
  if (!image || typeof image !== 'object') return '';

  const value = image as Record<string, unknown>;
  const nested = value.value;
  if (nested && typeof nested === 'object') {
    const src = (nested as Record<string, unknown>).src;
    if (typeof src === 'string') return src;
  }

  return typeof value.src === 'string' ? value.src : '';
}

function getFeaturedLabel(value: string): string {
  return value === '1' || value.toLowerCase() === 'true' ? 'Featured' : '';
}

export default function InteriorProjectSearchClient({ templateId, rootId, renderingId }: Props) {
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('');
  const [room, setRoom] = useState('');
  const [results, setResults] = useState<InteriorProjectSearchProject[]>([]);
  const [pageInfo, setPageInfo] = useState<InteriorProjectSearchResponse['pageInfo']>({
    hasNext: false,
    endCursor: null,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => () => requestController.current?.abort(), []);

  const fetchResults = async (criteria: SearchCriteria, append: boolean) => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interior-project-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria, templateId, rootId }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to search interior projects. HTTP status: ${response.status}`);
      }

      const data: InteriorProjectSearchResponse = await response.json();
      if (!controller.signal.aborted) {
        setResults((current) => (append ? [...current, ...data.results] : data.results));
        setPageInfo(data.pageInfo);
        setTotal(data.total);
      }
    } catch (requestError) {
      if (!controller.signal.aborted) {
        console.error('Error searching interior projects:', requestError);
        setError('Unable to search interior projects. Please try again later.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetchResults({ keyword, style, room }, false);
  };

  const handleLoadMore = () => {
    if (!pageInfo.endCursor || loading) return;
    void fetchResults({ keyword, style, room, cursor: pageInfo.endCursor }, true);
  };

  return (
    <section className={styles.search} id={renderingId || undefined}>
      <form className={styles.form} onSubmit={handleSubmit} role="search">
        <label className={styles.field}>
          <span>Keyword</span>
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search projects"
          />
        </label>
        <label className={styles.field}>
          <span>Design style</span>
          <input
            type="text"
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            placeholder="Any style"
          />
        </label>
        <label className={styles.field}>
          <span>Room type</span>
          <input
            type="text"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            placeholder="Any room"
          />
        </label>
        <button className={styles.submit} type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && (
        <p className={styles.status} role="status">
          Searching projects...
        </p>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && results.length === 0 && (
        <p className={styles.status}>Search for interior projects to see results.</p>
      )}

      {results.length > 0 && (
        <>
          <p className={styles.resultCount} aria-live="polite">
            Showing {results.length} of {total} projects
          </p>
          <ul className={styles.results}>
            {results.map((project) => {
              const imageSource = getImageSource(project.projectImage);
              const featuredLabel = getFeaturedLabel(project.featured);

              return (
                <li className={styles.result} key={project.id}>
                  {imageSource && (
                    <img
                      className={styles.image}
                      src={imageSource}
                      alt={project.projectName}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.content}>
                    <h2 className={styles.title}>
                      {project.detailUrl ? (
                        <a href={project.detailUrl}>{project.projectName}</a>
                      ) : (
                        project.projectName
                      )}
                    </h2>
                    {project.description && <p>{project.description}</p>}
                    <dl className={styles.metadata}>
                      {project.designStyle && (
                        <>
                          <dt>Design style</dt>
                          <dd>{project.designStyle}</dd>
                        </>
                      )}
                      {project.roomType && (
                        <>
                          <dt>Room type</dt>
                          <dd>{project.roomType}</dd>
                        </>
                      )}
                      {project.location && (
                        <>
                          <dt>Location</dt>
                          <dd>{project.location}</dd>
                        </>
                      )}
                      {project.completionDate && (
                        <>
                          <dt>Completion date</dt>
                          <dd>{project.completionDate}</dd>
                        </>
                      )}
                      {featuredLabel && (
                        <>
                          <dt>Project</dt>
                          <dd>{featuredLabel}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ul>
          {pageInfo.hasNext && (
            <button
              className={styles.loadMore}
              type="button"
              onClick={handleLoadMore}
              disabled={loading}
            >
              Load more
            </button>
          )}
        </>
      )}
    </section>
  );
}
