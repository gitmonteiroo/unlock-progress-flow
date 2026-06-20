import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'MERCADOPAGO_ACCESS_TOKEN not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { courseId, userId, userEmail, courseName, coursePrice } = body ?? {};

    if (!courseId || !userId || !userEmail || !courseName || coursePrice == null) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: courseId, userId, userEmail, courseName, coursePrice' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const origin = req.headers.get('origin') ?? '';
    const projectRef = Deno.env.get('SUPABASE_URL')?.match(/https:\/\/([^.]+)\./)?.[1];
    const webhookUrl = `https://${projectRef}.supabase.co/functions/v1/mercadopago-webhook`;

    const preference = {
      items: [
        {
          id: courseId,
          title: courseName,
          quantity: 1,
          unit_price: Number(coursePrice),
          currency_id: 'BRL',
        },
      ],
      payer: { email: userEmail },
      back_urls: {
        success: `${origin}/dashboard?payment=success`,
        failure: `${origin}/checkout?payment=failure`,
        pending: `${origin}/checkout?payment=pending`,
      },
      auto_return: 'approved',
      notification_url: webhookUrl,
      external_reference: `${userId}:${courseId}`,
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await mpRes.json();
    if (!mpRes.ok) {
      console.error('Mercado Pago error:', data);
      return new Response(JSON.stringify({ error: data?.message ?? 'Mercado Pago error', details: data }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: data.init_point }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('create-checkout error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
