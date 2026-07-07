-- Migration 002 — add patient_name to patient_visits + demo seed function
-- Run in Supabase SQL Editor after 001_initial_schema.sql

-- ─────────────────────────────────────────────────────────────────────────────
-- Schema tweak: individual visit records with patient name
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.patient_visits
  add column if not exists patient_name text;

-- ─────────────────────────────────────────────────────────────────────────────
-- seed_demo_data(p_org_id)
-- Call once after first sign-in:
--   SELECT seed_demo_data('<your-org-id>');
-- or use the API route /api/seed (wired separately).
-- Safe to call multiple times — checks for existing rows first.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.seed_demo_data(p_org_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  src_stock_id   uuid;
  src_visits_id  uuid;
begin
  -- Guard: skip if already seeded
  if exists (select 1 from public.stock_levels where org_id = p_org_id limit 1) then
    return 'already_seeded';
  end if;

  -- Create two data_source rows (one per data type)
  insert into public.data_sources (org_id, source_type, original_filename)
  values (p_org_id, 'stock', 'demo_stock_seed.xlsx')
  returning id into src_stock_id;

  insert into public.data_sources (org_id, source_type, original_filename)
  values (p_org_id, 'patient_visits', 'demo_visits_seed.xlsx')
  returning id into src_visits_id;

  -- ── STOCK LEVELS — two branches, pharmacy + ward supplies ──────────────────
  insert into public.stock_levels (org_id, source_id, item_name, quantity, branch, recorded_at) values
  -- Branch A: Main Pharmacy
  (p_org_id, src_stock_id, 'Amoxicillin 500mg (caps)',        480,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Paracetamol 500mg (tabs)',        1200, 'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Metformin 500mg (tabs)',          360,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Omeprazole 20mg (caps)',          240,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Ciprofloxacin 500mg (tabs)',      160,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'ORS Sachets',                     300,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'IV Normal Saline 500ml',          80,   'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Surgical Gloves (box/100)',       24,   'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Gauze Swabs (pkt/100)',           40,   'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Syringes 5ml',                   200,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Artemether/Lumefantrine (tabs)',  120,  'Main Pharmacy',  now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Ibuprofen 400mg (tabs)',          800,  'Main Pharmacy',  now() - interval '1 day'),
  -- Branch B: Eastleigh Clinic
  (p_org_id, src_stock_id, 'Amoxicillin 500mg (caps)',        220,  'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Paracetamol 500mg (tabs)',        600,  'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Metformin 500mg (tabs)',          180,  'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Omeprazole 20mg (caps)',          100,  'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'ORS Sachets',                     150,  'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'IV Normal Saline 500ml',          40,   'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Surgical Gloves (box/100)',       12,   'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Syringes 5ml',                   100,  'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Artemether/Lumefantrine (tabs)',  60,   'Eastleigh Clinic', now() - interval '1 day'),
  (p_org_id, src_stock_id, 'Zinc Sulphate 20mg (tabs)',       400,  'Eastleigh Clinic', now() - interval '1 day');

  -- ── PATIENT VISITS — Somali names, spread over last 30 days ───────────────
  insert into public.patient_visits (org_id, source_id, branch, visit_date, count, patient_name) values
  -- Main Pharmacy visits
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 0,  1, 'Faadumo Abdi'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 0,  1, 'Abdullahi Warsame'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 1,  1, 'Hodan Mohamed'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 1,  1, 'Omar Hassan'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 2,  1, 'Sahra Yusuf'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 2,  1, 'Ismail Farah'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 3,  1, 'Nasra Ali'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 3,  1, 'Mohamud Dahir'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 4,  1, 'Ikran Osman'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 4,  1, 'Qasim Jama'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 5,  1, 'Ladan Nur'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 5,  1, 'Shire Ahmed'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 6,  1, 'Amina Bare'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 6,  1, 'Duale Warsame'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 7,  1, 'Hibo Ibrahim'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 7,  1, 'Abdi Hersi'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 8,  1, 'Cawo Salad'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 8,  1, 'Nimo Hassan'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 9,  1, 'Yusuf Gure'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 9,  1, 'Deqa Muuse'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 10, 1, 'Sucdi Warsame'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 10, 1, 'Filsan Abdi'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 11, 1, 'Maryam Shire'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 12, 1, 'Sagal Omar'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 13, 1, 'Rahma Duale'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 14, 1, 'Halima Jama'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 15, 1, 'Ahmed Farah'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 16, 1, 'Khadra Ismail'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 17, 1, 'Bashir Nur'),
  (p_org_id, src_visits_id, 'Main Pharmacy', current_date - 18, 1, 'Asad Mohamed'),
  -- Eastleigh Clinic visits
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 0,  1, 'Fowsia Osman'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 0,  1, 'Hassan Abshir'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 1,  1, 'Ifrah Warsame'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 1,  1, 'Mahad Ali'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 2,  1, 'Ruqiya Ahmed'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 2,  1, 'Salad Hassan'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 3,  1, 'Ubax Mohamud'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 3,  1, 'Awil Ibrahim'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 4,  1, 'Zahra Dahir'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 4,  1, 'Mustafa Qasim'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 5,  1, 'Asha Yusuf'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 5,  1, 'Idris Farah'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 6,  1, 'Naima Omar'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 6,  1, 'Sharif Shire'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 7,  1, 'Deeqa Jama'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 7,  1, 'Abdirahman Hersi'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 8,  1, 'Safia Warsame'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 8,  1, 'Guled Mohamed'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 9,  1, 'Hamdi Ali'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 9,  1, 'Nuur Hassan'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 10, 1, 'Layla Ahmed'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 11, 1, 'Cabdi Salad'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 12, 1, 'Timiro Abdi'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 13, 1, 'Farhaan Osman'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 14, 1, 'Bile Mohamud'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 15, 1, 'Warsan Farah'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 16, 1, 'Jibril Dahir'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 17, 1, 'Anab Ibrahim'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 18, 1, 'Yahye Qasim'),
  (p_org_id, src_visits_id, 'Eastleigh Clinic', current_date - 19, 1, 'Shukri Nur');

  return 'seeded';
end;
$$;

-- Grant execute to authenticated users (they pass their own org_id, RLS still protects the tables)
grant execute on function public.seed_demo_data(uuid) to authenticated;
