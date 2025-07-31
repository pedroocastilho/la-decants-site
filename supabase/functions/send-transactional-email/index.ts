import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- NOVOS MODELOS DE EMAIL PROFISSIONAIS ---
const createEmailHtml = (title, content) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f0e7;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f0e7;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; max-width: 600px;">
          <tr>
            <td align="center" style="padding: 20px; border-bottom: 1px solid #eeeeee;">
              <img src="https://www.ladecants.com.br/la_decants_logo_optimized.png" alt="La Decants Logo" width="80" style="display: block;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="font-size: 24px; font-weight: bold; color: #333333; margin: 0 0 20px 0;">${title}</h1>
              ${content}
            </td>
          </tr>
          <tr style="background-color: #f8f8f8;">
            <td align="center" style="padding: 20px; font-size: 12px; color: #888888;">
              © ${new Date().getFullYear()} La Decants. Todos os direitos reservados.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const emailTemplates = {
  processing: {
    subject: "✅ O seu pedido está em preparação! | La Decants",
    getBody: (order) => {
      const customerName = order.shipping_address?.fullName || 'Cliente';
      const title = "O seu pedido está em preparação!";
      const content = `
        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 30px 0;">
          Olá, ${customerName}!<br><br>
          Recebemos o seu pedido #${order.id} e ele já está a ser preparado com muito carinho. Avisaremos novamente assim que ele for enviado.
        </p>
        <p style="font-size: 16px; color: #555555; line-height: 1.5;">Obrigado por comprar na La Decants!</p>
      `;
      return createEmailHtml(title, content);
    }
  },
  shipped: {
    subject: "🚚 O seu pedido foi enviado! | La Decants",
    getBody: (order) => {
      const customerName = order.shipping_address?.fullName || 'Cliente';
      const title = "O seu pedido foi enviado!";
      const content = `
        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 30px 0;">
          Olá, ${customerName}!<br><br>
          Ótima notícia! O seu pedido #${order.id} já está a caminho.
        </p>
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #555;">Transportadora:</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #333;">${order.shipping_method}</p>
        </div>
        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin-top: 30px;">
          Em breve, o código de rastreamento estará disponível na sua área "Meus Pedidos".
        </p>
      `;
      return createEmailHtml(title, content);
    }
  },
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record: order } = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error("Chave da API do Resend não encontrada.");
    }
    
    const template = emailTemplates[order.status];
    if (!template) {
      console.log(`Nenhum modelo de email para o status: ${order.status}`);
      return new Response("ok");
    }
    
    const customerEmail = order.customer_email;
    if (typeof customerEmail !== 'string' || !customerEmail) {
      throw new Error(`O email do cliente não é válido. Recebido: ${customerEmail}`);
    }

    const emailBody = {
      from: 'La Decants <onboarding@resend.dev>',
      to: customerEmail,
      subject: template.subject,
      html: template.getBody(order),
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar email:', errorData);
      throw new Error("Erro ao enviar o email de notificação.");
    }

    console.log(`Email para o pedido #${order.id} com status '${order.status}' enviado com sucesso.`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função de envio de email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})