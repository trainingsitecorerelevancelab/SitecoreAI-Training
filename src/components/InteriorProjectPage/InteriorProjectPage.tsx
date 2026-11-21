import { Image, RichText, Text } from '@sitecore-content-sdk/nextjs';

import type { Field, ImageFieldValue } from '@sitecore-content-sdk/nextjs';

import styles from './InteriorProjectPage.module.css';

type ProjectFields = {
  ProjectName?: Field<string>;
  Description?: Field<string>;
  DesignStyle?: Field<string>;
  RoomType?: Field<string>;
  Location?: Field<string>;
  CompletionDate?: Field<string>;
  ProjectImage?: Field<ImageFieldValue>;
  Featured?: Field<boolean | string | number>;
  ProjectKeywords?: Field<string>;
};

type InteriorProjectPageProps = {
  fields?: ProjectFields;
};

function getString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getProjectDate(value: string): { dateTime: string; label: string } | undefined {
  const match = /^(\d{4})-?(\d{2})-?(\d{2})/.exec(value);

  if (!match) return undefined;

  const [, year, month, day] = match;

  const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    parsedDate.getUTCFullYear() !== Number(year) ||
    parsedDate.getUTCMonth() !== Number(month) - 1 ||
    parsedDate.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }

  return {
    dateTime: `${year}-${month}-${day}`,
    label: new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(parsedDate),
  };
}

function isFeatured(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true';
}

export const Default = (props: InteriorProjectPageProps) => {
  // Fields now come from the assigned datasource item.
  const fields = props.fields;

  if (!fields) {
    return null;
  }

  const projectName = fields.ProjectName;
  const description = fields.Description;

  const designStyle = getString(fields.DesignStyle?.value);
  const roomType = getString(fields.RoomType?.value);

  const location = fields.Location;

  const completionDate = getString(fields.CompletionDate?.value);

  const projectImage = fields.ProjectImage;

  const featured = isFeatured(fields.Featured?.value);

  const projectKeywords = getString(fields.ProjectKeywords?.value);

  const parsedDate = getProjectDate(completionDate);

  return (
    <article
      className={styles.project}
      data-search-entity="interior_project"
      data-design-style={designStyle}
      data-room-type={roomType}
      data-featured={String(featured)}
      data-location={getString(location?.value)}
      data-project-keywords={projectKeywords}
    >
      {projectName && <Text tag="h1" className={styles.projectTitle} field={projectName} />}

      {description && <RichText className={styles.projectDescription} field={description} />}

      {parsedDate && (
        <time className={styles.projectDate} dateTime={parsedDate.dateTime}>
          {parsedDate.label}
        </time>
      )}

      {projectImage?.value?.src && (
        <Image
          className={styles.projectImage}
          field={projectImage}
          alt={getString(projectName?.value)}
        />
      )}

      {location?.value && <p className={styles.projectLocation}>{location.value}</p>}

      {projectKeywords && <p className={styles.projectKeywords}>{projectKeywords}</p>}
    </article>
  );
};

export default Default;
