import 'server-only';

import { INTERIOR_SEARCH_QUERY, buildSearchVariables } from './InteriorProjectSearch.graphql';
import type {
  InteriorProjectSearchGraphQLField,
  InteriorProjectSearchGraphQLResponse,
  InteriorProjectSearchGraphQLResult,
  InteriorProjectSearchProject,
  InteriorProjectSearchResponse,
  SearchCriteria,
} from './InteriorProjectSearch.types';

function readText(field: InteriorProjectSearchGraphQLField | null | undefined): string {
  return typeof field?.value === 'string' ? field.value : '';
}

function readDetailUrl(item: InteriorProjectSearchGraphQLResult): string {
  const detailPage = item.detailPage?.jsonValue;
  if (typeof detailPage === 'string') return detailPage;

  if (detailPage && typeof detailPage === 'object') {
    const value = detailPage as Record<string, unknown>;
    const nestedValue = value.value;
    if (nestedValue && typeof nestedValue === 'object') {
      const href = (nestedValue as Record<string, unknown>).href;
      if (typeof href === 'string' && href) return href;
    }

    const href = value.href;
    if (typeof href === 'string' && href) return href;
  }

  return item.url?.path ?? '';
}

function mapProject(item: InteriorProjectSearchGraphQLResult): InteriorProjectSearchProject {
  return {
    id: item.id,
    name: item.name,
    detailUrl: readDetailUrl(item),
    projectName: readText(item.projectName) || item.name,
    description: readText(item.description),
    designStyle: readText(item.designStyle),
    roomType: readText(item.roomType),
    location: readText(item.location),
    completionDate: readText(item.completionDate),
    featured: readText(item.featured),
    projectImage: item.projectImage?.jsonValue ?? null,
  };
}

export async function searchInteriorProjects(
  criteria: SearchCriteria,
  templateId: string,
  rootId: string
): Promise<InteriorProjectSearchResponse> {
  const endpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
  const apiKey = process.env.SITECORE_GRAPHQL_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Sitecore GraphQL configuration missing');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      sc_apikey: apiKey,
    },
    body: JSON.stringify({
      query: INTERIOR_SEARCH_QUERY,
      variables: buildSearchVariables(criteria, templateId, rootId),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Sitecore GraphQL request failed: ${response.status}`);
  }

  const result = (await response.json()) as InteriorProjectSearchGraphQLResponse;
  if (result.errors?.length) {
    throw new Error(`Sitecore GraphQL: ${result.errors[0].message}`);
  }

  const search = result.data?.search;
  return {
    total: search?.total ?? 0,
    pageInfo: {
      hasNext: search?.pageInfo?.hasNext ?? false,
      endCursor: search?.pageInfo?.endCursor ?? null,
    },
    results: (search?.results ?? []).map(mapProject),
  };
}
