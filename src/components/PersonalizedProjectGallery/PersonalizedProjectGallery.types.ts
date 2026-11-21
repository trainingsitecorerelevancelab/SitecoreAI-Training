import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export interface GraphQLField {
  value?: string | null;
}

export interface GraphQLImageField {
  jsonValue?: ImageField | null;
}

export interface GraphQLLinkField {
  jsonValue?: LinkField | null;
}

export interface GraphQLInteriorProject {
  id: string;
  name: string;

  projectTitle?: GraphQLField | null;
  projectDescription?: GraphQLField | null;
  projectImage?: GraphQLImageField | null;
  designStyle?: GraphQLField | null;
  priority?: GraphQLField | null;
  roomType?: GraphQLField | null;
  projectLink?: GraphQLLinkField | null;
}

export interface GraphQLGalleryDatasource {
  id: string;
  name: string;

  heading?: GraphQLField | null;
  description?: GraphQLField | null;

  projects?: {
    targetItems?: GraphQLInteriorProject[] | null;
  } | null;
}

export interface GalleryGraphQLResponse {
  datasource: GraphQLGalleryDatasource | null;
}

export interface PersonalizedProjectGalleryProps {
  rendering: {
    dataSource?: string;
  };

  page?: {
    locale?: string;
  };

  params?: {
    styles?: string;
    [key: string]: string | undefined;
  };
}
