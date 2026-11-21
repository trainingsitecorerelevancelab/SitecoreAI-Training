import { useEffect, useState } from 'react';

import type { AdvisorCarouselData } from './AdvisorCarousel.types';

export const useAdvisorCarouselData = (datasourceId?: string, language?: string) => {
  const [data, setData] = useState<AdvisorCarouselData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!datasourceId) {
      setError('No datasourceId provided');
      return;
    }

    const controller = new AbortController();
    const loadCarousel = async () => {
      setData(null);
      setError(null);
      try {
        const response = await fetch('/api/advisor-carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ datasourceId, language }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setData((await response.json()) as AdvisorCarouselData);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === 'AbortError') return;
        setError(
          loadError instanceof Error ? loadError.message : 'Unable to load advisor carousel'
        );
      }
    };

    void loadCarousel();
    return () => controller.abort();
  }, [datasourceId, language]);

  return { data, error };
};
