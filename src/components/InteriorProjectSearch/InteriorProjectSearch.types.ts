import type { Field } from '@sitecore-content-sdk/nextjs';

export interface SearchCriteria {
  keyword: string;
  style: string;
  room: string;
  cursor?: string | null;
}

export interface InteriorProjectSearchProps {
  fields?: {
    TemplateId?: Field<string>;
    RootId?: Field<string>;
  };
  params?: {
    RenderingIdentifier?: string;
  };
}

export interface InteriorProjectSearchGraphQLField {
  value?: string | null;
  jsonValue?: unknown;
}

export interface InteriorProjectSearchGraphQLResult {
  id: string;
  name: string;
  url?: {
    path?: string | null;
  } | null;
  detailPage?: InteriorProjectSearchGraphQLField | null;
  projectName?: InteriorProjectSearchGraphQLField | null;
  description?: InteriorProjectSearchGraphQLField | null;
  designStyle?: InteriorProjectSearchGraphQLField | null;
  roomType?: InteriorProjectSearchGraphQLField | null;
  location?: InteriorProjectSearchGraphQLField | null;
  completionDate?: InteriorProjectSearchGraphQLField | null;
  featured?: InteriorProjectSearchGraphQLField | null;
  projectImage?: InteriorProjectSearchGraphQLField | null;
}

export interface InteriorProjectSearchProject {
  id: string;
  name: string;
  detailUrl: string;
  projectName: string;
  description: string;
  designStyle: string;
  roomType: string;
  location: string;
  completionDate: string;
  featured: string;
  projectImage: unknown;
}

export interface InteriorProjectSearchPageInfo {
  hasNext: boolean;
  endCursor: string | null;
}

export interface InteriorProjectSearchResponse {
  total: number;
  pageInfo: InteriorProjectSearchPageInfo;
  results: InteriorProjectSearchProject[];
}

export interface InteriorProjectSearchGraphQLResponse {
  data?: {
    search?: {
      total?: number;
      pageInfo?: {
        hasNext?: boolean;
        endCursor?: string | null;
      };
      results?: InteriorProjectSearchGraphQLResult[];
    } | null;
  };
  errors?: Array<{ message: string }>;
}
