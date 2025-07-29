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

    // Procura por um pedido aprovado do utilizador que contenha o produto
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('id, order_items(product_id)')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .eq('order_items.product_id', productId)
      .limit(1);

    if (error) throw error;

    // Se encontrou pelo menos um pedido, 'data' terá um item.
    const hasPurchased = data && data.length > 0;

    return new Response(
      JSON.stringify({ hasPurchased }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função check-purchase:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})