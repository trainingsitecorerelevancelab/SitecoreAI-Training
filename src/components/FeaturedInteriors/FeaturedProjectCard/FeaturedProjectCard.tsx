import { Text, Image } from '@sitecore-content-sdk/nextjs';
import { FeaturedProjectProps } from '../FeaturedInteriors.types';
import styles from '../FeaturedProject.module.css';

export default function FeaturedProjectCard({ fields }: FeaturedProjectProps) {
  return (
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
}
