// Data Simulasi SIAKAD Politeknik Transportasi SDP Palembang

export const INITIAL_TARUNA = [
  {
    nim: "23.3.0123",
    nama: "Aditya Wiratama",
    email: "aditya.wira@poltektrans-sdp.ac.id",
    prodi: "D-III Nautika",
    semester: 4,
    kelas: "Nautika A",
    ipk: 3.82,
    ips_prev: 3.75,
    status_ukt: "Lunas",
    keterangan_pembayaran: "Lunas (UKT Semester 4)",
    angkatan: "2023",
    alamat: "Jl. Kolonel H. Barlian No. 115, Palembang",
    no_telp: "0812-3456-7890",
    poin_ketarunaan: 95,
    riwayat_poin: [
      { id: 1, tanggal: "2026-04-10", jenis: "prestasi", poin: 5, keterangan: "Juara 1 Lomba Dayung Kategori Taruna Nusantara" },
      { id: 2, tanggal: "2026-05-15", jenis: "pelanggaran", poin: -10, keterangan: "Terlambat apel malam di asrama" },
      { id: 3, tanggal: "2026-05-22", jenis: "prestasi", poin: 10, keterangan: "Petugas Komandan Resimen upacara Hari Kebangkitan Nasional" }
    ],
    dosen_wali_nidn: "04.1205.8801"
  },
  {
    nim: "23.3.0124",
    nama: "Rizky Ramadhan",
    email: "rizky.ramadhan@poltektrans-sdp.ac.id",
    prodi: "D-III Nautika",
    semester: 4,
    kelas: "Nautika A",
    ipk: 3.45,
    ips_prev: 3.50,
    status_ukt: "Lunas",
    keterangan_pembayaran: "Lunas (UKT Semester 4)",
    angkatan: "2023",
    alamat: "Jl. Veteran No. 45, Palembang",
    no_telp: "0821-9876-5432",
    poin_ketarunaan: 100,
    riwayat_poin: [
      { id: 1, tanggal: "2026-03-01", jenis: "prestasi", poin: 10, keterangan: "Kelakuan baik & disiplin asrama triwulan I" }
    ],
    dosen_wali_nidn: "04.1205.8801"
  },
  {
    nim: "23.3.0245",
    nama: "Fani Febrianti",
    email: "fani.febrianti@poltektrans-sdp.ac.id",
    prodi: "D-III Permesinan Kapal",
    semester: 4,
    kelas: "Teknika B",
    ipk: 3.65,
    ips_prev: 3.60,
    status_ukt: "Lunas",
    keterangan_pembayaran: "Lunas (UKT Semester 4)",
    angkatan: "2023",
    alamat: "Sako Kenten, Palembang",
    no_telp: "0813-8888-2233",
    poin_ketarunaan: 90,
    riwayat_poin: [
      { id: 1, tanggal: "2026-04-18", jenis: "pelanggaran", poin: -10, keterangan: "Peralatan bengkel kerja tidak dikembalikan ke tempatnya" }
    ],
    dosen_wali_nidn: "04.2810.7902"
  },
  {
    nim: "23.3.0312",
    nama: "Bambang Pamungkas",
    email: "bambang.p@poltektrans-sdp.ac.id",
    prodi: "D-III Manajemen Transportasi Perairan Daratan (MTPD)",
    semester: 4,
    kelas: "MTPD A",
    ipk: 3.12,
    ips_prev: 2.85,
    status_ukt: "Belum Lunas",
    keterangan_pembayaran: "Kurang Rp 1.500.000 untuk Uang Seragam",
    angkatan: "2023",
    alamat: "Kertapati, Palembang",
    no_telp: "0896-1111-5555",
    poin_ketarunaan: 85,
    riwayat_poin: [
      { id: 1, tanggal: "2026-05-02", jenis: "pelanggaran", poin: -15, keterangan: "Mangkir dari piket asrama hari Sabtu" }
    ],
    dosen_wali_nidn: "04.0503.8203"
  }
];

export const INITIAL_DOSEN = [
  {
    nidn: "04.1205.8801",
    nama: "Capt. Heri Purwanto, M.Mar",
    email: "heri.purwanto@poltektrans-sdp.ac.id",
    prodi: "D-III Nautika",
    telepon: "0812-7777-6666",
    status: "Dosen Tetap",
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  {
    nidn: "04.2810.7902",
    nama: "Ir. Bambang Triyono, M.T",
    email: "bambang.triyono@poltektrans-sdp.ac.id",
    prodi: "D-III Permesinan Kapal",
    telepon: "0813-4444-5555",
    status: "Dosen Tetap",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    nidn: "04.0503.8203",
    nama: "Dr. Sri Wahyuni, S.E., M.M",
    email: "sri.wahyuni@poltektrans-sdp.ac.id",
    prodi: "D-III Manajemen Transportasi Perairan Daratan (MTPD)",
    telepon: "0852-3333-2222",
    status: "Dosen Tetap",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_MATAKULIAH = [
  {
    "kode": "DPKC2062",
    "nama": "Mesin Penggerak Utama I",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC2092",
    "nama": "Elektronika",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC2083",
    "nama": "Sistem Kelistrikan Kapal I",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKB2032",
    "nama": "Mekanika Terapan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC2103",
    "nama": "Konstruksi dan Stabilitas Kapal",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC2072",
    "nama": "Konstruksi dan Prinsip Kerja Permesinan Bantu I",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC2051",
    "nama": "Dinas Jaga Mesin, Keselamatan Kerja dan Bertenaga",
    "sks": 1,
    "sks_teori": 0,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC2042",
    "nama": "Bahasa Inggris Maritim II",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKA2022",
    "nama": "Pancasila",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKA4031",
    "nama": "Pendidikan Anti Korupsi",
    "sks": 1,
    "sks_teori": 1,
    "sks_praktek": 0,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKB4091",
    "nama": "Proposal Tugas Akhir",
    "sks": 1,
    "sks_teori": 0,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKA4042",
    "nama": "Kewirausahaan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC4063",
    "nama": "Konstruksi dan Prinsip Kerja Permesinan Bantu III",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC4052",
    "nama": "Mesin Penggerak Utama III",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKA4012",
    "nama": "Psikologi Industri & Organisasi",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC4072",
    "nama": "Ilmu Bahan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKA4021",
    "nama": "Kepemimpinan dan Keterampilan Kerja Tim",
    "sks": 1,
    "sks_teori": 0,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKC4081",
    "nama": "Kepedulian Lingkungan Dan Pencegahan Polusi",
    "sks": 1,
    "sks_teori": 0,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DPKA2012",
    "nama": "Pendidikan Agama",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "DSNA1012",
    "nama": "Pendidikan Pancasila",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB1022",
    "nama": "Pengetahuan Pelabuhan Perairan Daratan",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB1032",
    "nama": "Matematika Terapan",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB1042",
    "nama": "Fisika Terapan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB1052",
    "nama": "Teknologi Informatika",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC1063",
    "nama": "Ilmu Pelayaran Datar 1",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC1073",
    "nama": "Bahasa Inggris Maritim 1",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC1082",
    "nama": "Kepedulian Lingkungan dan Pencegahan Polusi",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC1091",
    "nama": "Kecakapan Bahari",
    "sks": 1,
    "sks_teori": 0,
    "sks_praktek": 1,
    "semester": 1,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNA2012",
    "nama": "Pendidikan Kewarganegaraan",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNA2032",
    "nama": "Pendidikan Bahasa Indonesia",
    "sks": 2,
    "sks_teori": 0,
    "sks_praktek": 2,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNA2022",
    "nama": "Pendidikan Agama",
    "sks": 2,
    "sks_teori": 0,
    "sks_praktek": 2,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNA2042",
    "nama": "Psikologi Sosial dan Kepribadian",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB2052",
    "nama": "Teknologi Digital",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC2062",
    "nama": "Ilmu Pelayaran Astronomi",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC2072",
    "nama": "Ilmu Pelayaran Datar 2",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC2082",
    "nama": "Kompas dan Sistem Kemudi",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC2092",
    "nama": "P2TL dan Dinas Jaga 1",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC2102",
    "nama": "Bahasa Inggris Maritim 2",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC3012",
    "nama": "Ilmu Pelayaran Datar 3",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC3023",
    "nama": "Meteorologi",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC3032",
    "nama": "P2TL dan Dinas Jaga 2",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "P2TL DAN DINAS JAGA",
    "nama": "Olah Gerak Kapal dan Pengendalian Kapal",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC3052",
    "nama": "Penanganan dan Pengaturan Muatan 1",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC3062",
    "nama": "Konstruksi dan Stabilitas Kapal 1",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC3072",
    "nama": "Permesinan Kapal",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNA3083",
    "nama": "Metodologi Penelitian",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 3,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB4012",
    "nama": "Kewirausahaan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNB4022",
    "nama": "Manajemen Pelabuhan dan Perkapalan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4033",
    "nama": "Sistem Navigasi Elektronik",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4042",
    "nama": "Prosedur Darurat dan SAR",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4051",
    "nama": "Isyarat Visual",
    "sks": 1,
    "sks_teori": 1,
    "sks_praktek": 0,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4061",
    "nama": "Penanganan dan Pengaturan Muatan 2",
    "sks": 1,
    "sks_teori": 0,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4072",
    "nama": "Konstruksi dan Stabilitas Kapal 2",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNA4081",
    "nama": "Pendidikan Anti Korupsi",
    "sks": 1,
    "sks_teori": 1,
    "sks_praktek": 0,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4092",
    "nama": "Hukum Maritim",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSNC4102",
    "nama": "Kepemimpinan dan Keterampilan Kerja Tim",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND50110",
    "nama": "Praktik Fungsi Navigasi",
    "sks": 10,
    "sks_teori": 0,
    "sks_praktek": 10,
    "semester": 5,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND5025",
    "nama": "Praktik Fungsi Penanganan dan Pengaturan Muatan",
    "sks": 5,
    "sks_teori": 0,
    "sks_praktek": 5,
    "semester": 5,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND5035",
    "nama": "Praktik Fungsi Pengendalian Operasi Kapal dan Penanganan Personil di Kapal",
    "sks": 5,
    "sks_teori": 0,
    "sks_praktek": 5,
    "semester": 5,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND60110",
    "nama": "Praktik Fungsi Navigasi",
    "sks": 10,
    "sks_teori": 0,
    "sks_praktek": 10,
    "semester": 6,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND6025",
    "nama": "Praktik Fungsi Penanganan dan Pengaturan Muatan",
    "sks": 5,
    "sks_teori": 0,
    "sks_praktek": 5,
    "semester": 6,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND6035",
    "nama": "Praktik Fungsi Pengendalian Operasi Kapal dan Penanganan Personil di Kapal",
    "sks": 5,
    "sks_teori": 0,
    "sks_praktek": 5,
    "semester": 6,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DSND6043",
    "nama": "Tugas Akhir",
    "sks": 3,
    "sks_teori": 0,
    "sks_praktek": 3,
    "semester": 6,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "DTPB-2062",
    "nama": "Bahasa Inggris",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPA-2042",
    "nama": "Pendidikan Kewarganegaraan",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPB-2053",
    "nama": "Aplikasi Komputer",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPC-2032",
    "nama": "Pengetahuan Kesyahbandaran",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPC-2062",
    "nama": "Manajemen Logistik dan Rantai Pasok",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPC-2043",
    "nama": "Perencanaan Transportasi",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPC-2023",
    "nama": "Ilmu Bangunan Kapal",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DTPC-2053",
    "nama": "Teknik Pengukuran dan Pemetaan",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD KB-4303",
    "nama": "Tanda dan Rambu pelayaran SDP",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD KK-4201",
    "nama": "Perawatan Fasilitas Kapal",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD KB-4301",
    "nama": "Perencanaan Pelabuhan SDP",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD KB-4204",
    "nama": "Olah Gerak Kapal",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD PB-4201",
    "nama": "AMDAL SDP",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD KK-4202",
    "nama": "Perawatan dan Perbaikan Kapal (Preventive Maintenance )",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD PB-4203",
    "nama": "Manajemen Risiko",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD PB-4202",
    "nama": "Search And Rescue (SAR)",
    "sks": 2,
    "sks_teori": 1,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "MTPD KB-4302",
    "nama": "Perencanaan Transportasi SDP",
    "sks": 3,
    "sks_teori": 2,
    "sks_praktek": 1,
    "semester": 4,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "1",
    "nama": "COBA",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  },
  {
    "kode": "2",
    "nama": "COBA",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 2,
    "prodi": "D-III Nautika"
  },
  {
    "kode": "3",
    "nama": "COBA",
    "sks": 2,
    "sks_teori": 2,
    "sks_praktek": 0,
    "semester": 2,
    "prodi": "D-III Manajemen Transportasi Perairan Daratan (MTPD)"
  },
  {
    "kode": "DPKA2055",
    "nama": "Pendidikan Agama (Kristen)",
    "sks": 3,
    "sks_teori": 1,
    "sks_praktek": 2,
    "semester": 2,
    "prodi": "D-III Permesinan Kapal"
  }
];

export const INITIAL_KELAS = [
  // Kelas Nautika - Semester 4
  { id: "K-Naut-401", matakuliah_kode: "DSNC4033", dosen_nidn: "04.1205.8801", hari: "Senin", jam: "08:00 - 10:30", ruang: "R. Simulasi Navigasi", kuota: 30 },
  { id: "K-Naut-402", matakuliah_kode: "DSNC4042", dosen_nidn: "04.1205.8801", hari: "Selasa", jam: "10:00 - 12:30", ruang: "R. Nautika Utama", kuota: 30 },
  { id: "K-Naut-403", matakuliah_kode: "DSNC4051", dosen_nidn: "04.1205.8801", hari: "Rabu", jam: "08:00 - 09:40", ruang: "Aula Tridharma", kuota: 30 },
  { id: "K-Naut-404", matakuliah_kode: "DSNC4072", dosen_nidn: "04.1205.8801", hari: "Kamis", jam: "13:00 - 14:40", ruang: "Kolam Latih SAR", kuota: 30 },
  { id: "K-Naut-405", matakuliah_kode: "DSNC4092", dosen_nidn: "04.1205.8801", hari: "Senin", jam: "13:00 - 15:30", ruang: "R. Nautika Utama", kuota: 30 },
  { id: "K-Naut-406", matakuliah_kode: "DSNC4102", dosen_nidn: "04.1205.8801", hari: "Jumat", jam: "08:00 - 09:40", ruang: "R. Dek Latih", kuota: 30 },
  { id: "K-Naut-407", matakuliah_kode: "DSNA4081", dosen_nidn: "04.1205.8801", hari: "Kamis", jam: "08:00 - 09:40", ruang: "R. Isyarat Laut", kuota: 30 },

  // Kelas Permesinan Kapal - Semester 4
  { id: "K-Mach-401", matakuliah_kode: "DPKC4052", dosen_nidn: "04.2810.7902", hari: "Senin", jam: "08:00 - 10:30", ruang: "Bengkel Diesel", kuota: 30 },
  { id: "K-Mach-402", matakuliah_kode: "DPKC4063", dosen_nidn: "04.2810.7902", hari: "Selasa", jam: "10:00 - 12:30", ruang: "Lab Ketel Uap", kuota: 30 },
  { id: "K-Mach-403", matakuliah_kode: "DPKC4072", dosen_nidn: "04.2810.7902", hari: "Rabu", jam: "13:00 - 14:40", ruang: "R. Permesinan A", kuota: 30 },
  { id: "K-Mach-404", matakuliah_kode: "DPKA4012", dosen_nidn: "04.2810.7902", hari: "Kamis", jam: "08:00 - 10:30", ruang: "Lab Otomatisasi Kapal", kuota: 30 },
  { id: "K-Mach-405", matakuliah_kode: "DPKA4021", dosen_nidn: "04.2810.7902", hari: "Jumat", jam: "08:00 - 09:40", ruang: "R. Gambar Teknik", kuota: 30 },
  { id: "K-Mach-406", matakuliah_kode: "DPKB4091", dosen_nidn: "04.2810.7902", hari: "Rabu", jam: "08:00 - 10:30", ruang: "Lab Pompa & Pipa", kuota: 30 },
  { id: "K-Mach-407", matakuliah_kode: "DPKA4031", dosen_nidn: "04.2810.7902", hari: "Kamis", jam: "13:00 - 14:40", ruang: "R. Permesinan A", kuota: 30 },

  // Kelas MTPD - Semester 4
  { id: "K-Mtpd-401", matakuliah_kode: "MTPD KB-4302", dosen_nidn: "04.0503.8203", hari: "Senin", jam: "08:00 - 10:30", ruang: "R. Kelas MTPD-1", kuota: 30 },
  { id: "K-Mtpd-402", matakuliah_kode: "MTPD KB-4301", dosen_nidn: "04.0503.8203", hari: "Selasa", jam: "10:00 - 12:30", ruang: "R. Kelas MTPD-1", kuota: 30 },
  { id: "K-Mtpd-403", matakuliah_kode: "MTPD KK-4201", dosen_nidn: "04.0503.8203", hari: "Rabu", jam: "08:00 - 10:30", ruang: "Lab ASDP & Pelabuhan", kuota: 30 },
  { id: "K-Mtpd-404", matakuliah_kode: "MTPD KB-4204", dosen_nidn: "04.0503.8203", hari: "Kamis", jam: "08:00 - 09:40", ruang: "R. Kelas MTPD-2", kuota: 30 },
  { id: "K-Mtpd-405", matakuliah_kode: "MTPD PB-4201", dosen_nidn: "04.0503.8203", hari: "Jumat", jam: "09:50 - 11:30", ruang: "R. Kelas MTPD-2", kuota: 30 },
  { id: "K-Mtpd-406", matakuliah_kode: "MTPD PB-4202", dosen_nidn: "04.0503.8203", hari: "Rabu", jam: "13:00 - 15:30", ruang: "R. Kelas MTPD-1", kuota: 30 },
  { id: "K-Mtpd-407", matakuliah_kode: "MTPD PB-4203", dosen_nidn: "04.0503.8203", hari: "Kamis", jam: "13:00 - 14:40", ruang: "R. Kelas MTPD-2", kuota: 30 }
];

export const INITIAL_KRS = [
  {
    id: "KRS-23.3.0123-01",
    nim: "23.3.0123",
    tahun_ajaran: "2026/2027 Ganjil",
    semester: 4,
    kelas_ids: ["K-Naut-401", "K-Naut-402", "K-Naut-403", "K-Naut-405"],
    status: "Menunggu Persetujuan",
    catatan_dosen: "Tolong pastikan matakuliah Stabilitas Kapal & Navigasi Elektronik tidak tabrakan jadwal praktek."
  },
  {
    id: "KRS-23.3.0124-01",
    nim: "23.3.0124",
    tahun_ajaran: "2026/2027 Ganjil",
    semester: 4,
    kelas_ids: ["K-Naut-401", "K-Naut-402", "K-Naut-403", "K-Naut-404", "K-Naut-405", "K-Naut-406", "K-Naut-407"],
    status: "Disetujui Ka. Prodi",
    catatan_dosen: "Sudah lengkap dan disetujui. Jaga disiplin!"
  },
  {
    id: "KRS-23.3.0245-01",
    nim: "23.3.0245",
    tahun_ajaran: "2026/2027 Ganjil",
    semester: 4,
    kelas_ids: ["K-Mach-401", "K-Mach-402", "K-Mach-403", "K-Mach-404", "K-Mach-405", "K-Mach-406", "K-Mach-407"],
    status: "Disetujui Ka. Prodi",
    catatan_dosen: "Tetap konsentrasi pada bengkel diesel dan kelistrikan."
  },
  {
    id: "KRS-23.3.0312-01",
    nim: "23.3.0312",
    tahun_ajaran: "2026/2027 Ganjil",
    semester: 4,
    kelas_ids: [],
    status: "Draft",
    catatan_dosen: ""
  }
];

export const INITIAL_NILAI = [
  // Aditya Wiratama (23.3.0123) - Semester Sebelumnya (Smt 3)
  { nim: "23.3.0123", matakuliah_kode: "DSNC3012", nama_mk: "Ilmu Pelayaran Datar 3", sks: 2, nilai_akhir: 85, nilai_huruf: "A", semester: 3 },
  { nim: "23.3.0123", matakuliah_kode: "DSNC3023", nama_mk: "Meteorologi", sks: 3, nilai_akhir: 88, nilai_huruf: "A", semester: 3 },
  { nim: "23.3.0123", matakuliah_kode: "DSNC3032", nama_mk: "P2TL dan Dinas Jaga 2", sks: 2, nilai_akhir: 76, nilai_huruf: "B+", semester: 3 },
  { nim: "23.3.0123", matakuliah_kode: "DSNC3052", nama_mk: "Penanganan dan Pengaturan Muatan 1", sks: 2, nilai_akhir: 82, nilai_huruf: "A", semester: 3 },
  { nim: "23.3.0123", matakuliah_kode: "DSNC3062", nama_mk: "Konstruksi dan Stabilitas Kapal 1", sks: 2, nilai_akhir: 90, nilai_huruf: "A", semester: 3 },

  // Rizky Ramadhan (23.3.0124) - Semester Sebelumnya (Smt 3)
  { nim: "23.3.0124", matakuliah_kode: "DSNC3012", nama_mk: "Ilmu Pelayaran Datar 3", sks: 2, nilai_akhir: 78, nilai_huruf: "B+", semester: 3 },
  { nim: "23.3.0124", matakuliah_kode: "DSNC3023", nama_mk: "Meteorologi", sks: 3, nilai_akhir: 82, nilai_huruf: "A", semester: 3 },
  { nim: "23.3.0124", matakuliah_kode: "DSNC3032", nama_mk: "P2TL dan Dinas Jaga 2", sks: 2, nilai_akhir: 70, nilai_huruf: "B", semester: 3 },
  { nim: "23.3.0124", matakuliah_kode: "DSNC3052", nama_mk: "Penanganan dan Pengaturan Muatan 1", sks: 2, nilai_akhir: 75, nilai_huruf: "B+", semester: 3 },
  { nim: "23.3.0124", matakuliah_kode: "DSNC3062", nama_mk: "Konstruksi dan Stabilitas Kapal 1", sks: 2, nilai_akhir: 84, nilai_huruf: "A", semester: 3 },

  // Fani Febrianti (23.3.0245) - Semester Sebelumnya (Smt 3)
  { nim: "23.3.0245", matakuliah_kode: "DPKC2062", nama_mk: "Mesin Penggerak Utama I", sks: 2, nilai_akhir: 86, nilai_huruf: "A", semester: 2 },
  { nim: "23.3.0245", matakuliah_kode: "DPKC2072", nama_mk: "Konstruksi dan Prinsip Kerja Permesinan Bantu I", sks: 2, nilai_akhir: 80, nilai_huruf: "A", semester: 2 },
  { nim: "23.3.0245", matakuliah_kode: "DPKC2092", nama_mk: "Elektronika", sks: 2, nilai_akhir: 90, nilai_huruf: "A", semester: 2 },
  { nim: "23.3.0245", matakuliah_kode: "DPKC2083", nama_mk: "Sistem Kelistrikan Kapal I", sks: 3, nilai_akhir: 74, nilai_huruf: "B+", semester: 2 },

  // Bambang Pamungkas (23.3.0312) - Semester Sebelumnya (Smt 3)
  { nim: "23.3.0312", matakuliah_kode: "DTPC-2032", nama_mk: "Pengetahuan Kesyahbandaran", sks: 2, nilai_akhir: 72, nilai_huruf: "B", semester: 2 },
  { nim: "23.3.0312", matakuliah_kode: "DTPC-2062", nama_mk: "Manajemen Logistik dan Rantai Pasok", sks: 2, nilai_akhir: 68, nilai_huruf: "C+", semester: 2 },
  { nim: "23.3.0312", matakuliah_kode: "DTPC-2043", nama_mk: "Perencanaan Transportasi", sks: 3, nilai_akhir: 75, nilai_huruf: "B+", semester: 2 }
];

export const INITIAL_PRESENSI = [
  // Presensi Kehadiran Kelas Semester 4 (untuk yang KRS-nya disetujui, e.g. Rizky & Fani)
  // Rizky (23.3.0124)
  { nim: "23.3.0124", kelas_id: "K-Naut-401", total_pertemuan: 16, hadir: 15, sakit: 1, izin: 0, alfa: 0 },
  { nim: "23.3.0124", kelas_id: "K-Naut-402", total_pertemuan: 16, hadir: 16, sakit: 0, izin: 0, alfa: 0 },
  { nim: "23.3.0124", kelas_id: "K-Naut-403", total_pertemuan: 16, hadir: 14, sakit: 0, izin: 2, alfa: 0 },
  { nim: "23.3.0124", kelas_id: "K-Naut-405", total_pertemuan: 16, hadir: 15, sakit: 0, izin: 0, alfa: 1 },

  // Fani (23.3.0245)
  { nim: "23.3.0245", kelas_id: "K-Mach-401", total_pertemuan: 16, hadir: 16, sakit: 0, izin: 0, alfa: 0 },
  { nim: "23.3.0245", kelas_id: "K-Mach-402", total_pertemuan: 16, hadir: 15, sakit: 0, izin: 1, alfa: 0 }
];

export const SETTINGS = {
  tahun_ajaran_aktif: "2026/2027 Ganjil",
  periode_krs_mulai: "2026-06-01",
  periode_krs_selesai: "2026-06-15",
  krs_open: true,
  tarif_ukt: 4500000,
  nama_aplikasi: "SIAKAD",
  sub_nama_aplikasi: "Sistem Informasi Akademik",
  nama_kampus: "Politeknik Transportasi SDP Palembang",
  alamat_kampus: "Jl. Residen Abdul Rozak, Palembang",
  telepon_kampus: "(0711) 712345",
  email_kampus: "info@poltektrans.ac.id",
  logo_url: "",
  watermark_url: ""
};
