alter table public.portfolio_projects
  add column if not exists title_en text,
  add column if not exists title_fr text,
  add column if not exists title_it text,
  add column if not exists description_en text,
  add column if not exists description_fr text,
  add column if not exists description_it text,
  add column if not exists slug text unique,
  add column if not exists detail_title_en text,
  add column if not exists detail_title_fr text,
  add column if not exists detail_title_it text,
  add column if not exists detail_body_en text,
  add column if not exists detail_body_fr text,
  add column if not exists detail_body_it text;

create table if not exists public.portfolio_project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  image_url text not null,
  image_type text not null default 'desktop'
    check (image_type in ('desktop', 'phone')),
  alt_en text,
  alt_fr text,
  alt_it text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

alter table public.portfolio_project_images
  add column if not exists image_type text not null default 'desktop';

alter table public.portfolio_project_images enable row level security;

drop policy if exists "Published project images are public" on public.portfolio_project_images;
create policy "Published project images are public"
on public.portfolio_project_images
for select
using (
  exists (
    select 1
    from public.portfolio_projects
    where portfolio_projects.id = portfolio_project_images.project_id
      and portfolio_projects.is_published = true
  )
);

drop policy if exists "Admins can read every project image" on public.portfolio_project_images;
create policy "Admins can read every project image"
on public.portfolio_project_images
for select
using (public.is_portfolio_admin());

drop policy if exists "Admins can insert project images" on public.portfolio_project_images;
create policy "Admins can insert project images"
on public.portfolio_project_images
for insert
with check (public.is_portfolio_admin());

drop policy if exists "Admins can update project images" on public.portfolio_project_images;
create policy "Admins can update project images"
on public.portfolio_project_images
for update
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admins can delete project images" on public.portfolio_project_images;
create policy "Admins can delete project images"
on public.portfolio_project_images
for delete
using (public.is_portfolio_admin());

update public.portfolio_projects
set
  title_en = coalesce(title_en, title),
  description_en = coalesce(description_en, description)
where title_en is null
   or description_en is null;
