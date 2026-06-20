import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

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

    const url = new URL(req.url);
    let type = url.searchParams.get('type') ?? url.searchParams.get('topic');
    let dataId = url.searchParams.get('data.id') ?? url.searchParams.get('id');

    // Mercado Pago can also post a JSON body
    if ((!type || !dataId) && req.method === 'POST') {
      try {
        const body = await req.json();
        type = type ?? body?.type ?? body?.topic;
        dataId = dataId ?? body?.data?.id ?? body?.id;
      } catch (_) { /* ignore */ }
    }

    console.log('MP webhook:', { type, dataId });

    if (type !== 'payment' || !dataId) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch payment from Mercado Pago
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payment = await paymentRes.json();

    if (!paymentRes.ok) {
      console.error('MP payment fetch error:', payment);
      return new Response(JSON.stringify({ error: 'failed to fetch payment' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (payment.status !== 'approved') {
      console.log('Payment not approved:', payment.status);
      return new Response(JSON.stringify({ ok: true, status: payment.status }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const externalRef: string = payment.external_reference ?? '';
    const [userId, courseId] = externalRef.split(':');
    if (!userId || !courseId) {
      console.error('Invalid external_reference:', externalRef);
      return new Response(JSON.stringify({ error: 'invalid external_reference' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await supabase
      .from('user_courses')
      .upsert(
        {
          user_id: userId,
          course_id: courseId,
          payment_session_id: String(payment.id),
          payment_provider: 'mercadopago',
        },
        { onConflict: 'user_id,course_id' },
      );

    if (error) {
      console.error('Upsert error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('webhook error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
