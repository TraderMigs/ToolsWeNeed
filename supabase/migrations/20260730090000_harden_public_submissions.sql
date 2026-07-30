-- Restrict the two intentionally public submission tables to bounded anonymous inserts.
alter table public.tool_requests enable row level security;
alter table public.tool_feedback enable row level security;

drop policy if exists "Anyone can insert tool requests" on public.tool_requests;
drop policy if exists "Authenticated users can read tool requests" on public.tool_requests;
drop policy if exists "Anyone can insert feedback" on public.tool_feedback;
drop policy if exists "Authenticated users can read feedback" on public.tool_feedback;

revoke all on table public.tool_requests from anon, authenticated;
revoke all on table public.tool_feedback from anon, authenticated;
grant insert on table public.tool_requests to anon;
grant insert on table public.tool_feedback to anon;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tool_requests_content_bounds' and conrelid = 'public.tool_requests'::regclass) then
    alter table public.tool_requests add constraint tool_requests_content_bounds check (
      char_length(btrim(title)) between 2 and 120
      and char_length(btrim(description)) between 5 and 3000
      and char_length(coalesce(reason, '')) <= 2000
      and char_length(coalesce(expensive_link, '')) <= 2048
      and char_length(coalesce(email, '')) <= 254
      and upvotes = 0
    );
  end if;

  if not exists (select 1 from pg_constraint where conname = 'tool_feedback_content_bounds' and conrelid = 'public.tool_feedback'::regclass) then
    alter table public.tool_feedback add constraint tool_feedback_content_bounds check (
      char_length(btrim(tool_id)) between 2 and 100
      and emoji_rating in ('angry', 'neutral', 'happy', 'amazing')
      and char_length(coalesce(comment_text, '')) <= 2000
      and coalesce(user_ip, '') = ''
      and coalesce(user_email, '') = ''
    );
  end if;
end $$;

create policy "Anonymous users can submit bounded tool requests"
  on public.tool_requests for insert to anon
  with check (
    char_length(btrim(title)) between 2 and 120
    and char_length(btrim(description)) between 5 and 3000
    and upvotes = 0
  );

create policy "Anonymous users can submit bounded feedback"
  on public.tool_feedback for insert to anon
  with check (
    emoji_rating in ('angry', 'neutral', 'happy', 'amazing')
    and coalesce(user_ip, '') = ''
    and coalesce(user_email, '') = ''
  );
