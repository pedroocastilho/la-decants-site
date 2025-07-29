import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet.jsx';
import { Trash2, Minus, Plus, ShoppingBag, Clock, ShieldCheck } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';

export function CartSidebar({ isOpen, onClose }) {
  const { cartItems, updateCartQuantity, removeFromCart } = useAppContext();

  // 1. A variável 'total' agora é o nosso 'subtotal'.
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 2. A lógica de frete grátis continua aqui para a mensagem.
  const freteGratisThreshold = 299.00;
  const missingForFreeShipping = freteGratisThreshold - subtotal;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full flex flex-col sm:max-w-md bg-white">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="w-5 h-5" />
            Carrinho de Compras
            {itemCount > 0 && (
              <Badge className="bg-[#AB7D47] text-white h-5">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
          {itemCount > 0 && (
             <SheetDescription>
              {itemCount} item(s) no seu carrinho
            </SheetDescription>
          )}
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">Seu carrinho está vazio</p>
            <Button onClick={onClose} className="w-full bg-[#AB7D47] hover:bg-[#B8860B] text-white mt-4 h-11">
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Lista de Itens (código inalterado) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <Link to={`/produto/${item.slug}`} onClick={onClose}>
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produto/${item.slug}`} onClick={onClose} className="hover:underline">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</h4>
                    </Link>
                    <p className="text-[#AB7D47] font-semibold mt-1">R${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md h-8">
                        <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-2 h-full" disabled={item.quantity <= 1}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <Button variant="ghost" size="sm" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-2 h-full">
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé do Carrinho (VERSÃO CORRIGIDA) */}
            <div className="border-t bg-gray-50 px-6 py-4 space-y-4">
              <div className="bg-[#F6F0E7] border border-[#F6F0E7] p-3 rounded-lg flex items-center gap-3 text-sm text-[#3b2712] font-medium">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <p>Use o cupom <strong>PRIMEIRACOMPRA</strong> e ganhe 5% de desconto!</p>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className='font-medium'>R${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className='font-medium'>A calcular</span>
                </div>
                {subtotal < freteGratisThreshold && (
                  <p className="text-xs text-right text-gray-500">
                    Faltam R${missingForFreeShipping.toFixed(2)} para frete grátis
                  </p>
                )}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-[#AB7D47]">
                    R${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Link to="/checkout" onClick={onClose} className="w-full block">
                  <Button className="w-full bg-[#AB7D47] hover:bg-[#B8860B] text-white h-11 text-base font-semibold">
                    Ir para o Checkout
                  </Button>
                </Link>
                <Button variant="outline" onClick={onClose} className="w-full h-11 text-base bg-white">
                  Continuar Comprando
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1 pt-2">
                <ShieldCheck className="w-3 h-3" /> Compra 100% segura
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}