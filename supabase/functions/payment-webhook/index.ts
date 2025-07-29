import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const notification = await req.json();
    console.log("Notificação recebida:", notification);

    if (notification.type === 'payment' && notification.data?.id) {
      const paymentId = notification.data.id;
      
      const MP_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
      if (!MP_ACCESS_TOKEN) throw new Error("Token do Mercado Pago não encontrado.");

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
      });
      
      if (!paymentResponse.ok) throw new Error("Não foi possível obter os detalhes do pagamento.");

      const paymentDetails = await paymentResponse.json();
      console.log("Detalhes do pagamento recebidos:", paymentDetails);

      if (paymentDetails.status === 'approved') {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // --- INÍCIO DA CORREÇÃO ---
        // 1. Extraímos os metadados DIRETAMENTE dos detalhes do pagamento.
        const metadata = paymentDetails.metadata;
        console.log("Metadados extraídos:", metadata);

        if (!metadata || !metadata.user_id) {
          throw new Error("user_id não encontrado nos metadados do pagamento.");
        }
        
        const userId = metadata.user_id;
        const shippingAddress = metadata.shipping_address;
        
        // 2. Calculamos o custo do frete a partir dos itens do pagamento
        const shippingItem = paymentDetails.additional_info.items.find(item => item.id === 'shipping');
        const shippingCost = shippingItem ? Number(shippingItem.unit_price) : 0;
        const shippingMethod = metadata.shipping_method;
        // --- FIM DA CORREÇÃO ---

        const { data: orderData, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: paymentDetails.transaction_amount,
            status: 'approved',
            shipping_address: shippingAddress,
            shipping_cost: shippingCost,
            shipping_method: shippingMethod,
          })
          .select()
          .single();
          
        if (orderError) throw orderError;
        
        console.log("Pedido inserido com sucesso:", orderData);
        
        const orderItems = paymentDetails.additional_info.items
          .filter(item => item.id !== 'shipping' && item.id !== 'discount')
          .map(item => ({
            order_id: orderData.id,
            product_id: Number(item.id),
            quantity: Number(item.quantity),
            price: Number(item.unit_price),
          }));
        
        if (orderItems.length > 0) {
            const { error: itemsError } = await supabaseAdmin
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            console.log("Itens do pedido inseridos com sucesso.");
        }
      }
    }
    
    return new Response(JSON.stringify({ status: "received" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Erro no webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})