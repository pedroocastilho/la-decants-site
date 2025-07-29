import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Agora também recebemos o cupão e o valor do desconto
    const { cartItems, shippingInfo, userId, address, appliedCoupon, discountAmount } = await req.json()

    if (!cartItems || !shippingInfo || !userId || !address) {
      throw new Error("Dados da compra incompletos.");
    }
    
    const MP_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!MP_ACCESS_TOKEN) {
      throw new Error("Credencial do Mercado Pago não configurada.")
    }

    const items = cartItems.map(item => ({
      id: item.id.toString(),
      title: item.name,
      quantity: item.quantity,
      unit_price: Number(item.price),
      currency_id: 'BRL',
    }));
    
    if (shippingInfo.price > 0) {
      items.push({
        id: "shipping",
        title: 'Frete',
        quantity: 1,
        unit_price: Number(shippingInfo.price),
        currency_id: 'BRL',
      });
    }
    
    // --- 2. ADICIONAMOS O DESCONTO COMO UM "ITEM" COM PREÇO NEGATIVO ---
    if (appliedCoupon && discountAmount > 0) {
      items.push({
        id: "discount",
        title: `Desconto (${appliedCoupon.code})`,
        quantity: 1,
        unit_price: -Number(discountAmount), // O preço é negativo
        currency_id: 'BRL',
      });
    }
    // --- FIM DA ADIÇÃO ---

    const preference = {
      items: items,
      metadata: {
        user_id: userId,
        shipping_address: address,
        // Guardamos também o ID do cupão para o webhook
        coupon_id: appliedCoupon ? appliedCoupon.id : null, 
      },
      back_urls: {
        success: `https://la-decants-site.vercel.app/success`,
        failure: `https://la-decants-site.vercel.app/failure`,
        pending: `https://la-decants-site.vercel.app/pending`,
      },
      auto_return: "approved",
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro do Mercado Pago:', errorData);
      throw new Error("Erro ao criar a preferência de pagamento.");
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ preferenceId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
})