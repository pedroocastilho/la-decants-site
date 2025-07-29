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

export function OrdersPage() {
  const { session } = useAppContext();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return;
      setLoading(true);

      // Busca os pedidos e os itens de cada pedido de uma só vez
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          order_items!inner(
            price,
            quantity,
            product_id
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

        console.log("Dados recebidos do Supabase:", data);

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
                  <div className="flex justify-between w-full pr-4">
                    <div>
                      <p className="font-semibold">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R$ {Number(order.total_amount).toFixed(2)}</p>
                      <Badge variant={order.status === 'approved' ? 'default' : 'secondary'}>{order.status}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-b-md space-y-2">
                    <h4 className="font-semibold">Itens do Pedido:</h4>
                    {/* Aqui exibiremos os detalhes dos itens. Por enquanto, uma mensagem. */}
                    <p className="text-sm text-gray-600">
                      {order.order_items.reduce((acc, item) => acc + item.quantity, 0)} item(s) neste pedido.
                    </p>
                    {/* No futuro, podemos fazer uma busca pelos nomes dos produtos para mostrar aqui */}
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