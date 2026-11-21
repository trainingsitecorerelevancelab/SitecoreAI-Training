export interface SiteSearchResult {
  id?: string;
  ProjectTitle?: unknown;
  ProjectDescription?: unknown;
  Location?: unknown;
  resultType?: string;
  sc_item_id?: string;
  sc_locale?: string;
  sc_path?: string;
}

export interface SiteSearchResponse {
  results: SiteSearchResult[];
  total: number;
  locale: string;
}

export interface SiteSearchProps {
  params?: {
    RenderingIdentifier?: string;
  };
}
