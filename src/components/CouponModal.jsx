// src/components/CouponModal.jsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, X, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function CouponModal({ isOpen, onClose }) {
  const couponCode = 'PRIMEIRACOMPRA';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    toast.success('Cupom copiado para a área de transferência!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Tag className="w-5 h-5" />
            Um Presente Para Você!
          </DialogTitle>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-lg text-[#B8860B]">{couponCode}</p>
              <p className="text-sm text-gray-600">5% de desconto</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
          </div>
          <div>
            <p className="text-sm text-center">
              Primeira vez por aqui? Use o cupom e ganhe 5% OFF no seu primeiro pedido!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}