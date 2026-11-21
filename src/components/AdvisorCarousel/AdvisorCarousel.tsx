import React from 'react';

import type { AdvisorCarouselProps } from './AdvisorCarousel.types';

import { useAdvisorCarouselData } from './useAdvisorCarsouelData';
import { CarouselView } from 'components/organisms/CarouselView';

export const Default = ({ rendering, page }: AdvisorCarouselProps) => {
  const datasourceId = rendering?.dataSource;
  const language = page?.locale ?? 'en';

  const { data, error } = useAdvisorCarouselData(datasourceId, language);

  if (!datasourceId) return <div>No datasourceId provided</div>;
  if (error) return <div role="alert">Error: {error}</div>;
  if (!data) return <div>Loading...</div>;
  if (!data.item) return <div>No data found for the provided datasourceId</div>;

  return <CarouselView data={data} />;
};
