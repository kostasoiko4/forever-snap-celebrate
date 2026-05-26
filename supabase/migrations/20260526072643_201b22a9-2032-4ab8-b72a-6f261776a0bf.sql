
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Allow public select on rsvps" on public.rsvps;
drop policy if exists "Public can view rsvps" on public.rsvps;
drop policy if exists "Anyone can view rsvps" on public.rsvps;

create policy "Admins can view rsvps"
on public.rsvps for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete rsvps"
on public.rsvps for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can upload wedding photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'wedding-photos' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update wedding photos"
on storage.objects for update
to authenticated
using (bucket_id = 'wedding-photos' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete wedding photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'wedding-photos' and public.has_role(auth.uid(), 'admin'));
