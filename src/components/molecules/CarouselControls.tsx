import React from 'react';
import styles from '../AdvisorCarousel/AdvisorCarousel.module.css';

import type { AdvisorSlide } from '../AdvisorCarousel/AdvisorCarousel.types';

interface CarouselControlsProps {
  slides: AdvisorSlide[];
  activeIndex: number;
  moveTo: (index: number) => void;
}

export const CarouselControls = ({ slides, activeIndex, moveTo }: CarouselControlsProps) => (
  <div className={styles.controls}>
    <button type="button" onClick={() => moveTo(activeIndex - 1)} aria-label="Previous advisor">
      <span aria-hidden="true">&#8592;</span>
    </button>
    <div className={styles.pagination} aria-label="Choose advisor slide">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          type="button"
          className={index === activeIndex ? styles.activeDot : styles.dot}
          aria-label={`Show advisor ${index + 1}`}
          aria-current={index === activeIndex ? 'true' : undefined}
          onClick={() => moveTo(index)}
        />
      ))}
    </div>
    <button type="button" onClick={() => moveTo(activeIndex + 1)} aria-label="Next advisor">
      <span aria-hidden="true">&#8594;</span>
    </button>
  </div>
);
