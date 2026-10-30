import React from 'react';
import { Text, RichText, Image, Link, useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import type { ContentSectionProps } from './ContentSection.types';
import styles from './ContentSection.module.css';

export const Default = ({ fields }: ContentSectionProps) => {
  const { sitecoreContext } = useSitecoreContext();

  if (!fields) {
    return <div>ContentSection datasource is not assigned.</div>;
  }

  const isImageLeft = fields.ImagePosition?.value?.toLowerCase() === 'left';

  const isLightGrey = fields.BackgroundStyle?.value?.toLowerCase() === 'lightgrey';

  const sectionClasses = [
    styles.contentSection,
    isImageLeft ? styles.imageLeft : styles.imageRight,
    isLightGrey ? styles.lightGrey : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClasses}>
      <section>
        <h2>Falcon Interiors</h2>
        <p>Site: {sitecoreContext.site?.name}</p>
        <p>Language: {sitecoreContext.language}</p>
        <p>
          Editing:{' '}
          {(sitecoreContext.mode as { isEditing?: boolean } | undefined)?.isEditing ? 'Yes' : 'No'}
        </p>
      </section>
      <div className={styles.container}>
        <div className={styles.content}>
          <Text tag="h2" field={fields.Heading} className={styles.heading} />

          <RichText field={fields.Description} className={styles.description} />

          {fields.CTA?.value?.href && <Link field={fields.CTA} className={styles.ctaButton} />}
        </div>
        <div className={styles.imageContainer}>
          {fields.SectionImage && <Image field={fields.SectionImage} className={styles.image} />}
        </div>
      </div>
    </section>
  );
};
