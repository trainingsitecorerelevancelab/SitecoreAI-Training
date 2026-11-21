import { Image, Text } from '@sitecore-content-sdk/nextjs';
import { FeaturedProjectProps } from './FeaturedInteriors.types';
import styles from './FeaturedProject.module.css';

export const Default = ({ fields }: FeaturedProjectProps) => (
  <article className={styles.card}>
    <div className={styles.cardImage}>
      <Image field={fields.ProjectImage} />
    </div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>
        <Text field={fields.ProjectTitle} />
      </h3>
      <div className={styles.cardDescription}>
        <Text field={fields.ProjectDescription} />
      </div>
    </div>
  </article>
);

export const Card = ({ fields }: FeaturedProjectProps) => (
  <article className={styles.card}>
    <div className={styles.cardImage}>
      <Image field={fields.ProjectImage} />
    </div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>
        <Text field={fields.ProjectTitle} />
      </h3>
      <div className={styles.cardDescription}>
        <Text field={fields.ProjectDescription} />
      </div>
    </div>
  </article>
);

export const Banner = ({ fields }: FeaturedProjectProps) => (
  <section className={styles.banner}>
    <div className={styles.bannerImage}>
      <Image field={fields.ProjectImage} />
    </div>
    <div className={styles.bannerOverlay}>
      <h2 className={styles.bannerTitle}>
        <Text field={fields.ProjectTitle} />
      </h2>
      <div className={styles.bannerDescription}>
        <Text field={fields.ProjectDescription} />
      </div>
    </div>
  </section>
);

export const Horizontal = ({ fields }: FeaturedProjectProps) => (
  <article className={styles.horizontal}>
    <div className={styles.horizontalImage}>
      <Image field={fields.ProjectImage} />
    </div>
    <div className={styles.horizontalContent}>
      <h2 className={styles.horizontalTitle}>
        <Text field={fields.ProjectTitle} />
      </h2>
      <div className={styles.horizontalDescription}>
        <Text field={fields.ProjectDescription} />
      </div>
    </div>
  </article>
);
