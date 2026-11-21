import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export interface AdvisorSlide {
  id: string;
  eyebrow: { jsonValue: Field<string> | null } | null;
  headline: { jsonValue: Field<string> | null } | null;
  description: { jsonValue: Field<string> | null } | null;
  advisorImage: { jsonValue: ImageField | null } | null;
  cta: { jsonValue: LinkField | null } | null;
  secondaryCta: { jsonValue: LinkField | null } | null;
  badgeText: { jsonValue: Field<string> | null } | null;
  trackingKey: { jsonValue: Field<string> | null } | null;
}

export interface AdvisorCarouselData {
  item: {
    id: string;
    slideDuration: { value: string | null } | null;
    slides: { targetItems: AdvisorSlide[] | null } | null;
  } | null;
}

export interface AdvisorCarouselProps {
  rendering: { dataSource?: string };
  page?: { locale?: string };
}
