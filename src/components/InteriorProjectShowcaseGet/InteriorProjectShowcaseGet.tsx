import InteriorProjectShowcaseGetClient from './InteriorProjectShowcaseGetClient';
import { getInteriorProjects } from './InteriorProjectShowcaseGet.data';

import type { InteriorProjectShowcaseGetProps } from './InteriorProjectShowcaseGet.types';

export const Default = async ({ fields, params }: InteriorProjectShowcaseGetProps) => {
  if (!fields) return null;

  const heading = fields.Heading?.value ?? '';
  const description = fields.Description?.value ?? '';
  const rootPath = fields.ProjectsRoot?.value ?? '';
  const projects = rootPath ? await getInteriorProjects(rootPath) : [];

  return (
    <InteriorProjectShowcaseGetClient
      heading={heading}
      description={description}
      projects={projects}
      renderingId={params?.RenderingIdentifier}
    />
  );
};

export default Default;
