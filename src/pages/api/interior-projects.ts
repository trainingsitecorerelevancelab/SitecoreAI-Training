import type { NextApiRequest, NextApiResponse } from 'next';

import { getInteriorProjects } from '../../components/InteriorProjectShowcase/InteriorProjectShowcase.data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const rootPath = req.query.rootPath;
    const language = req.query.language;

    if (typeof rootPath !== 'string' || !rootPath.startsWith('/sitecore/content/')) {
      return res.status(400).json({
        error: 'Invalid rootPath',
      });
    }

    const projects = await getInteriorProjects(
      rootPath,
      typeof language === 'string' ? language : 'en'
    );

    // The tagged server Data Cache lives in getInteriorProjects; don't cache this API response separately.
    res.setHeader('Cache-Control', 'no-store');
    //res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    return res.status(200).json(projects);
  } catch (error) {
    console.error('GraphQL error:', error);

    return res.status(500).json({
      error: 'Failed to fetch projects',
    });
  }
}
