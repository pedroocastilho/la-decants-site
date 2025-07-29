import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';

export function ProductGrid({
  products,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onOpenProductModal
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">Nenhum produto encontrado</p>
          <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {products.map((product) => (
        <Link key={product.id} to={`/produto/${product.slug}`}>
  <ProductCard
    product={product}
    isFavorite={favorites.has(product.id)}
    onToggleFavorite={onToggleFavorite}
    onAddToCart={onAddToCart}
    onOpenProductModal={() => {}} // Não precisamos mais do modal aqui
  />
</Link>
      ))}
    </div>
  );
}