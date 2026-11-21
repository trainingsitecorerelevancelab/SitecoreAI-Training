import SiteSearchClient from './SiteSearchClient';
import type { SiteSearchProps } from './SiteSearch.types';

export const Default = ({ params }: SiteSearchProps) => (
  <SiteSearchClient renderingId={params?.RenderingIdentifier} />
);

export default Default;
