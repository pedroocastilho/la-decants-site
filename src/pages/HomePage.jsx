// src/pages/HomePage.jsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from '@/contexts/AppContext';
import { ProductGrid } from '@/features/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortAsc } from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel';

export function HomePage() {
  // A sua lógica de pegar os dados do contexto continua a mesma
  const {
    filteredProducts,
    favorites,
    toggleFavorite,
    addToCart,
    openProductModal,
    activeFiltersCount,
    sortBy,
    setSortBy,
    openFiltersWithContext,
    allProducts,
  } = useAppContext();

  return (
    
    <>
      {/* --- 2. BLOCO DE SEO  --- */}
      <Helmet>
        <title>La Decants | Decants de Perfumes Importados e Árabes</title>
        <meta 
          name="description" 
          content="Descubra e experimente fragrâncias de luxo com os decants da La Decants. Perfumes importados e árabes em frascos de 5ml, 10ml e mais. Compra segura e frete para todo o Brasil."
        />
      </Helmet>

      <HeroCarousel />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-sm text-gray-600 mb-3">
          <span>Início</span> <span className="mx-2">›</span> <span className="text-[#AB7D47]">DECANTS</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">DECANTS</h1>
          <div className="text-sm text-gray-600">
            {filteredProducts.length} produto(s) encontrado(s)
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            variant="outline" 
            className="border-gray-300 text-black hover:bg-gray-100" // Cor ajustada para um visual mais neutro
            onClick={() => openFiltersWithContext(allProducts)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-black text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300 text-black">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevância</SelectItem>
              <SelectItem value="price-low">Menor Preço</SelectItem>
              <SelectItem value="price-high">Maior Preço</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
              <SelectItem value="newest">Mais Recentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <ProductGrid
          products={filteredProducts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
          onOpenProductModal={openProductModal}
        />
      </main>
    </>
  );
}