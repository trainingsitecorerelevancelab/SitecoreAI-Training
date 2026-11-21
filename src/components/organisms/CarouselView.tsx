import React, { useEffect, useState } from 'react';

import styles from '../AdvisorCarousel/AdvisorCarousel.module.css';

import type { AdvisorCarouselData } from '../AdvisorCarousel/AdvisorCarousel.types';
import { CarouselSlides } from '../molecules/CarouselSlides';
import { CarouselControls } from '../molecules/CarouselControls';

interface CarouselViewProps {
  data: AdvisorCarouselData;
}

export const CarouselView = ({ data }: CarouselViewProps) => {
  const slides = data.item?.slides?.targetItems ?? [];
  const durationValue = Number(data.item?.slideDuration?.value);
  const duration =
    Number.isFinite(durationValue) && durationValue > 0 ? durationValue * 1000 : 5000;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, duration, slides.length]);

  if (slides.length === 0) {
    return <p>No advisor slides have been selected.</p>;
  }

  const activeSlide = slides[activeIndex];
  const moveTo = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };
  return (
    <section className={styles.carousel} aria-roledescription="carousel">
      <CarouselSlides slide={activeSlide} />
      {slides.length > 1 && (
        <CarouselControls slides={slides} activeIndex={activeIndex} moveTo={moveTo} />
      )}
    </section>
  );
};
