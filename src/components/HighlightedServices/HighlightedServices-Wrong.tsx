import React, { useEffect, useState } from 'react';
import { Text, RichText, Image } from '@sitecore-content-sdk/nextjs';
import type { FeaturedServicesProps, FeaturedServicesData } from './HighlightedServices.types';
import { FEATURED_SERVICES_QUERY } from './HighlightedServices.graphql';
import styles from './HighlightedServices.module.css';

export const DefaultWrong = ({ rendering, page }: FeaturedServicesProps) => {
  const [data, setData] = useState<FeaturedServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const datasourceId = rendering.dataSource;
  const language = page?.locale ?? 'en';

  useEffect(() => {
    const loadServices = async () => {
      if (!datasourceId) {
        setError('No datasourceId provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // ❌ These variables are NOT available in browser code
        const endpoint = process.env.NEXT_PUBLIC_SITECORE_GRAPHQL_ENDPOINT;
        const apiKey = process.env.NEXT_PUBLIC_SITECORE_GRAPHQL_API_KEY;

        console.log('GraphQL Endpoint:', endpoint);
        console.log('GraphQL API Key:', apiKey);

        if (!endpoint || !apiKey) {
          throw new Error('GraphQL configuration missing: environment variables are undefined');
        }

        // ❌ Direct request from browser to Sitecore
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            sc_apikey: apiKey,
          },
          body: JSON.stringify({
            query: FEATURED_SERVICES_QUERY,
            variables: {
              datasourceId,
              language,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`GraphQL request failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }

        setData(result.data);
      } catch (err) {
        console.error('FeaturedServices Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void loadServices();
  }, [datasourceId, language]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const datasource = data?.item;

  if (!datasource) {
    return <div>No data found</div>;
  }
  const services = datasource?.ListofServices?.Services || [];
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
