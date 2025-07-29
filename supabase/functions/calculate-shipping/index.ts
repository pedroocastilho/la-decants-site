

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cepDestino } = await req.json()
    const ME_TOKEN = Deno.env.get('MELHOR_ENVIO_TOKEN')

    if (!ME_TOKEN) {
      throw new Error("Configuração do servidor incompleta.");
    }

    const body = {
      from: { postal_code: "83900000" }, // Lembre-se de usar o seu CEP de origem
      to: { postal_code: cepDestino },
      package: { height: 4, width: 12, length: 17, weight: 0.3 },
    }

    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ME_TOKEN}`,
        'User-Agent': 'La Decants (decantsperfumesss@gmail.com)'
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro do Melhor Envio:', errorData);
      throw new Error("Erro ao calcular o frete com o Melhor Envio.");
    }

    const data = await response.json();

    // --- INÍCIO DA ADIÇÃO: LÓGICA DE FILTRO ---
    // 1. Definimos as transportadoras que queremos mostrar.
    const allowedServices: { [key: string]: string[] } = {
      "Correios": ["PAC", "SEDEX"],
      "Jadlog": [".Package", ".Com"]
    };

    // 2. Filtramos a lista de resultados, mantendo apenas as opções 
    
    const filteredData = data.filter(option => {
      if (!option.company || !option.name) return false;
      
      const companyName = option.company.name;
      const serviceName = option.name;

      // Verifica se a companhia está na nossa lista E se o serviço dela também está
      return allowedServices[companyName]?.includes(serviceName);
    });
    // --- FIM DA ADIÇÃO ---


    // 3. Devolvemos apenas os dados já filtrados para o nosso site.
    return new Response(
      JSON.stringify(filteredData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Erro na função:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})