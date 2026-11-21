import React, { useEffect, useState } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { FeaturedServicesProps, FeaturedServicesData } from './FeaturedServices.types';
import styles from './FeaturedServices.module.css';

export const Default = ({ rendering, page }: FeaturedServicesProps) => {
  const [data, setData] = useState<FeaturedServicesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const datasourceId = rendering.dataSource;
  const language = page?.locale ?? 'en';

  useEffect(() => {
    if (!datasourceId) {
      setError('No datasourceId provided');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadServices = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch('/api/featured-services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            datasourceId: datasourceId,
            language: language,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: FeaturedServicesData = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Error fetching featured services:', error);
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : 'Unable to load featured services');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => controller.abort();
  }, [datasourceId, language]);

  if (!datasourceId) {
    return <div>No datasourceId provided</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  const datasource = data?.item;
  if (!datasource) {
    return <div>No data found for the provided datasourceId</div>;
  }

  const services = datasource.ListofServices?.Services || [];

  return (
    <section className={styles.featuredServices}>
      {datasource.heading?.jsonValue && (
        <Text tag="h2" field={datasource.heading.jsonValue} className={styles.heading} />
      )}

      {services.length === 0 ? (
        <p>No featured services have been selected.</p>
      ) : (
        <div className={styles.grid}>
          {services.map((service) => (
            <article key={service.id} className={styles.card}>
              {service.serviceImage?.jsonValue && (
                <Image field={service.serviceImage.jsonValue} className={styles.image} />
              )}

              {service.name?.value && (
                <Text
                  tag="h3"
                  field={{ value: service.name.value }}
                  className={styles.serviceName}
                />
              )}

              {service.description?.value && (
                <RichText
                  tag="p"
                  field={{ value: service.description.value }}
                  className={styles.description}
                />
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
