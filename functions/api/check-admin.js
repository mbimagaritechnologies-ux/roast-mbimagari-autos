export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(()=>({}));

  // Password kutoka Cloudflare Environment Variable
  const ADMIN_PASS = env.ADMIN_PASS; // wewe utaweka hapa Cloudflare
  const ADMIN_TOKEN = env.ADMIN_TOKEN || 'mbi_secret_token_2026';

  if (!ADMIN_PASS) {
    return new Response(JSON.stringify({ok:false, error:'ENV not set'}), {status:500});
  }

  // Check kama ni token ya auto-login
  if (body.token && body.token === ADMIN_TOKEN) {
    return new Response(JSON.stringify({ok:true, token: ADMIN_TOKEN}), {headers:{'Content-Type':'application/json'}});
  }

  // Check password
  if (body.password && body.password === ADMIN_PASS) {
    return new Response(JSON.stringify({ok:true, token: ADMIN_TOKEN}), {headers:{'Content-Type':'application/json'}});
  }

  return new Response(JSON.stringify({ok:false}), {status:401, headers:{'Content-Type':'application/json'}});
}
