-- SQL Schema untuk SIAKAD Politeknik Transportasi SDP Palembang
-- Silakan salin dan jalankan script ini di SQL Editor dashboard Supabase Anda.

-- 1. Membuat tabel krs
CREATE TABLE IF NOT EXISTS public.krs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mahasiswa_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  tahun_ajaran TEXT NOT NULL,
  kelas_ids TEXT[] DEFAULT '{}', -- Menyimpan array ID kelas yang diambil
  status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Menunggu Persetujuan, Menunggu Persetujuan Ka. Prodi, Disetujui Ka. Prodi, Ditolak
  catatan_dosen TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS untuk tabel krs
ALTER TABLE public.krs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.krs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.krs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.krs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.krs FOR DELETE USING (true);

-- 2. Membuat tabel pembayaran_ukt
CREATE TABLE IF NOT EXISTS public.pembayaran_ukt (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mahasiswa_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  status_ukt TEXT NOT NULL DEFAULT 'Belum Lunas', -- Lunas, Belum Lunas
  keterangan TEXT, -- Keterangan kurang berapa/biaya apa yang kurang
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan RLS untuk tabel pembayaran_ukt
ALTER TABLE public.pembayaran_ukt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.pembayaran_ukt FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.pembayaran_ukt FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.pembayaran_ukt FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.pembayaran_ukt FOR DELETE USING (true);
