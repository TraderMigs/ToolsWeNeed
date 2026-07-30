-- tool_analytics is retained for future real trending data, but the live app
-- does not write to it yet. Close the unrestricted anonymous insert policy
-- until a bounded policy ships alongside the feature that uses it.
-- Applied to production 2026-07-30.
drop policy if exists "Anyone can insert analytics data" on public.tool_analytics;
revoke all on table public.tool_analytics from anon, authenticated;
