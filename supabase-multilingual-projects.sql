alter table public.portfolio_projects
  add column if not exists title_en text,
  add column if not exists title_fr text,
  add column if not exists title_it text,
  add column if not exists description_en text,
  add column if not exists description_fr text,
  add column if not exists description_it text;

update public.portfolio_projects
set
  title_en = coalesce(title_en, title),
  description_en = coalesce(description_en, description)
where title_en is null
   or description_en is null;
