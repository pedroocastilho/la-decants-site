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
    const { userId, productId } = await req.json()
    if (!userId || !productId) {
      throw new Error("ID do utilizador ou do produto em falta.")
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Passo 1: Encontra todos os IDs de pedidos que pertencem ao utilizador e foram aprovados.
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'approved');

    if (ordersError) throw ordersError;

    // Se o utilizador não tem pedidos aprovados, ele não comprou o produto.
    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ hasPurchased: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Extrai apenas os IDs dos pedidos.
    const orderIds = orders.map(order => order.id);

    // Passo 2: Verifica na tabela 'order_items' se algum desses pedidos contém o produto específico.
    const { data: orderItem, error: itemError } = await supabaseAdmin
      .from('order_items')
      .select('product_id')
      .in('order_id', orderIds)        // O item tem de pertencer a um dos pedidos aprovados
      .eq('product_id', productId) // E tem de ser o produto que estamos a verificar
      .limit(1)
      .maybeSingle(); // Pega apenas um resultado, se existir

    if (itemError) throw itemError;

    // Se encontrou um item, 'orderItem' não será nulo.
    const hasPurchased = !!orderItem;

    return new Response(
      JSON.stringify({ hasPurchased }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função check-purchase:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})