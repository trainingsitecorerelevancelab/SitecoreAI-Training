import { Text, Image } from '@sitecore-content-sdk/nextjs';
import { FeaturedProjectProps } from '../FeaturedInteriors.types';
import styles from '../FeaturedProject.module.css';

export default function FeaturedProjectBanner({ fields }: FeaturedProjectProps) {
  return (
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
}
