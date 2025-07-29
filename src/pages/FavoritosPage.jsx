import { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { ProductGrid } from '@/features/products/ProductGrid';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function FavoritosPage() {
  const { 
    allProducts, 
    favorites,
    toggleFavorite,
    addToCart,
    openProductModal 
  } = useAppContext();

  // Filtra a lista de todos os produtos para pegar apenas os que estão no set de favoritos
  const favoriteProducts = useMemo(() => {
    return allProducts.filter(product => favorites.has(product.id));
  }, [allProducts, favorites]);

  return (
    <main className="container mx-auto px-4 py-6 flex-grow">
      <div className="text-sm text-gray-600 mb-3">
        <span>Início</span> <span className="mx-2">›</span> <span className="text-amber-800">Favoritos</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Meus Favoritos</h1>
        <div className="text-sm text-gray-600">
          {favoriteProducts.length} produto(s) encontrado(s)
        </div>
      </div>
      
      {favoriteProducts.length > 0 ? (
        <ProductGrid
          products={favoriteProducts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
          onOpenProductModal={openProductModal}
        />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">Sua lista de favoritos está vazia.</p>
            <p className="text-sm">Clique no coração dos produtos para adicioná-los aqui!</p>
          </div>
        </div>
      )}
    </main>
  );
}