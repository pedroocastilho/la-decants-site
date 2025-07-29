import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function OrdersPage() {
  // 1. Pegamos também o 'allProducts' para podermos encontrar os detalhes (nome, imagem) dos produtos
  const { session, allProducts } = useAppContext(); 
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return;
      setLoading(true);

      // 2. Modificamos a busca para incluir também o endereço e o custo do frete
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          shipping_address,
          shipping_cost,
          order_items!inner(
            price,
            quantity,
            product_id
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Não foi possível carregar os seus pedidos.");
        console.error("Erro ao buscar pedidos:", error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [session]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  // 3. Função para traduzir o status do pedido
  const translateStatus = (status) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'failure':
        return 'Falhou';
      default:
        return status;
    }
  };

  // 4. Função para encontrar os detalhes de um produto pelo seu ID
  const getProductDetails = (productId) => {
    return allProducts.find(p => p.id === productId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <p className="text-gray-500">Acompanhe o seu histórico de compras.</p>
      </div>

      <div className="space-y-4">
        {loading && <p>A carregar o seu histórico de pedidos...</p>}
        
        {!loading && orders.length === 0 && (
          <div className="text-center py-12 border rounded-lg">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Você ainda não tem nenhum pedido.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
              <AccordionItem value={`item-${order.id}`} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4 text-left">
                    <div>
                      <p className="font-semibold text-lg">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">R$ {Number(order.total_amount).toFixed(2)}</p>
                      {/* 5. Usamos a função para traduzir o status e ajustamos as cores do Badge */}
                      <Badge className={order.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{translateStatus(order.status)}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-b-md space-y-4">
                    
                    {/* 6. Nova secção para mostrar os itens do pedido com detalhes */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Itens do Pedido:</h4>
                      {order.order_items.map(item => {
                        const product = getProductDetails(item.product_id);
                        if (!product) return null; // Segurança caso o produto tenha sido removido

                        return (
                          <div key={item.product_id} className="flex items-center gap-4">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md border" />
                            <div className="flex-grow">
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">{item.quantity} x R$ {Number(item.price).toFixed(2)}</p>
                            </div>
                            <p className="text-sm font-semibold">R$ {(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />
                    
                    {/* 7. Nova secção para mostrar o endereço de entrega */}
                    {order.shipping_address && (
                      <div>
                        <h4 className="font-semibold mb-2">Enviado para:</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shipping_address.fullName}</p>
                          <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                          <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.cep}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}