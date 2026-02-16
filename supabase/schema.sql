-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  total_xp integer default 0,
  rank text default 'ROOKIE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cases table (The Library of Cases)
create table cases (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  difficulty text check (difficulty in ('EASY', 'MEDIUM', 'HARD', 'EXPERT')),
  tech_stack text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_missions table (The Pivot History)
create table user_missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  case_data jsonb not null, -- Stores the full mission dump
  status text check (status in ('SUCCESS', 'FAILURE')),
  xp_earned integer default 0,
  feedback_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table profiles enable row level security;
alter table cases enable row level security;
alter table user_missions enable row level security;

-- Policies (Simplified for now)
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Cases are viewable by everyone." on cases for select using (true);

create policy "Users can view own missions." on user_missions for select using (auth.uid() = user_id);
create policy "Users can insert own missions." on user_missions for insert with check (auth.uid() = user_id);
