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
    const { couponCode, userId } = await req.json()

    if (!couponCode || !userId) {
      throw new Error("Código do cupão ou ID do utilizador em falta.")
    }

    // Usamos a chave de administrador para ter acesso total à base de dados
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Verifica se o cupão existe na tabela 'coupons'
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase()) // Converte para maiúsculas para não ser sensível a maiúsculas/minúsculas
      .single();

    if (couponError || !coupon) {
      throw new Error("Cupão inválido ou não encontrado.");
    }

    // 2. Verifica se o utilizador já usou este cupão na tabela 'user_coupon_usage'
    const { data: usage, error: usageError } = await supabaseAdmin
      .from('user_coupon_usage')
      .select('id')
      .eq('user_id', userId)
      .eq('coupon_id', coupon.id)
      .limit(1);

    if (usageError) throw usageError;
    
    if (usage && usage.length > 0) {
      throw new Error("Este cupão já foi utilizado.");
    }

    // 3. Se todas as verificações passarem, devolve os detalhes do cupão
    return new Response(
      JSON.stringify(coupon), // Devolve o cupão completo (com o valor do desconto, etc.)
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função validate-coupon:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})