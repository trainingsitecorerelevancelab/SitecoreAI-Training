import React from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';

import { FEATURED_SERVICES_QUERY } from './FeaturedServices.graphql';
import type { FeaturedServicesProps, FeaturedServicesResponse } from './FeaturedServices.types';

import styles from './FeaturedServices.module.css';

export const Default = async ({ rendering, page }: FeaturedServicesProps) => {
  const datasourceId = rendering.dataSource;

  if (!datasourceId) {
    return <p>Featured Services datasource is not assigned.</p>;
  }

  const endpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
  const apiKey = process.env.SITECORE_GRAPHQL_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Sitecore GraphQL configuration is missing.');
  }

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
        language: page?.locale ?? 'en',
      },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const result: {
    data?: FeaturedServicesResponse;
    errors?: { message: string }[];
  } = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join('; '));
  }

  const datasource = result.data?.item;

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
