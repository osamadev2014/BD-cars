-- Enable realtime for internal_notifications
alter publication supabase_realtime add table public.internal_notifications;

-- Grant select permission so RLS applies for realtime subscriptions
grant select on public.internal_notifications to authenticated;
