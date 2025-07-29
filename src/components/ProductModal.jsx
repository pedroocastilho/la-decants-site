import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Star, Heart, Minus, Plus, ShoppingCart } from 'lucide-react'

export function ProductModal({ product, isOpen, onClose, onAddToCart, isFavorite, onToggleFavorite }) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    onClose()
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            Detalhes do produto
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem do Produto */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={`${product.badgeColor} text-white`}>
                {product.badge}
              </Badge>
            </div>

            {/* Botão de Favorito */}
            <button
              onClick={() => onToggleFavorite(product.id)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 ml-2">(4.8) - 127 avaliações</span>
              </div>
            </div>

            {/* Preços */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-800">
                  R${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  R${product.originalPrice.toFixed(2)}
                </span>
                <Badge className="bg-green-500 text-white">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>
              
              <p className="text-gray-600">
                5 x de R${(product.price / 5).toFixed(2)} sem juros
              </p>
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">
                Decant de alta qualidade do perfume {product.name}. 
                Ideal para quem quer experimentar a fragrância antes de comprar o frasco completo. 
                Embalagem de 10ml com borrifador de qualidade premium.
              </p>
            </div>

            {/* Características */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Características</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Volume: 10ml</li>
                <li>• Embalagem: Frasco com borrifador</li>
                <li>• Duração: 6-8 horas</li>
                <li>• Fixação: Excelente</li>
                <li>• Projeção: Moderada a forte</li>
              </ul>
            </div>

            {/* Quantidade e Compra */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">Quantidade:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementQuantity}
                    className="px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementQuantity}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-amber-800 hover:bg-amber-900 text-white py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 border-amber-800 text-amber-800 hover:bg-amber-50"
                >
                  Comprar Agora
                </Button>
              </div>
            </div>

            {/* Informações de Entrega */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-800">Informações de Entrega</h4>
              <p className="text-sm text-gray-600">📦 Frete grátis para compras acima de R$ 299,00</p>
              <p className="text-sm text-gray-600">🚚 Entrega em 3-7 dias úteis</p>
              <p className="text-sm text-gray-600">🎁 Embalagem especial inclusa</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

