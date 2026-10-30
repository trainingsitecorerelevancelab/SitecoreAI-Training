import React, { useEffect, useState } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';

import type { FeaturedServicesProps, FeaturedServicesResponse } from './FeaturedServices.types';

import styles from './FeaturedServices.module.css';

export const Default = ({ rendering, page }: FeaturedServicesProps) => {
  const [data, setData] = useState<FeaturedServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const datasourceId = rendering.dataSource;
  const language = page?.locale ?? 'en';

  useEffect(() => {
    if (!datasourceId) {
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
            datasourceId,
            language,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load featured services: ${response.status}`);
        }

        const result: FeaturedServicesResponse = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unable to load featured services.');
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
    return <p>Featured Services datasource is not assigned.</p>;
  }

  if (loading) {
    return <p>Loading featured services...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const datasource = data?.item;

  if (!datasource) {
    return <p>Featured Services content not found.</p>;
  }

  const services = datasource.selectedServices?.targetItems ?? [];

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

              {service.serviceName?.jsonValue && (
                <Text
                  tag="h3"
                  field={service.serviceName.jsonValue}
                  className={styles.serviceName}
                />
              )}

              {service.description?.jsonValue && (
                <Text
                  tag="p"
                  field={service.description.jsonValue}
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
