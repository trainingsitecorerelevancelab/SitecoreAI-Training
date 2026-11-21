import { Text, Image } from '@sitecore-content-sdk/nextjs';
import { FeaturedProjectProps } from '../FeaturedInteriors.types';
import styles from '../FeaturedProject.module.css';

export default function FeaturedProjectHorizontal({ fields }: FeaturedProjectProps) {
  return (
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
}
