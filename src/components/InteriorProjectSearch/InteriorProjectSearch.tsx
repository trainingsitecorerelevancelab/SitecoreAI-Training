import InteriorProjectSearchClient from './InteriorProjectSearchClient';
import type { InteriorProjectSearchProps } from './InteriorProjectSearch.types';

export const Default = ({ fields, params }: InteriorProjectSearchProps) => {
  const templateId = fields?.TemplateId?.value ?? '';
  const rootId = fields?.RootId?.value ?? '';

  if (!templateId || !rootId) {
    return <p role="alert">Interior project search requires a template ID and root ID.</p>;
  }

  return (
    <InteriorProjectSearchClient
      templateId={templateId}
      rootId={rootId}
      renderingId={params?.RenderingIdentifier}
    />
  );
};

export default Default;
