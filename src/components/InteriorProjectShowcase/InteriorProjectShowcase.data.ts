import 'server-only';

import { unstable_cache } from 'next/cache';
import { INTERIOR_PROJECTS_QUERY } from './InteriorProjectShowcase.graphql';

import type {
  InteriorProject,
  GraphQLProjectItem,
  ProjectsQueryResponse,
} from './InteriorProjectShowcase.types';

import { PROJECT_CACHE_SECONDS, PROJECT_CACHE_TAG } from '../../lib/sitecore-project-cache';

function readText(field: { jsonValue: unknown } | null): string {
  const value = field?.jsonValue;

  if (typeof value === 'string') return value;

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if (typeof obj.value === 'string') return obj.value;
  }

  return '';
}

function readImageUrl(field: { jsonValue: unknown } | null): string {
  const value = field?.jsonValue;

  if (!value || typeof value !== 'object') return '';

  const obj = value as Record<string, unknown>;

  // Common Sitecore image field JSON shape
  const nested = obj.value;

  if (nested && typeof nested === 'object') {
    const src = (nested as Record<string, unknown>).src;
    if (typeof src === 'string') return src;
  }

  if (typeof obj.src === 'string') return obj.src;

  return '';
}

function mapProject(item: GraphQLProjectItem): InteriorProject {
  return {
    id: item.id,
    title: readText(item.title) || item.name,
    description: readText(item.description),
    designStyle: readText(item.designStyle),
    imageUrl: readImageUrl(item.image),
    location: readText(item.location),
    displayOrder: Number(readText(item.displayOrder)) || 0,
  };
}

export async function getInteriorProjects(
  rootPath: string,
  language = 'en'
): Promise<InteriorProject[]> {
  const endpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
  const apiKey = process.env.SITECORE_GRAPHQL_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Sitecore GraphQL configuration missing');
  }

  const getCachedProjects = unstable_cache(
    async () => {
      const currentApiKey = process.env.SITECORE_GRAPHQL_API_KEY;
      if (!currentApiKey) {
        throw new Error('Sitecore GraphQL configuration missing');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          sc_apikey: currentApiKey,
        },
        body: JSON.stringify({
          query: INTERIOR_PROJECTS_QUERY,
          variables: {
            rootPath,
            language,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Sitecore GraphQL request failed: ${response.status}`);
      }

      const result = (await response.json()) as ProjectsQueryResponse;

      if (result.errors?.length) {
        throw new Error(`Sitecore GraphQL: ${result.errors[0].message}`);
      }

      const items = result.data?.item?.children?.results ?? [];

      return items.map(mapProject).sort((a, b) => a.displayOrder - b.displayOrder);
    },
    [INTERIOR_PROJECTS_QUERY, endpoint, rootPath, language],
    {
      revalidate: PROJECT_CACHE_SECONDS,
      tags: [PROJECT_CACHE_TAG],
    }
  );

  return getCachedProjects();
}
