export const dynamic = 'force-dynamic';

// Pinged daily by the Vercel cron in vercel.json. Exercises a real database
// query so the free-tier Supabase project is never auto-paused for inactivity.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, reason: 'missing configuration' }, { status: 500 });
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/keepalive`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
      cache: 'no-store',
    });
    const dbTime = await res.text();
    return Response.json({ ok: res.ok, status: res.status, dbTime });
  } catch (error) {
    return Response.json(
      { ok: false, reason: error instanceof Error ? error.message : 'fetch failed' },
      { status: 502 },
    );
  }
}
