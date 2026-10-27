import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export interface ContentSectionFields {
  Heading: Field<string>;
  Description: Field<string>;
  SectionImage: ImageField;
  CTA: LinkField;
  ImagePosition: Field<string>;
  BackgroundStyle: Field<string>;
}

export interface ContentSectionProps {
  fields?: ContentSectionFields;
}
