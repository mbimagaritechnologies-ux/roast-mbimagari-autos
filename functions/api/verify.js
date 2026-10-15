export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { reference } = await request.json();
    if (!reference) return new Response(JSON.stringify({error:'No ref'}), {status:400});
    const secret = env.PAYSTACK_SECRET_KEY;
    if (!secret) return new Response(JSON.stringify({error:'Missing secret'}), {status:500});
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await paystackRes.json();
    if (data.data && data.data.status === 'success') {
      return new Response(JSON.stringify({success:true, amount:data.data.amount}), {
        headers:{'Content-Type':'application/json'}
      });
    } else {
      return new Response(JSON.stringify({success:false, status:data.data?.status}), {
        status:400, headers:{'Content-Type':'application/json'}
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({error:e.message}), {status:500});
  }
}
