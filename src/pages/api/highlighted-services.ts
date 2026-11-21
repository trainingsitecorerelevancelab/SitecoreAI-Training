import type { NextApiRequest, NextApiResponse } from 'next';
import { FEATURED_SERVICES_QUERY } from '../../components/HighlightedServices/HighlightedServices.graphql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const endpoint = process.env.SITECORE_GRAPHQL_ENDPOINT;
  const apiKey = process.env.SITECORE_GRAPHQL_API_KEY;

  console.log('GraphQL Endpoint:', endpoint);
  console.log('GraphQL API Key:', apiKey);

  if (!endpoint || !apiKey) {
    return res
      .status(500)
      .json({ error: 'GraphQL configuration missing: environment variables are undefined' });
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
          datasourceId: req.body.datasourceId,
          language: req.body.language,
        },
      }),
      cache: 'no-store', // Disable caching for this request
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `GraphQL request failed: ${response.status}` });
    }

    const result = await response.json();

    if (result.errors?.length) {
      return res.status(500).json({ error: result.errors[0].message });
    }

    return res.status(200).json({ data: result.data });
  } catch (error) {
    console.error('Error fetching highlighted services:', error);
    return res.status(500).json({ error: 'Failed to fetch highlighted services' });
  }
}
