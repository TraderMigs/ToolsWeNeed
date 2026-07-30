-- Remove tables and functions from the abandoned Stripe/admin/export era.
-- All tables verified to contain 0 rows and no references from the live application.
-- Applied to production 2026-07-30.
drop table if exists public.export_downloads cascade;
drop table if exists public.export_data cascade;
drop table if exists public.export_sessions cascade;
drop table if exists public.admin_users cascade;
drop table if exists public.profiles cascade;
drop table if exists public.tickets cascade;
drop table if exists public.usage_metrics cascade;

drop function if exists public.cleanup_old_export_sessions() cascade;
drop function if exists public.increment_usage_count(uuid, text) cascade;
drop function if exists public.update_updated_at_column() cascade;
