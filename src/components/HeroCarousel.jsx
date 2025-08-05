import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importe as suas imagens de banner
import banner1 from '@/assets/banner1.jpg'; // Altere para o nome do seu ficheiro
import banner2 from '@/assets/banner2.jpg'; // Altere para o nome do seu ficheiro
import banner3 from '@/assets/banner3.jpg'

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const banners = [banner1, banner2, banner3]; // Lista das suas imagens

  return (
    <section className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {banners.map((banner, index) => (
          <div className="relative flex-[0_0_100%]" key={index}>
            <div
              className="w-full h-[600px] md:h-[600px] bg-cover bg-center"
              style={{ backgroundImage: `url(${banner})` }}
              aria-label={`Banner ${index + 1}`}
            />
          </div>
        ))}
      </div>
      
      {/* Botão de Voltar */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/50 hover:bg-white/80"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </Button>
      
      {/* Botão de Avançar */}
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