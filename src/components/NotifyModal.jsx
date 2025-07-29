import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function NotifyModal({ product, isOpen, onClose }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    const { error } = await supabase
      .from('stock_notifications')
      .insert({
        product_id: product.id,
        user_email: email,
      });

    if (error) {
      toast.error("Ocorreu um erro. Tente novamente.");
      console.error("Erro ao guardar notificação:", error);
    } else {
      toast.success("Aviso registado! Iremos notificá-lo por email assim que o produto estiver disponível.");
      setEmail('');
      onClose(); // Fecha o modal após o sucesso
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avise-me quando chegar!</DialogTitle>
          <DialogDescription>
            Este produto está esgotado. Deixe o seu email abaixo e nós avisaremos assim que ele voltar ao stock.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="productName">Produto</Label>
            <Input id="productName" value={product?.name || ''} disabled />
          </div>
          <div>
            <Label htmlFor="email">Seu e-mail</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-[#AB7D47] hover:bg-[#B8860B]" disabled={loading}>
              {loading ? 'A Enviar...' : 'Quero Ser Avisado'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}