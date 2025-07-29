
import { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { ProductGrid } from '@/features/products/ProductGrid';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SortAsc } from 'lucide-react';

export function VictoriasSecretPage() {
  const { 
    allProducts, 
    favorites, // <-- A variável estava a ser obtida
    toggleFavorite,
    addToCart,
    openProductModal,
    searchTerm,
    filters, 
    sortBy,
    setSortBy,
    openFiltersWithContext,
    activeFiltersCount
  } = useAppContext();

  const vsProducts = useMemo(() => {
    let baseProducts = allProducts.filter(product => product.brand === "Victoria's Secret");

    let filtered = baseProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubCategory = !filters.subCategories || filters.subCategories.length === 0 || filters.subCategories.includes(product.subCategory);
      const matchesSize = !filters.sizes || filters.sizes.length === 0 || filters.sizes.includes(product.size); // <-- LINHA ADICIONADA
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return matchesSearch && matchesSubCategory && matchesSize && matchesPrice; // <-- matchesSize ADICIONADO AQUI
    });

    // Adicionamos a lógica de ordenação que estava em falta
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
        <Link to="/" className="hover:text-black">Início</Link>
        <span className="mx-2">›</span>
        <span className="text-[#AB7D47]">VICTORIA'S SECRET</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">VICTORIA'S SECRET</h1>
        <div className="text-sm text-gray-600">
          {vsProducts.length} produto(s) encontrado(s)
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          variant="outline" 
          className="border-gray-200 text-black hover:bg-blue-50"
          onClick={() => openFiltersWithContext(vsProducts)}
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
      
      {/* AQUI ESTÁ A CORREÇÃO: Passamos todas as props necessárias */}
      <ProductGrid
        products={vsProducts}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
        onOpenProductModal={openProductModal}
      />
    </main>
  );
}