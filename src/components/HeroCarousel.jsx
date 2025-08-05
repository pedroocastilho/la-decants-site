// src/components/HeroCarousel.jsx

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importe as suas imagens de banner
import banner1 from '@/assets/banner1.jpg';
import banner2 from '@/assets/banner2.jpg';
import banner3 from '@/assets/banner3.jpg';

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const banners = [banner1, banner2, banner3];

  return (
    <section className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {banners.map((banner, index) => (
          <div className="relative flex-[0_0_100%]" key={index}>
            {/* --- ESTA É A ALTERAÇÃO PRINCIPAL --- */}
            {/* 1. O contêiner agora tem uma altura fixa APENAS em ecrãs grandes (lg). */}
            <div className="lg:h-[600px] overflow-hidden">
              <img 
                src={banner} 
                alt={`Banner ${index + 1}`} 
                // 2. A imagem tem altura automática em telemóveis/tablets e preenche a altura fixa em computadores.
                className="w-full h-auto lg:h-full object-cover" 
              />
            </div>
            {/* --- FIM DA ALTERAÇÃO --- */}
          </div>
        ))}
      </div>
      
      {/* Botões de navegação (código inalterado) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/50 hover:bg-white/80"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/50 hover:bg-white/80"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </Button>
    </section>
  );
}