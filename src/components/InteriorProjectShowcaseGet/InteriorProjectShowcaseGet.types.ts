import type { Field } from '@sitecore-content-sdk/nextjs';

export interface InteriorProjectShowcaseGetFields {
  Heading: Field<string>;
  Description: Field<string>;
  ProjectsRoot: Field<string>;
}

export interface InteriorProjectShowcaseGetProps {
  fields?: InteriorProjectShowcaseGetFields;
  params?: {
    RenderingIdentifier?: string;
    [key: string]: unknown;
  };
}

export interface InteriorProject {
  id: string;
  title: string;
  description: string;
  designStyle: string;
  imageUrl: string;
  location: string;
  displayOrder: number;
}

export interface GraphQLField {
  jsonValue: unknown;
}

export interface GraphQLProjectItem {
  id: string;
  name: string;
  title: GraphQLField | null;
  description: GraphQLField | null;
  designStyle: GraphQLField | null;
  image: GraphQLField | null;
  location: GraphQLField | null;
  displayOrder: GraphQLField | null;
}

export interface ProjectsQueryResponse {
  data?: {
    item: {
      children: {
        results: GraphQLProjectItem[];
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}
