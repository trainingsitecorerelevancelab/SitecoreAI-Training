import InteriorProjectShowcaseClient from './InteriorProjectShowcaseClient';

import type { InteriorProjectShowcaseProps } from './InteriorProjectShowcase.types';

export const Default = ({ fields, params }: InteriorProjectShowcaseProps) => {
  if (!fields) return null;

  return (
    <InteriorProjectShowcaseClient
      heading={fields.Heading?.value ?? ''}
      description={fields.Description?.value ?? ''}
      rootPath={fields.ProjectsRoot?.value ?? ''}
      renderingId={params?.RenderingIdentifier}
    />
  );
};

export default Default;
