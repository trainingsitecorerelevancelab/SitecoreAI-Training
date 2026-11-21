import type { NextApiRequest, NextApiResponse } from 'next';
import { searchInteriorProjects } from '../../components/InteriorProjectSearch/InteriorProjectSearch.data';
import type { SearchCriteria } from '../../components/InteriorProjectSearch/InteriorProjectSearch.types';

function isSearchCriteria(value: unknown): value is SearchCriteria {
  if (!value || typeof value !== 'object') return false;

  const criteria = value as Record<string, unknown>;
  return (
    typeof criteria.keyword === 'string' &&
    typeof criteria.style === 'string' &&
    typeof criteria.room === 'string' &&
    (criteria.cursor === undefined ||
      criteria.cursor === null ||
      typeof criteria.cursor === 'string')
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { criteria, templateId, rootId } = req.body ?? {};
  if (
    !isSearchCriteria(criteria) ||
    typeof templateId !== 'string' ||
    !templateId.trim() ||
    typeof rootId !== 'string' ||
    !rootId.trim()
  ) {
    return res.status(400).json({ error: 'Invalid interior project search request' });
  }

  try {
    const results = await searchInteriorProjects(criteria, templateId, rootId);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(results);
  } catch (error) {
    console.error('Interior project GraphQL search failed:', error);
    return res.status(500).json({ error: 'Failed to search interior projects' });
  }
}
