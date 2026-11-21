import React from 'react';
import styles from '../AdvisorCarousel/AdvisorCarousel.module.css';

import type { AdvisorSlide } from '../AdvisorCarousel/AdvisorCarousel.types';
import { Image, Link, RichText, Text } from '@sitecore-content-sdk/nextjs';

interface AdvisorSlideViewProps {
  slide: AdvisorSlide;
}

export const CarouselSlides = ({ slide }: AdvisorSlideViewProps) => (
  <article
    className={styles.slide}
    data-tracking-key={slide.trackingKey?.jsonValue?.value ?? undefined}
  >
    {slide.advisorImage?.jsonValue && (
      <div className={styles.imageWrap}>
        <Image field={slide.advisorImage.jsonValue} className={styles.image} />
      </div>
    )}
    <div className={styles.content}>
      {slide.badgeText?.jsonValue && (
        <Text tag="p" field={slide.badgeText.jsonValue} className={styles.badge} />
      )}
      {slide.eyebrow?.jsonValue && (
        <Text tag="p" field={slide.eyebrow.jsonValue} className={styles.eyebrow} />
      )}
      {slide.headline?.jsonValue && (
        <Text tag="h2" field={slide.headline.jsonValue} className={styles.headline} />
      )}
      {slide.description?.jsonValue && (
        <RichText field={slide.description.jsonValue} className={styles.description} />
      )}
      <div className={styles.actions}>
        {slide.cta?.jsonValue?.value?.href && (
          <Link field={slide.cta.jsonValue} className={styles.primaryCta} />
        )}
        {slide.secondaryCta?.jsonValue?.value?.href && (
          <Link field={slide.secondaryCta.jsonValue} className={styles.secondaryCta} />
        )}
      </div>
    </div>
  </article>
);
