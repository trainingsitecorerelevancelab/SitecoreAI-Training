import type { NextApiRequest, NextApiResponse } from 'next';
import { FEATURED_SERVICES_QUERY } from '../../components/FeaturedServices/FeaturedServices.graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { datasourceId, language = 'en' } = req.body ?? {};

  if (typeof datasourceId !== 'string' || !datasourceId.trim()) {
    return res.status(400).json({ error: 'Invalid datasourceId' });
  }

  const endpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
  const apiKey = process.env.SITECORE_GRAPHQL_API_KEY;

  if (!endpoint || !apiKey) {
    return res.status(500).json({
      error: 'Sitecore GraphQL server configuration is missing',
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        sc_apikey: apiKey,
      },
      body: JSON.stringify({
        query: FEATURED_SERVICES_QUERY,
        variables: {
          datasourceId,
          language,
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `Sitecore GraphQL request failed: ${response.status}`,
      });
    }

    const result = await response.json();

    if (result.errors?.length) {
      return res.status(502).json({
        error: 'Sitecore GraphQL returned an error',
        details: process.env.NODE_ENV === 'development' ? result.errors : undefined,
      });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('FeaturedServices GraphQL request failed:', error);
    return res.status(500).json({
      error: 'Unable to retrieve featured services',
    });
  }
}
