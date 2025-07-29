import { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { ProductGrid } from '@/features/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortAsc } from 'lucide-react';

export function MasculinosPage() {
  const { 
    allProducts, 
    favorites,
    toggleFavorite,
    addToCart,
    openProductModal,
    searchTerm,
    // --- 1. Pegamos os estados e funções de filtro do contexto ---
    filters, 
    sortBy,
    setSortBy,
    setIsFilterOpen,
    activeFiltersCount,
    openFiltersWithContext
  } = useAppContext();

  const masculineProducts = useMemo(() => {
    // Primeiro, filtramos para ter apenas os produtos masculinos
    let baseProducts = allProducts.filter(product => 
      product.category === "Masculino" && product.type === "Importado"
    );

    // Depois, aplicamos todos os outros filtros (busca, marca, preço, etc.)
    let filtered = baseProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      // Adicione outros filtros se necessário (ex: tamanho)
      return matchesSearch && matchesBrand && matchesPrice;
    });

    // Ordenação
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price); break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        break;
    }
    return filtered;
  }, [allProducts, searchTerm, filters, sortBy]);

  return (
    <main className="container mx-auto px-4 py-6 flex-grow">
      <div className="text-sm text-gray-600 mb-3">
        <span>Início</span> <span className="mx-2">›</span> <span className="text-amber-800">MASCULINOS</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">PERFUMES MASCULINOS</h1>
        <div className="text-sm text-gray-600">
          {masculineProducts.length} produto(s) encontrado(s)
        </div>
      </div>
      
      {/* --- 2. ADICIONAMOS OS BOTÕES DE FILTRO E ORDENAÇÃO --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          variant="outline" 
          className="border-gray-200 text-black hover:bg-blue-50"
          onClick={() => openFiltersWithContext(masculineProducts)}
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
          <SelectTrigger className="w-full sm:w-48 border-gray-200 text-black">
            <SortAsc className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price-low">Menor Preço</SelectItem>
            <SelectItem value="price-high">Maior Preço</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductGrid
        products={masculineProducts}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
        onOpenProductModal={openProductModal}
      />
    </main>
  );
}