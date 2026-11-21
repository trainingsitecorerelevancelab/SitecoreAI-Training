import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export interface ServiceItem {
  id: string;
  name: {
    value: string | null;
  };
  description: {
    value: string | null;
  };
  serviceImage: {
    jsonValue: ImageField | null;
  };
}

export interface FeaturedServicesData {
  item: {
    id: string;
    heading: {
      jsonValue: Field<string> | null;
    };
    ListofServices: {
      Services: ServiceItem[] | null;
    } | null;
  };
}
export interface FeaturedServicesProps {
  rendering: {
    dataSource?: string;
  };
  page?: {
    locale?: string;
  };
}
