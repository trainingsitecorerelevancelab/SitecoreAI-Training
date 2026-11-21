'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import type { SiteSearchResponse, SiteSearchResult } from './SiteSearch.types';
import styles from './SiteSearch.module.css';

interface Props {
  renderingId?: string;
}

function readText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && 'value' in value) {
    return readText((value as { value: unknown }).value);
  }
  return '';
}

function getTitle(result: SiteSearchResult): string {
  return readText(result.ProjectTitle) || 'Untitled result';
}

function getDescription(result: SiteSearchResult): string {
  return readText(result.ProjectDescription);
}

function getResultHref(result: SiteSearchResult): string {
  const href = readText(result.sc_path) || readText(result.sc_path);
  if (!href) return '';

  try {
    const protocol = new URL(href, 'https://site-search.invalid').protocol;
    return protocol === 'http:' || protocol === 'https:' ? href : '';
  } catch {
    return '';
  }
}

export default function SiteSearchClient({ renderingId }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => () => requestController.current?.abort(), []);

  const search = async (term: string) => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchParams = new URLSearchParams({
        q: term.trim(),
        pathname: window.location.pathname,
      });
      const response = await fetch(`/api/site-search?${searchParams.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Search request failed. HTTP status: ${response.status}`);
      }

      const data: SiteSearchResponse = await response.json();
      if (!controller.signal.aborted) {
        setResults(data.results);
        setTotal(data.total);
      }
    } catch (requestError) {
      if (!controller.signal.aborted) {
        console.error('Error searching Sitecore:', requestError);
        setError('Unable to search right now. Please try again later.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void search(query);
  };

  return (
    <section className={styles.search} id={renderingId || undefined}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Search</h2>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} role="search">
        <label className={styles.field}>
          <span>Search term</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you looking for?"
          />
        </label>
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {loading && (
        <p className={styles.status} role="status">
          Searching…
        </p>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!loading && !error && !hasSearched && (
        <p className={styles.status}>Enter a search term to find pages.</p>
      )}
      {!loading && !error && hasSearched && results.length === 0 && (
        <p className={styles.status}>No results found. Try a different search term.</p>
      )}

      {results.length > 0 && (
        <>
          <p className={styles.resultCount} aria-live="polite">
            {total} {total === 1 ? 'result' : 'results'}
          </p>
          <ul className={styles.results}>
            {results.map((result, index) => {
              const title = getTitle(result);
              const description = getDescription(result);
              const href = getResultHref(result);

              return (
                <li className={styles.result} key={result.id || href || `${title}-${index}`}>
                  <div className={styles.content}>
                    {(readText(result.Location) || readText(result.Location)) && (
                      <p className={styles.location}>
                        {readText(result.Location) || readText(result.Location)}
                      </p>
                    )}
                    <h3 className={styles.title}>{href ? <a href={href}>{title}</a> : title}</h3>
                    {description && <p className={styles.description}>{description}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
