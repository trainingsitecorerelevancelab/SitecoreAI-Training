import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export type FeaturedProjectFields = {
  ProjectTitle: Field<string>;
  ProjectDescription: Field<string>;
  ProjectImage: ImageField;
  ProjectLink: LinkField;
};

export type FeaturedProjectProps = {
  fields: FeaturedProjectFields;
};
