create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.workers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  dni text not null unique,
  birth_code text not null,
  full_name text not null,
  is_master boolean not null default false,
  active boolean not null default true,
  contract_path text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.workers to authenticated;
grant all on public.workers to service_role;
alter table public.workers enable row level security;

create or replace function public.current_worker_id()
returns uuid language sql stable security definer set search_path = public
as $$ select id from public.workers where user_id = auth.uid() and active $$;

create policy "Worker reads self" on public.workers for select to authenticated using (user_id = auth.uid());
create policy "Admin reads all" on public.workers for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin inserts" on public.workers for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates" on public.workers for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes" on public.workers for delete to authenticated using (public.has_role(auth.uid(), 'admin') and not is_master);

create table public.signatures (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers(id) on delete cascade,
  doc_key text not null,
  doc_version text not null,
  choice text,
  signer_name text not null,
  signature_path text not null,
  content_hash text not null,
  user_agent text,
  signed_at timestamptz not null default now()
);
grant select, insert on public.signatures to authenticated;
grant all on public.signatures to service_role;
alter table public.signatures enable row level security;
create policy "Worker reads own signatures" on public.signatures for select to authenticated using (worker_id = public.current_worker_id());
create policy "Worker signs own" on public.signatures for insert to authenticated with check (worker_id = public.current_worker_id());
create policy "Admin reads signatures" on public.signatures for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.worker_files (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers(id) on delete cascade,
  kind text not null,
  path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.worker_files to authenticated;
grant all on public.worker_files to service_role;
alter table public.worker_files enable row level security;
create policy "Worker reads own files" on public.worker_files for select to authenticated using (worker_id = public.current_worker_id());
create policy "Worker adds own files" on public.worker_files for insert to authenticated with check (worker_id = public.current_worker_id());
create policy "Admin manages files" on public.worker_files for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  dni text not null,
  success boolean not null,
  created_at timestamptz not null default now()
);
grant all on public.login_attempts to service_role;
alter table public.login_attempts enable row level security;

insert into public.workers (dni, birth_code, full_name, is_master) values ('40366886T', '000000', 'Raúl (Master)', true);