import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils' // Importamos o utilitário para classes condicionais
import { useAppContext } from '@/contexts/AppContext';

export function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }) {
    const { openNotifyModal } = useAppContext();
  
  // 1. Verificamos se o produto está esgotado
  const isSoldOut = product.stock === 0;

  return (
    // 2. Adicionamos uma classe de opacidade se o produto estiver esgotado
    <Card 
      className={cn(
        "relative group hover:shadow-lg transition-shadow h-full flex flex-col",
        isSoldOut ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {/* Badge de Destaque agora mostra "ESGOTADO" se for o caso */}
      <div className="absolute top-2 left-2 z-10">
        {isSoldOut ? (
          <Badge className="bg-red-700 text-white text-xs px-2 py-1">ESGOTADO</Badge>
        ) : (
          <Badge className={`${product.badgeColor} text-white text-xs px-2 py-1`}>
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Botão de Favorito */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 cursor-pointer"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`}
        />
      </button>

      {/* O CardHeader agora tem uma div interna para manter o layout flexível */}
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      </CardHeader>

      {/* O CardContent agora cresce para preencher o espaço, alinhando os botões no fundo */}
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">
          {product.name}
        </CardTitle>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-800">
            R${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            R${product.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="text-xs text-gray-600 mb-3">
          ou 5x de R${(product.price / 5).toFixed(2)} sem juros
        </div>

        
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button

          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isSoldOut) {
              openNotifyModal(product); // Se esgotado, abre o modal de notificação
            } else {
              onAddToCart(product); // Senão, adiciona ao carrinho
            }
          }}
          className="w-full bg-[#AB7D47] hover:bg-[#B8860B] text-white cursor-pointer"
          // O botão não fica mais desativado
        >
          {/* 3. O texto do botão agora é "Avise-me" se esgotado */}
          {isSoldOut ? "Avise-me" : "Comprar"}
        </Button>
      </CardFooter>
    </Card>
  )
}