import React, { useState, useEffect } from 'react';
import { 
  INITIAL_TARUNA, 
  INITIAL_DOSEN, 
  INITIAL_MATAKULIAH, 
  INITIAL_KELAS, 
  INITIAL_KRS, 
  INITIAL_NILAI, 
  INITIAL_PRESENSI, 
  SETTINGS 
} from './mockData';
import Sidebar from './components/Sidebar';
import TarunaPortal from './components/TarunaPortal';
import DosenPortal from './components/DosenPortal';
import AdminPortal from './components/AdminPortal';
import KeuanganPortal from './components/KeuanganPortal';
import { Anchor, ShieldAlert, Sparkles, User, Users, DollarSign } from 'lucide-react';
import { supabase } from './lib/supabase';

const PRODI_MAP_TO_DB = {
  'D-III Nautika': 'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb',
  'D-III Permesinan Kapal': '39ae54ce-9e86-4b99-943e-53437403e32d',
  'D-III Manajemen Transportasi Perairan Daratan (MTPD)': '2df63354-d49e-4f31-88aa-513509e22954'
};

const PRODI_MAP_FROM_DB = {
  'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb': 'D-III Nautika',
  '39ae54ce-9e86-4b99-943e-53437403e32d': 'D-III Permesinan Kapal',
  '2df63354-d49e-4f31-88aa-513509e22954': 'D-III Manajemen Transportasi Perairan Daratan (MTPD)'
};


export default function App() {
  // 1. GLOBAL STATE (Simulasi Database)
  const [tarunaList, setTarunaList] = useState(INITIAL_TARUNA);
  const [dosenList, setDosenList] = useState(INITIAL_DOSEN);
  const [matakuliahList, setMatakuliahList] = useState(INITIAL_MATAKULIAH);
  const [kelasList, setKelasList] = useState(INITIAL_KELAS);
  const [krsList, setKrsList] = useState(INITIAL_KRS);
  const [nilaiList, setNilaiList] = useState(INITIAL_NILAI);
  const [presensiList, setPresensiList] = useState(INITIAL_PRESENSI);
  const [settings, setSettings] = useState(SETTINGS);

  // Unified database tables states
  const [rawUsersList, setRawUsersList] = useState([]);
  const [jadwalPembelajaranList, setJadwalPembelajaranList] = useState([]);

  // 2. CONTEXT STATE (User Login Simulasi)
  const [currentRole, setCurrentRole] = useState('taruna'); // 'taruna', 'dosen', 'admin', 'admin_prodi'
  const [activeTarunaNim, setActiveTarunaNim] = useState('23.3.0123'); // Default Aditya Wiratama
  const [activeDosenNidn, setActiveDosenNidn] = useState('04.1205.8801'); // Default Capt. Heri
  const [adminProdiDept, setAdminProdiDept] = useState('D-III Nautika'); // Active department for Admin Prodi
  
  const [activeMenu, setActiveMenu] = useState('krs');
  const [showIdentitySelector, setShowIdentitySelector] = useState(false);

  // Reset menu when switching role
  useEffect(() => {
    if (currentRole === 'taruna') {
      setActiveMenu('krs');
    } else {
      setActiveMenu('dashboard');
    }
  }, [currentRole]);

  // Fetch Mata Kuliah from Supabase helper
  const fetchMataKuliahFromSupabase = async () => {
    try {
      const { data: mkData } = await supabase.from('mata_kuliah').select('*');
      if (mkData) {
        const mappedMk = mkData.map(item => ({
          id: item.id,
          kode: item.kode,
          nama: item.nama,
          sks: item.sks || 2,
          sks_teori: item.sks_teori || 1,
          sks_praktek: item.sks_praktek || 1,
          semester: item.semester || 1,
          prodi: PRODI_MAP_FROM_DB[item.prodi_id] || 'D-III Permesinan Kapal'
        }));
        setMatakuliahList(mappedMk);
      }
    } catch (err) {
      console.error("Gagal melakukan fetch mata kuliah:", err);
    }
  };

  // Fetch Kelas from Supabase helper
  const fetchKelasFromSupabase = async () => {
    try {
      const { data: kelasData } = await supabase.from('kelas').select('*');
      if (kelasData) {
        setKelasList(kelasData);
      }
    } catch (err) {
      console.error("Gagal melakukan fetch kelas:", err);
    }
  };

  // Fetch Jadwal Pembelajaran from Supabase helper
  const fetchJadwalFromSupabase = async () => {
    try {
      const { data: jadwalData } = await supabase.from('jadwal_pembelajaran').select('*');
      if (jadwalData) {
        setJadwalPembelajaranList(jadwalData);
      }
    } catch (err) {
      console.error("Gagal melakukan fetch jadwal pembelajaran:", err);
    }
  };

  // Fetch Users from Supabase helper (unifying CAT, LMS, SIAKAD)
  const fetchUsersFromSupabase = async () => {
    try {
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) {
        setRawUsersList(usersData);

        const { data: kelasData } = await supabase.from('kelas').select('*');
        
        let uktRecords = [];
        try {
          const { data } = await supabase.from('pembayaran_ukt').select('*');
          if (data) uktRecords = data;
        } catch (e) {}

        // Map students
        const students = usersData.filter(u => u.role === 'mahasiswa');
        const mappedStudents = students.map(u => {
          const ukt = uktRecords.find(r => r.mahasiswa_id === u.id) || {};
          const kl = kelasData?.find(c => c.id === u.kelas_id) || {};
          const studentDosen = usersData.find(d => d.role === 'dosen' && d.id === u.dosen_utama_id);
          return {
            id: u.id,
            nim: u.nim_nip,
            nama: u.nama,
            prodi: PRODI_MAP_FROM_DB[u.prodi_id] || 'D-III Nautika',
            semester: kl.semester || 4,
            kelas: kl.nama || 'Nautika A',
            email: u.email || '',
            ipk: 3.5,
            ips_prev: u.nilai_semapta || 3.5,
            status_ukt: ukt.status_ukt || 'Belum Lunas',
            keterangan_pembayaran: ukt.keterangan || '',
            angkatan: u.created_at ? new Date(u.created_at).getFullYear().toString() : '2026',
            poin_ketarunaan: u.nilai_kondite || 100,
            riwayat_poin: [],
            dosen_wali_nidn: studentDosen ? studentDosen.nim_nip : ''
          };
        });
        setTarunaList(mappedStudents);

        // Map lecturers
        const lecturers = usersData.filter(u => u.role === 'dosen');
        const mappedLecturers = lecturers.map(u => ({
          id: u.id,
          nidn: u.nim_nip,
          nama: u.nama,
          email: u.email || '',
          prodi: PRODI_MAP_FROM_DB[u.prodi_id] || 'D-III Nautika',
          telepon: u.no_hp || '-',
          foto: u.avatar_url || null,
          status: u.is_active ? 'Dosen Tetap' : 'Dosen Tidak Aktif'
        }));
        setDosenList(mappedLecturers);
      }
    } catch (err) {
      console.error("Gagal melakukan fetch users:", err);
    }
  };

  // Fetch all data from Supabase on mount (tidak ada yang disimpan di lokal)
  const fetchAllDataFromSupabase = async () => {
    try {
      await fetchMataKuliahFromSupabase();
      await fetchKelasFromSupabase();
      await fetchJadwalFromSupabase();
      await fetchUsersFromSupabase();

      // 5. Fetch KRS & Inject Auto KRS for Paid Students
      try {
        const { data: krsData } = await supabase.from('krs').select('*');
        const { data: uData } = await supabase.from('users').select('*');
        const { data: uktData } = await supabase.from('pembayaran_ukt').select('*');
        const { data: jData } = await supabase.from('jadwal_pembelajaran').select('*');
        const { data: kelasData } = await supabase.from('kelas').select('*');

        let mappedKrs = [];
        if (krsData) {
          mappedKrs = krsData.map(k => {
            const student = uData?.find(u => u.id === k.mahasiswa_id);
            return {
              id: k.id,
              nim: student ? student.nim_nip : '',
              tahun_ajaran: k.tahun_ajaran,
              semester: k.semester,
              kelas_ids: k.kelas_ids || [],
              status: k.status,
              catatan_dosen: k.catatan_dosen || ''
            };
          });
        }

        if (uData) {
          const students = uData.filter(u => u.role === 'mahasiswa');
          students.forEach(student => {
            const ukt = uktData?.find(r => r.mahasiswa_id === student.id) || {};
            const isPaid = ukt.status_ukt === 'Lunas';
            if (isPaid) {
              const kl = kelasData?.find(c => c.id === student.kelas_id) || {};
              const matchingSchedules = jData?.filter(j => j.kelas_id === student.kelas_id) || [];
              const scheduleIds = matchingSchedules.map(j => j.id);

              const existingKrsIdx = mappedKrs.findIndex(k => k.nim === student.nim_nip);
              if (existingKrsIdx > -1) {
                mappedKrs[existingKrsIdx] = {
                  ...mappedKrs[existingKrsIdx],
                  kelas_ids: scheduleIds,
                  status: 'Disetujui Ka. Prodi'
                };
              } else {
                mappedKrs.push({
                  id: `KRS-${student.nim_nip}-auto`,
                  nim: student.nim_nip,
                  tahun_ajaran: settings.tahun_ajaran_aktif || '2026/2027 Ganjil',
                  semester: kl.semester || 4,
                  kelas_ids: scheduleIds,
                  status: 'Disetujui Ka. Prodi',
                  catatan_dosen: ''
                });
              }
            }
          });
        }
        setKrsList(mappedKrs);

        // 5.5. Fetch Presensi from Supabase
        if (uData && jData) {
          const { data: presensiData } = await supabase.from('presensi').select('status, pertemuan_id, mahasiswa_id');
          const { data: pertemuanData } = await supabase.from('pertemuan').select('id, kelas_kuliah_id');
          const { data: kelasKuliahData } = await supabase.from('kelas_kuliah').select('id, kelas_id, mata_kuliah_id');

          if (presensiData && pertemuanData && kelasKuliahData) {
            const aggregates = {};
            presensiData.forEach(p => {
              const student = uData.find(u => u.id === p.mahasiswa_id);
              if (!student) return;

              const pert = pertemuanData.find(pt => pt.id === p.pertemuan_id);
              if (!pert) return;

              const kk = kelasKuliahData.find(k => k.id === pert.kelas_kuliah_id);
              if (!kk) return;

              const schedule = jData.find(s => s.kelas_id === kk.kelas_id && s.mata_kuliah_id === kk.mata_kuliah_id);
              const scheduleId = schedule ? schedule.id : kk.id;

              const key = `${student.nim_nip}_${scheduleId}`;
              if (!aggregates[key]) {
                aggregates[key] = {
                  nim: student.nim_nip,
                  kelas_id: scheduleId,
                  total_pertemuan: 0,
                  hadir: 0,
                  sakit: 0,
                  izin: 0,
                  alfa: 0
                };
              }

              aggregates[key].total_pertemuan += 1;
              const statusLower = p.status?.toLowerCase();
              if (statusLower === 'hadir') {
                aggregates[key].hadir += 1;
              } else if (statusLower === 'sakit') {
                aggregates[key].sakit += 1;
              } else if (statusLower === 'izin') {
                aggregates[key].izin += 1;
              } else {
                aggregates[key].alfa += 1;
              }
            });
            setPresensiList(Object.values(aggregates));
          }
        }
      } catch (e) {
        console.warn("Could not sync KRS and attendance from Supabase:", e.message);
      }

      // 6. Fetch Grades from hasil_ujian
      try {
        const { data: examData } = await supabase.from('hasil_ujian').select('*');
        if (examData && examData.length > 0) {
          const { data: uData } = await supabase.from('users').select('*');
          const mappedGrades = examData.map(g => {
            const student = uData?.find(u => u.id === g.mahasiswa_id);
            return {
              id: g.id,
              nim: student ? student.nim_nip : '',
              matakuliah_kode: 'DSNC4033', 
              nama_mk: 'Sistem Navigasi Elektronik',
              sks: 3,
              semester: 4,
              tugas: g.nilai_tugas || 0,
              uts: g.nilai_uts || 0,
              uas: g.nilai_uas || 0,
              praktek: g.nilai_praktek || 0,
              nilai_akhir: g.nilai_final || 0,
              nilai_huruf: g.nilai_final >= 85 ? 'A' : g.nilai_final >= 78 ? 'B+' : g.nilai_final >= 70 ? 'B' : g.nilai_final >= 60 ? 'C+' : g.nilai_final >= 50 ? 'C' : g.nilai_final >= 40 ? 'D' : 'E'
            };
          });
          setNilaiList(mappedGrades);
        }
      } catch (e) {
        console.warn("Could not load grades from hasil_ujian:", e.message);
      }

    } catch (err) {
      console.error("Gagal melakukan fetch data dari Supabase:", err);
    }
  };

  useEffect(() => {
    fetchAllDataFromSupabase().catch(err => {
      console.error("Supabase initial load error:", err);
    });
  }, []);

  // Find active users
  const currentTarunaObj = tarunaList.find(t => t.nim === activeTarunaNim) || tarunaList[0];
  const currentDosenObj = dosenList.find(d => d.nidn === activeDosenNidn) || dosenList[0];
  
  const currentUser = currentRole === 'taruna' ? currentTarunaObj : 
                      currentRole === 'dosen' ? currentDosenObj : 
                      currentRole === 'admin_prodi' ? { nama: 'Admin Prodi', prodi: adminProdiDept } : null;

  // Compute class sessions list mapped from jadwal_pembelajaran table to match mock INITIAL_KELAS format for TarunaPortal and DosenPortal
  const classSessionsList = React.useMemo(() => {
    return jadwalPembelajaranList.map(j => {
      const mk = matakuliahList.find(m => m.id === j.mata_kuliah_id || m.kode === j.mata_kuliah_id);
      const dosen = rawUsersList.find(u => u.id === j.dosen_id || u.nim_nip === j.dosen_id);
      return {
        id: j.id,
        matakuliah_kode: mk ? mk.kode : (j.mata_kuliah_id || ''),
        dosen_nidn: dosen ? dosen.nim_nip : (j.dosen_id || ''),
        hari: j.hari,
        jam: `${j.jam_mulai?.substring(0, 5) || '08:00'} - ${j.jam_selesai?.substring(0, 5) || '10:00'}`,
        ruang: j.ruangan || 'R. Kelas',
        kuota: 30
      };
    });
  }, [jadwalPembelajaranList, matakuliahList, rawUsersList]);

  // Grade point mapping helper
  const getBobot = (letter) => {
    switch (letter) {
      case 'A': return 4.0;
      case 'B+': return 3.5;
      case 'B': return 3.0;
      case 'C+': return 2.5;
      case 'C': return 2.0;
      case 'D': return 1.0;
      default: return 0.0;
    }
  };

  // 3. DATABASE TRANSACTIONS (State Updaters)

  // 3. DATABASE TRANSACTIONS (State Updaters & Supabase Sync)

  // Save/Update KRS
  const handleSaveKrs = async (nim, selectedKelasIds, status) => {
    setKrsList(prevKrs => {
      const existingIdx = prevKrs.findIndex(k => k.nim === nim && k.tahun_ajaran === settings.tahun_ajaran_aktif);
      if (existingIdx > -1) {
        const updated = [...prevKrs];
        updated[existingIdx] = {
          ...updated[existingIdx],
          kelas_ids: selectedKelasIds,
          status: status
        };
        return updated;
      } else {
        return [...prevKrs, {
          id: `KRS-${nim}-${Date.now()}`,
          nim,
          tahun_ajaran: settings.tahun_ajaran_aktif,
          semester: 4,
          kelas_ids: selectedKelasIds,
          status: status,
          catatan_dosen: ''
        }];
      }
    });

    try {
      const student = tarunaList.find(t => t.nim === nim);
      if (student && student.id) {
        const { data: existingKrs } = await supabase
          .from('krs')
          .select('id')
          .eq('mahasiswa_id', student.id)
          .eq('tahun_ajaran', settings.tahun_ajaran_aktif)
          .limit(1);

        const record = {
          mahasiswa_id: student.id,
          tahun_ajaran: settings.tahun_ajaran_aktif,
          semester: student.semester || 4,
          kelas_ids: selectedKelasIds,
          status: status,
          updated_at: new Date().toISOString()
        };

        if (existingKrs && existingKrs.length > 0) {
          await supabase.from('krs').update(record).eq('id', existingKrs[0].id);
        } else {
          await supabase.from('krs').insert(record);
        }
      }
    } catch (err) {
      console.warn("Could not save KRS to Supabase:", err.message);
    }
  };

  // Approve / Reject KRS (Called by Dosen)
  const handleApproveKrs = async (krsId, status, catatan) => {
    setKrsList(prevKrs => {
      const idx = prevKrs.findIndex(k => k.id === krsId);
      if (idx > -1) {
        const updated = [...prevKrs];
        const targetKrs = updated[idx];
        
        updated[idx] = {
          ...targetKrs,
          status,
          catatan_dosen: catatan
        };

        if (status === 'Disetujui Ka. Prodi') {
          initializeGradesAndAttendance(targetKrs.nim, targetKrs.kelas_ids);
        }

        return updated;
      }
      return prevKrs;
    });

    try {
      if (krsId.includes('-') && krsId.length > 10) {
        await supabase.from('krs').update({
          status,
          catatan_dosen: catatan,
          updated_at: new Date().toISOString()
        }).eq('id', krsId);
      } else {
        const targetKrs = krsList.find(k => k.id === krsId);
        if (targetKrs) {
          const student = tarunaList.find(t => t.nim === targetKrs.nim);
          if (student && student.id) {
            await supabase.from('krs').update({
              status,
              catatan_dosen: catatan,
              updated_at: new Date().toISOString()
            }).eq('mahasiswa_id', student.id).eq('tahun_ajaran', settings.tahun_ajaran_aktif);
          }
        }
      }
    } catch (err) {
      console.warn("Could not update KRS status in Supabase:", err.message);
    }
  };

  // Pre-populate grades and attendance when KRS is approved
  const initializeGradesAndAttendance = async (nim, classIds) => {
    setNilaiList(prevNilai => {
      const filtered = prevNilai.filter(n => !(n.nim === nim && n.semester === 4));
      const newGrades = classIds.map(kid => {
        const cl = kelasList.find(k => k.id === kid);
        const mk = matakuliahList.find(m => m.kode === cl?.matakuliah_kode);
        return {
          nim,
          matakuliah_kode: mk?.kode || '',
          nama_mk: mk?.nama || '',
          sks: mk?.sks || 2,
          semester: 4,
          tugas: 0,
          uts: 0,
          uas: 0,
          praktek: 0,
          nilai_akhir: 0,
          nilai_huruf: 'E'
        };
      });
      return [...filtered, ...newGrades];
    });

    try {
      const student = tarunaList.find(t => t.nim === nim);
      if (student && student.id) {
        for (const kid of classIds) {
          const cl = kelasList.find(k => k.id === kid);
          if (cl) {
            await supabase.from('hasil_ujian').insert({
              mahasiswa_id: student.id,
              jadwal_id: cl.id,
              status: 'in_progress',
              nilai_tugas: 0,
              nilai_praktek: 0,
              nilai_uts: 0,
              nilai_uas: 0,
              nilai_final: 0
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not initialize grades in Supabase:", err.message);
    }

    setPresensiList(prevPres => {
      const filtered = prevPres.filter(p => !(p.nim === nim && classIds.includes(p.kelas_id)));
      const newAttendance = classIds.map(kid => ({
        nim,
        kelas_id: kid,
        total_pertemuan: 16,
        hadir: 16,
        sakit: 0,
        izin: 0,
        alfa: 0
      }));
      return [...filtered, ...newAttendance];
    });

    try {
      const student = tarunaList.find(t => t.nim === nim);
      if (student && student.id) {
        for (const kid of classIds) {
          const { data: pertemuan } = await supabase.from('pertemuan').select('id').limit(1);
          const pertId = pertemuan && pertemuan.length > 0 ? pertemuan[0].id : null;
          if (pertId) {
            await supabase.from('presensi').insert({
              mahasiswa_id: student.id,
              pertemuan_id: pertId,
              status: 'Hadir',
              waktu_presensi: new Date().toISOString()
            });
          }
        }
      }
    } catch (err) {
      console.warn("Could not initialize attendance in Supabase:", err.message);
    }
  };

  // Save/Update grades entered by Lecturer
  const handleSaveGrades = async (gradeRecord) => {
    setNilaiList(prevNilai => {
      const idx = prevNilai.findIndex(n => n.nim === gradeRecord.nim && n.matakuliah_kode === gradeRecord.matakuliah_kode);
      let updated;
      if (idx > -1) {
        updated = [...prevNilai];
        updated[idx] = gradeRecord;
      } else {
        updated = [...prevNilai, gradeRecord];
      }
      
      setTimeout(() => recalculateGPA(gradeRecord.nim, updated), 0);
      return updated;
    });

    try {
      const student = tarunaList.find(t => t.nim === gradeRecord.nim);
      const cl = kelasList.find(k => k.matakuliah_kode === gradeRecord.matakuliah_kode);
      if (student && student.id && cl) {
        const { data: existingExam } = await supabase
          .from('hasil_ujian')
          .select('id')
          .eq('mahasiswa_id', student.id)
          .eq('jadwal_id', cl.id)
          .limit(1);

        const record = {
          nilai_tugas: gradeRecord.tugas,
          nilai_praktek: gradeRecord.praktek,
          nilai_uts: gradeRecord.uts,
          nilai_uas: gradeRecord.uas,
          nilai_final: gradeRecord.nilai_akhir,
          updated_at: new Date().toISOString()
        };

        if (existingExam && existingExam.length > 0) {
          await supabase.from('hasil_ujian').update(record).eq('id', existingExam[0].id);
        } else {
          await supabase.from('hasil_ujian').insert({
            ...record,
            mahasiswa_id: student.id,
            jadwal_id: cl.id,
            status: 'completed'
          });
        }
      }
    } catch (err) {
      console.warn("Could not save grades to Supabase:", err.message);
    }
  };

  // Dynamic GPA Calculation
  const recalculateGPA = (nim, currentGrades) => {
    const studentGrades = currentGrades.filter(n => n.nim === nim);
    if (studentGrades.length === 0) return;

    let totalWeight = 0;
    let totalSks = 0;

    studentGrades.forEach(g => {
      if (g.nilai_huruf) {
        totalWeight += getBobot(g.nilai_huruf) * g.sks;
        totalSks += g.sks;
      }
    });

    const newGPA = totalSks > 0 ? parseFloat((totalWeight / totalSks).toFixed(2)) : 0;
    
    setTarunaList(prevTarunas => {
      return prevTarunas.map(t => {
        if (t.nim === nim) {
          return { ...t, ipk: newGPA };
        }
        return t;
      });
    });
  };

  // Save attendance
  const handleSaveAttendance = async (nim, kelasId, attendanceRecord) => {
    setPresensiList(prevPres => {
      const idx = prevPres.findIndex(p => p.nim === nim && p.kelas_id === kelasId);
      if (idx > -1) {
        const updated = [...prevPres];
        updated[idx] = { ...attendanceRecord, nim, kelas_id: kelasId };
        return updated;
      }
      return [...prevPres, { ...attendanceRecord, nim, kelas_id: kelasId }];
    });

    try {
      const student = tarunaList.find(t => t.nim === nim);
      if (student && student.id) {
        const { data: pertemuan } = await supabase.from('pertemuan').select('id').limit(1);
        const pertId = pertemuan && pertemuan.length > 0 ? pertemuan[0].id : null;
        if (pertId) {
          await supabase.from('presensi').insert({
            mahasiswa_id: student.id,
            pertemuan_id: pertId,
            status: attendanceRecord.hadir > 12 ? 'Hadir' : 'Alfa',
            waktu_presensi: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn("Could not save attendance to Supabase:", err.message);
    }
  };

  // Pay / Confirm UKT tuition fee
  const handlePayUkt = async (nim, status = 'Lunas', keterangan = '') => {
    const targetNim = nim || activeTarunaNim;
    setTarunaList(prevTarunas => {
      return prevTarunas.map(t => {
        if (t.nim === targetNim) {
          return { 
            ...t, 
            status_ukt: status,
            keterangan_pembayaran: keterangan || (status === 'Lunas' ? 'Lunas (UKT Semester 4)' : '')
          };
        }
        return t;
      });
    });

    try {
      const student = tarunaList.find(t => t.nim === targetNim);
      if (student && student.id) {
        const { data: existingUkt } = await supabase
          .from('pembayaran_ukt')
          .select('id')
          .eq('mahasiswa_id', student.id)
          .eq('semester', student.semester || 4)
          .limit(1);

        const record = {
          mahasiswa_id: student.id,
          semester: student.semester || 4,
          status_ukt: status,
          keterangan: keterangan || (status === 'Lunas' ? 'Lunas (UKT Semester 4)' : ''),
          updated_at: new Date().toISOString()
        };

        if (existingUkt && existingUkt.length > 0) {
          await supabase.from('pembayaran_ukt').update(record).eq('id', existingUkt[0].id);
        } else {
          await supabase.from('pembayaran_ukt').insert(record);
        }
      }
    } catch (err) {
      console.warn("Could not save UKT payment to Supabase:", err.message);
    }
  };

  // Add Point Ketarunaan
  const handleAddPoin = (nim, pointRecord) => {
    setTarunaList(prevTarunas => {
      return prevTarunas.map(t => {
        if (t.nim === nim) {
          const currentPoint = t.poin_ketarunaan || 100;
          return {
            ...t,
            poin_ketarunaan: Math.max(0, Math.min(100, currentPoint + pointRecord.poin)),
            riwayat_poin: [pointRecord, ...t.riwayat_poin]
          };
        }
        return t;
      });
    });
  };

  // Admin Master Settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  // Admin CRUD Operations for Taruna
  // Admin CRUD Operations for Taruna (Compat wrappers)
  const handleAddTaruna = (taruna) => {
    handleAddUser({ ...taruna, role: 'mahasiswa' });
  };

  const handleEditTaruna = (taruna) => {
    handleEditUser({ ...taruna, role: 'mahasiswa' });
  };

  const handleDeleteTaruna = (nim) => {
    const student = tarunaList.find(t => t.nim === nim);
    if (student) {
      handleDeleteUser(student.id);
    }
  };

  // Admin CRUD for Dosen (Compat wrappers)
  const handleAddDosen = (dosen) => {
    handleAddUser({ ...dosen, nim_nip: dosen.nidn, role: 'dosen' });
  };

  const handleEditDosen = (dosen) => {
    handleEditUser({ ...dosen, nim_nip: dosen.nidn, role: 'dosen' });
  };

  const handleDeleteDosen = (nidn) => {
    const d = dosenList.find(x => x.nidn === nidn);
    if (d) {
      handleDeleteUser(d.id);
    }
  };

  // === Unified User CRUD (Supabase Sync) ===
  const handleAddUser = async (user) => {
    try {
      const { error } = await supabase.from('users').insert([{
        nim_nip: user.nim_nip,
        username: user.username || user.nim_nip,
        nama: user.nama,
        email: user.email || null,
        password: user.password || user.nim_nip,
        role: user.role,
        prodi_id: user.prodi_id || null,
        kelas_id: user.kelas_id || null,
        is_active: user.is_active !== undefined ? user.is_active : true,
        status: user.is_active === false ? 'inactive' : 'active'
      }]);
      if (error) throw error;
      alert("User berhasil ditambahkan!");
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan user: " + err.message);
    }
  };

  const handleEditUser = async (user) => {
    try {
      const { error } = await supabase.from('users').update({
        nim_nip: user.nim_nip,
        username: user.username || user.nim_nip,
        nama: user.nama,
        email: user.email || null,
        password: user.password,
        role: user.role,
        prodi_id: user.prodi_id || null,
        kelas_id: user.kelas_id || null,
        is_active: user.is_active,
        status: user.is_active === false ? 'inactive' : 'active'
      }).eq('id', user.id);
      if (error) throw error;
      alert("User berhasil diperbarui!");
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui user: " + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      alert("User berhasil dihapus!");
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus user: " + err.message);
    }
  };

  // === Kelas CRUD (Supabase Sync) ===
  const handleAddKelas = async (kelasObj) => {
    try {
      const { error } = await supabase.from('kelas').insert([{
        nama: kelasObj.nama,
        prodi_id: kelasObj.prodi_id,
        angkatan: parseInt(kelasObj.angkatan) || 36,
        semester: parseInt(kelasObj.semester) || 1
      }]);
      if (error) throw error;
      alert("Kelas berhasil ditambahkan!");
      await fetchKelasFromSupabase();
      await fetchUsersFromSupabase(); // Class changes could affect students' classes
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan kelas: " + err.message);
    }
  };

  const handleEditKelas = async (kelasObj) => {
    try {
      const { error } = await supabase.from('kelas').update({
        nama: kelasObj.nama,
        prodi_id: kelasObj.prodi_id,
        angkatan: parseInt(kelasObj.angkatan),
        semester: parseInt(kelasObj.semester)
      }).eq('id', kelasObj.id);
      if (error) throw error;
      alert("Kelas berhasil diperbarui!");
      await fetchKelasFromSupabase();
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui kelas: " + err.message);
    }
  };

  const handleDeleteKelas = async (id) => {
    try {
      const { error } = await supabase.from('kelas').delete().eq('id', id);
      if (error) throw error;
      alert("Kelas berhasil dihapus!");
      await fetchKelasFromSupabase();
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus kelas: " + err.message);
    }
  };

  // === Jadwal Pembelajaran CRUD (Supabase Sync) ===
  const handleAddJadwal = async (jadwalObj) => {
    try {
      const { error } = await supabase.from('jadwal_pembelajaran').insert([{
        kelas_id: jadwalObj.kelas_id,
        mata_kuliah_id: jadwalObj.mata_kuliah_id,
        dosen_id: jadwalObj.dosen_id,
        hari: jadwalObj.hari,
        jam_mulai: jadwalObj.jam_mulai,
        jam_selesai: jadwalObj.jam_selesai,
        ruangan: jadwalObj.ruangan
      }]);
      if (error) throw error;
      alert("Jadwal pembelajaran berhasil ditambahkan!");
      await fetchJadwalFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan jadwal: " + err.message);
    }
  };

  const handleEditJadwal = async (jadwalObj) => {
    try {
      const { error } = await supabase.from('jadwal_pembelajaran').update({
        kelas_id: jadwalObj.kelas_id,
        mata_kuliah_id: jadwalObj.mata_kuliah_id,
        dosen_id: jadwalObj.dosen_id,
        hari: jadwalObj.hari,
        jam_mulai: jadwalObj.jam_mulai,
        jam_selesai: jadwalObj.jam_selesai,
        ruangan: jadwalObj.ruangan
      }).eq('id', jadwalObj.id);
      if (error) throw error;
      alert("Jadwal pembelajaran berhasil diperbarui!");
      await fetchJadwalFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui jadwal: " + err.message);
    }
  };

  const handleDeleteJadwal = async (id) => {
    try {
      const { error } = await supabase.from('jadwal_pembelajaran').delete().eq('id', id);
      if (error) throw error;
      alert("Jadwal pembelajaran berhasil dihapus!");
      await fetchJadwalFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus jadwal: " + err.message);
    }
  };

  // === Dosen Pembimbing Akademik / Wali Assignment (Supabase Sync) ===
  const handleAssignBimbingan = async (studentId, dosenId) => {
    try {
      const { error } = await supabase.from('users').update({
        dosen_utama_id: dosenId
      }).eq('id', studentId);
      if (error) throw error;
      alert("Mahasiswa bimbingan berhasil ditambahkan!");
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal menugaskan mahasiswa bimbingan: " + err.message);
    }
  };

  const handleRemoveBimbingan = async (studentId) => {
    try {
      const { error } = await supabase.from('users').update({
        dosen_utama_id: null
      }).eq('id', studentId);
      if (error) throw error;
      alert("Mahasiswa bimbingan berhasil dilepas!");
      await fetchUsersFromSupabase();
    } catch (err) {
      console.error(err);
      alert("Gagal melepas mahasiswa bimbingan: " + err.message);
    }
  };

  // Admin CRUD for Matakuliah
  const handleAddMk = async (mk) => {
    try {
      const prodiId = PRODI_MAP_TO_DB[mk.prodi] || PRODI_MAP_TO_DB['D-III Permesinan Kapal'];
      const newMk = {
        kode: mk.kode,
        nama: mk.nama,
        sks: mk.sks,
        sks_teori: Math.ceil(mk.sks / 2),
        sks_praktek: Math.floor(mk.sks / 2),
        semester: mk.semester,
        prodi_id: prodiId
      };
      
      const { data, error } = await supabase
        .from('mata_kuliah')
        .insert([newMk])
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const inserted = data[0];
        setMatakuliahList(prev => [...prev, {
          id: inserted.id,
          kode: inserted.kode,
          nama: inserted.nama,
          sks: inserted.sks,
          sks_teori: inserted.sks_teori,
          sks_praktek: inserted.sks_praktek,
          semester: inserted.semester,
          prodi: PRODI_MAP_FROM_DB[inserted.prodi_id] || 'D-III Permesinan Kapal'
        }]);
        alert("Mata kuliah berhasil ditambahkan dan disinkronkan ke CAT & LMS!");
      }
    } catch (err) {
      console.error("Gagal menambahkan mata kuliah ke Supabase:", err);
      alert("Gagal menambahkan mata kuliah ke database: " + err.message);
    }
  };

  const handleEditMk = async (mk) => {
    try {
      const prodiId = PRODI_MAP_TO_DB[mk.prodi] || PRODI_MAP_TO_DB['D-III Permesinan Kapal'];
      const updatedMk = {
        kode: mk.kode,
        nama: mk.nama,
        sks: mk.sks,
        sks_teori: Math.ceil(mk.sks / 2),
        sks_praktek: Math.floor(mk.sks / 2),
        semester: mk.semester,
        prodi_id: prodiId
      };
      
      const query = mk.id 
        ? supabase.from('mata_kuliah').update(updatedMk).eq('id', mk.id)
        : supabase.from('mata_kuliah').update(updatedMk).eq('kode', mk.kode);
        
      const { error } = await query;
      if (error) throw error;
      
      setMatakuliahList(prev => prev.map(m => (m.id === mk.id || m.kode === mk.kode) ? { ...m, ...mk } : m));
      alert("Mata kuliah berhasil diperbarui di SIAKAD, CAT, & LMS!");
    } catch (err) {
      console.error("Gagal memperbarui mata kuliah di Supabase:", err);
      alert("Gagal memperbarui mata kuliah di database: " + err.message);
    }
  };

  const handleDeleteMk = async (kode) => {
    try {
      const { error } = await supabase
        .from('mata_kuliah')
        .delete()
        .eq('kode', kode);
        
      if (error) throw error;
      
      setMatakuliahList(prev => prev.filter(m => m.kode !== kode));
      alert("Mata kuliah berhasil dihapus dari SIAKAD, CAT, & LMS!");
    } catch (err) {
      console.error("Gagal menghapus mata kuliah dari Supabase:", err);
      alert("Gagal menghapus mata kuliah dari database: " + err.message);
    }
  };

  // Logout/Identity change handler
  const handleLogout = () => {
    setShowIdentitySelector(true);
  };

  const handleSelectIdentity = (role, id) => {
    setCurrentRole(role);
    if (role === 'taruna') {
      setActiveTarunaNim(id);
    } else if (role === 'dosen') {
      setActiveDosenNidn(id);
    }
    setShowIdentitySelector(false);
  };

  return (
    <div className="app-container">
      {/* Role Switcher Bar - Floating Header */}
      <header className="role-switcher-bar">
        <div className="logo-container">
          <Anchor className="logo-icon" />
          <span className="logo-text">SIAKAD POLTEKTRANS SDP PALEMBANG</span>
        </div>
        
        <div className="switcher-buttons">
          <button 
            className={`btn-switch taruna ${currentRole === 'taruna' ? 'active' : ''}`}
            onClick={() => handleSelectIdentity('taruna', activeTarunaNim)}
          >
            <User style={{ width: '13px', height: '13px' }} /> Portal Mahasiswa
          </button>
          <button 
            className={`btn-switch dosen ${currentRole === 'dosen' ? 'active' : ''}`}
            onClick={() => handleSelectIdentity('dosen', activeDosenNidn)}
          >
            <Users style={{ width: '13px', height: '13px' }} /> Dosen Portal
          </button>
          <button 
            className={`btn-switch admin ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentRole('admin')}
          >
            <ShieldAlert style={{ width: '13px', height: '13px' }} /> Admin (BAK)
          </button>
          <button 
            className={`btn-switch admin ${currentRole === 'admin_prodi' ? 'active' : ''}`}
            onClick={() => { setCurrentRole('admin_prodi'); setAdminProdiDept('D-III Nautika'); }}
          >
            <ShieldAlert style={{ width: '13px', height: '13px' }} /> Admin Prodi
          </button>
          <button 
            className={`btn-switch keuangan ${currentRole === 'keuangan' ? 'active' : ''}`}
            onClick={() => setCurrentRole('keuangan')}
          >
            <DollarSign style={{ width: '13px', height: '13px' }} /> Admin Keuangan
          </button>
          <button 
            className="btn-switch" 
            style={{ borderLeft: '1px solid var(--glass-border)', color: 'var(--accent)', marginLeft: '4px' }}
            onClick={() => setShowIdentitySelector(true)}
            title="Ganti Identitas Aktif"
          >
            <Sparkles style={{ width: '13px', height: '13px' }} /> Switch User
          </button>
        </div>
      </header>

      {/* Sidebar Layout */}
      <Sidebar 
        currentRole={currentRole}
        currentUser={currentUser}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="app-content">
        {currentRole === 'taruna' && (
          <TarunaPortal 
            currentUser={currentUser}
            activeMenu={activeMenu}
            matakuliahList={matakuliahList}
            kelasList={classSessionsList}
            krsList={krsList}
            nilaiList={nilaiList}
            presensiList={presensiList}
            dosenList={dosenList}
            settings={settings}
            onSaveKrs={handleSaveKrs}
            onPayUkt={handlePayUkt}
          />
        )}

        {currentRole === 'dosen' && (
          <DosenPortal 
            currentUser={currentUser}
            activeMenu={activeMenu}
            tarunaList={tarunaList}
            matakuliahList={matakuliahList}
            kelasList={classSessionsList}
            krsList={krsList}
            nilaiList={nilaiList}
            presensiList={presensiList}
            onApproveKrs={handleApproveKrs}
            onSaveGrades={handleSaveGrades}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {(currentRole === 'admin' || currentRole === 'admin_prodi') && (
          <AdminPortal 
            activeMenu={activeMenu}
            tarunaList={tarunaList}
            dosenList={dosenList}
            matakuliahList={matakuliahList}
            kelasList={kelasList}
            krsList={krsList}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onAddTaruna={handleAddTaruna}
            onEditTaruna={handleEditTaruna}
            onDeleteTaruna={handleDeleteTaruna}
            onAddDosen={handleAddDosen}
            onEditDosen={handleEditDosen}
            onDeleteDosen={handleDeleteDosen}
            onAddMk={handleAddMk}
            onEditMk={handleEditMk}
            onDeleteMk={handleDeleteMk}
            onAddPoin={handleAddPoin}
            onSyncMk={fetchMataKuliahFromSupabase}
            onApproveKrs={handleApproveKrs}
            currentRole={currentRole}
            adminProdiDept={adminProdiDept}
            
            rawUsersList={rawUsersList}
            jadwalPembelajaranList={jadwalPembelajaranList}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onAddKelas={handleAddKelas}
            onEditKelas={handleEditKelas}
            onDeleteKelas={handleDeleteKelas}
            onAddJadwal={handleAddJadwal}
            onEditJadwal={handleEditJadwal}
            onDeleteJadwal={handleDeleteJadwal}
            onAssignBimbingan={handleAssignBimbingan}
            onRemoveBimbingan={handleRemoveBimbingan}
          />
        )}

        {currentRole === 'keuangan' && (
          <KeuanganPortal 
            activeMenu={activeMenu}
            tarunaList={tarunaList}
            settings={settings}
            onConfirmUkt={handlePayUkt}
          />
        )}
      </main>

      {/* IDENTITY SELECTOR MODAL (Simulated Authentication Switcher) */}
      {showIdentitySelector && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>Simulasi Login: Pilih Pengguna</h3>
              <button onClick={() => setShowIdentitySelector(false)} className="btn-close">✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Untuk mempermudah pengujian alur kerja sistem informasi akademik, silakan pilih profil yang ingin disimulasikan sebagai pengguna aktif.
              </p>

              {/* Taruna Section */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', color: 'var(--primary-light)' }}>
                  <User style={{ width: '16px', height: '16px' }} /> Sebagai Mahasiswa
                </h4>
                <div className="user-select-grid">
                  {tarunaList.map(t => (
                    <div 
                      key={t.nim} 
                      className="user-select-card"
                      onClick={() => handleSelectIdentity('taruna', t.nim)}
                    >
                      <div className="user-select-avatar" style={{ background: 'var(--primary-light)' }}>
                        {t.nama[0]}
                      </div>
                      <div className="user-select-details">
                        <span className="user-select-name">{t.nama}</span>
                        <span className="user-select-sub">{t.nim} | {t.prodi}</span>
                        <span className="user-select-sub" style={{ color: t.status_ukt === 'Lunas' ? 'var(--success)' : 'var(--danger)' }}>
                          UKT: {t.status_ukt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosen Section */}
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', color: 'var(--secondary)' }}>
                  <Users style={{ width: '16px', height: '16px' }} /> Sebagai Dosen (Lecturer)
                </h4>
                <div className="user-select-grid">
                  {dosenList.map(d => (
                    <div 
                      key={d.nidn} 
                      className="user-select-card"
                      onClick={() => handleSelectIdentity('dosen', d.nidn)}
                    >
                      <div className="user-select-avatar" style={{ background: 'var(--secondary)' }}>
                        {d.nama.split(' ').filter(word => !word.includes('.') && !word.includes(','))[0]?.[0] || 'D'}
                      </div>
                      <div className="user-select-details">
                        <span className="user-select-name">{d.nama}</span>
                        <span className="user-select-sub">NIDN: {d.nidn}</span>
                        <span className="user-select-sub">{d.prodi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Prodi Section */}
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', color: 'var(--accent)' }}>
                  <ShieldAlert style={{ width: '16px', height: '16px' }} /> Sebagai Admin Prodi
                </h4>
                <div className="user-select-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                  <div 
                    className="user-select-card"
                    onClick={() => {
                      setCurrentRole('admin_prodi');
                      setAdminProdiDept('D-III Nautika');
                      setShowIdentitySelector(false);
                    }}
                  >
                    <div className="user-select-avatar" style={{ background: 'var(--accent)' }}>N</div>
                    <div className="user-select-details">
                      <span className="user-select-name">Admin Prodi Nautika</span>
                      <span className="user-select-sub">D-III Nautika</span>
                    </div>
                  </div>
                  <div 
                    className="user-select-card"
                    onClick={() => {
                      setCurrentRole('admin_prodi');
                      setAdminProdiDept('D-III Permesinan Kapal');
                      setShowIdentitySelector(false);
                    }}
                  >
                    <div className="user-select-avatar" style={{ background: 'var(--accent)' }}>P</div>
                    <div className="user-select-details">
                      <span className="user-select-name">Admin Prodi Permesinan</span>
                      <span className="user-select-sub">D-III Permesinan Kapal</span>
                    </div>
                  </div>
                  <div 
                    className="user-select-card"
                    onClick={() => {
                      setCurrentRole('admin_prodi');
                      setAdminProdiDept('D-III Manajemen Transportasi Perairan Daratan (MTPD)');
                      setShowIdentitySelector(false);
                    }}
                  >
                    <div className="user-select-avatar" style={{ background: 'var(--accent)' }}>M</div>
                    <div className="user-select-details">
                      <span className="user-select-name">Admin Prodi MTPD</span>
                      <span className="user-select-sub">D-III MTPD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Section */}
              <div style={{ marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                <div 
                  className="user-select-card" 
                  onClick={() => { setCurrentRole('admin'); setShowIdentitySelector(false); }}
                  style={{ flex: 1, borderStyle: 'dashed', justifyContent: 'center', gap: '10px', background: 'rgba(245, 158, 11, 0.05)' }}
                >
                  <ShieldAlert style={{ color: 'var(--accent)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <span className="user-select-name" style={{ color: 'var(--accent)' }}>Masuk sebagai Admin BAK</span>
                    <span className="user-select-sub" style={{ display: 'block' }}>Kelola data master & semester</span>
                  </div>
                </div>

                <div 
                  className="user-select-card" 
                  onClick={() => { setCurrentRole('keuangan'); setShowIdentitySelector(false); }}
                  style={{ flex: 1, borderStyle: 'dashed', justifyContent: 'center', gap: '10px', background: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <DollarSign style={{ color: 'var(--success)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <span className="user-select-name" style={{ color: 'var(--success)' }}>Masuk sebagai Admin Keuangan</span>
                    <span className="user-select-sub" style={{ display: 'block' }}>Kelola & Konfirmasi UKT</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowIdentitySelector(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
