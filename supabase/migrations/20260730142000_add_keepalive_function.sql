-- Lightweight function pinged daily by the Vercel cron job (/api/keepalive) so
-- the free-tier project always shows database activity and is never auto-paused.
-- Applied to production 2026-07-30.
create or replace function public.keepalive()
returns timestamptz
language sql
security invoker
set search_path = ''
as $$
  select now();
$$;

revoke execute on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
