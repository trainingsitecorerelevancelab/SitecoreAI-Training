import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';

export interface ServiceItem {
  id: string;
  serviceName: {
    jsonValue: Field<string> | null;
  } | null;
  description: {
    jsonValue: Field<string> | null;
  } | null;
  serviceImage: {
    jsonValue: ImageField | null;
  } | null;
}

export interface FeaturedServicesResponse {
  item: {
    id: string;
    heading: {
      jsonValue: Field<string> | null;
    } | null;
    selectedServices: {
      targetItems: ServiceItem[];
    } | null;
  } | null;
}

export interface FeaturedServicesProps {
  rendering: {
    dataSource?: string;
  };
  page?: {
    locale?: string;
  };
}
