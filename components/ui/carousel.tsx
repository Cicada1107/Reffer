'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({delay: 3000})])

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">
            <img src="/feature_1.jpg" alt="feature_1"/>
            <div className="absolute inset-6 flex items-center justify-center text-violet-400 text-xl text-center font-light">
                Running out of patience reaching out for referrals? We got your back.
            </div>
        </div>
        <div className="embla__slide">Slide 2</div>
        <div className="embla__slide">Slide 3</div>
      </div>
    </div>
  )
}
