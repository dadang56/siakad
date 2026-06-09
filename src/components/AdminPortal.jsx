import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ShieldAlert, 
  Settings as SettingsIcon, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  Check, 
  UserCheck, 
  Key,
  DollarSign,
  RefreshCw,
  Building2,
  Search,
  Filter
} from 'lucide-react';

export default function AdminPortal({ 
  activeMenu, 
  tarunaList, 
  dosenList, 
  matakuliahList, 
  kelasList, 
  krsList, 
  settings, 
  onUpdateSettings,
  onAddTaruna,
  onEditTaruna,
  onDeleteTaruna,
  onAddDosen,
  onEditDosen,
  onDeleteDosen,
  onAddMk,
  onEditMk,
  onDeleteMk,
  onAddPoin,
  onSyncMk,
  onApproveKrs,
  currentRole = 'admin',
  adminProdiDept = null,
  nilaiList = [],
  rawUsersList = [],
  jadwalPembelajaranList = [],
  onAddUser,
  onEditUser,
  onDeleteUser,
  onAddKelas,
  onEditKelas,
  onDeleteKelas,
  onAddJadwal,
  onEditJadwal,
  onDeleteJadwal,
  onAssignBimbingan,
  onRemoveBimbingan,
  onPrintKhs
}) {
  
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

  // Group or filter data based on prodi for Admin Prodi
  const filteredTarunaList = currentRole === 'admin_prodi' && adminProdiDept
    ? tarunaList.filter(t => t.prodi === adminProdiDept)
    : tarunaList;

  const filteredDosenList = currentRole === 'admin_prodi' && adminProdiDept
    ? dosenList.filter(d => d.prodi === adminProdiDept)
    : dosenList;

  const filteredMatakuliahList = currentRole === 'admin_prodi' && adminProdiDept
    ? matakuliahList.filter(m => m.prodi === adminProdiDept)
    : matakuliahList;

  const renderedMatakuliahList = filteredMatakuliahList.filter(m => {
    const matchesSearch = !mkSearchQuery.trim() || 
      m.nama.toLowerCase().includes(mkSearchQuery.toLowerCase()) || 
      m.kode.toLowerCase().includes(mkSearchQuery.toLowerCase());
    const matchesSemester = mkSemesterFilter === 'all' || String(m.semester) === String(mkSemesterFilter);
    return matchesSearch && matchesSemester;
  });

  const filteredKrsList = currentRole === 'admin_prodi' && adminProdiDept
    ? krsList.filter(k => {
        const student = tarunaList.find(t => t.nim === k.nim);
        return student && student.prodi === adminProdiDept;
      })
    : krsList;

  const filteredUsersList = currentRole === 'admin_prodi' && adminProdiDept
    ? rawUsersList.filter(u => u.prodi_id === PRODI_MAP_TO_DB[adminProdiDept])
    : rawUsersList;

  const filteredKelasList = currentRole === 'admin_prodi' && adminProdiDept
    ? kelasList.filter(k => k.prodi_id === PRODI_MAP_TO_DB[adminProdiDept])
    : kelasList;

  const filteredJadwalList = currentRole === 'admin_prodi' && adminProdiDept
    ? jadwalPembelajaranList.filter(j => {
        const cl = kelasList.find(c => c.id === j.kelas_id);
        return cl && cl.prodi_id === PRODI_MAP_TO_DB[adminProdiDept];
      })
    : jadwalPembelajaranList;

  // Modals state
  const [showTarunaModal, setShowTarunaModal] = useState(false);
  const [showDosenModal, setShowDosenModal] = useState(false);
  const [showMkModal, setShowMkModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncMatkul = async () => {
    setIsSyncing(true);
    try {
      if (onSyncMk) {
        await onSyncMk();
      }
      alert("Sinkronisasi Berhasil! Seluruh data mata kuliah telah ditarik langsung dari Supabase CAT & LMS.");
    } catch (err) {
      alert("Gagal melakukan sinkronisasi: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'

  // Edit target states
  const [targetTaruna, setTargetTaruna] = useState({ nim: '', nama: '', prodi: 'D-III Nautika', semester: 1, kelas: '', email: '', ipk: 0, ips_prev: 0, status_ukt: 'Lunas', angkatan: '2026', dosen_wali_nidn: '' });
  const [targetDosen, setTargetDosen] = useState({ nidn: '', nama: '', prodi: 'D-III Nautika', email: '', telepon: '', status: 'Dosen Tetap' });
  const [targetMk, setTargetMk] = useState({ kode: '', nama: '', sks: 2, semester: 1, prodi: 'D-III Nautika' });

  // New Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showKelasModal, setShowKelasModal] = useState(false);
  const [showJadwalModal, setShowJadwalModal] = useState(false);

  // New Search & Filter states
  const [userSearch, setUserSearch] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('Semua Role');
  const [userFilterProdi, setUserFilterProdi] = useState('Semua Prodi');
  const [userFilterKelas, setUserFilterKelas] = useState('Semua Kelas');
  const [kelasSearch, setKelasSearch] = useState('');
  const [jadwalSearch, setJadwalSearch] = useState('');
  const [mkSearchQuery, setMkSearchQuery] = useState('');
  const [mkSemesterFilter, setMkSemesterFilter] = useState('all');

  // New Target states
  const [targetUser, setTargetUser] = useState({ id: null, nim_nip: '', username: '', nama: '', password: '', role: 'mahasiswa', prodi_id: 'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb', kelas_id: '', email: '', no_hp: '', is_active: true });
  const [targetKelas, setTargetKelas] = useState({ id: null, nama: '', prodi_id: 'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb', angkatan: 36, semester: 1 });
  const [targetJadwal, setTargetJadwal] = useState({ id: null, kelas_id: '', mata_kuliah_id: '', dosen_id: '', hari: 'Senin', jam_mulai: '08:00:00', jam_selesai: '10:00:00', ruangan: '' });
  
  const [activeDosenForBimbingan, setActiveDosenForBimbingan] = useState(null);
  const [bimbinganSearchQuery, setBimbinganSearchQuery] = useState('');
  const [selectedBimbinganStudentId, setSelectedBimbinganStudentId] = useState('');

  // Reset target forms
  const resetUserForm = () => setTargetUser({ id: null, nim_nip: '', username: '', nama: '', password: '', role: 'mahasiswa', prodi_id: currentRole === 'admin_prodi' ? PRODI_MAP_TO_DB[adminProdiDept] : 'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb', kelas_id: '', email: '', no_hp: '', is_active: true });
  const resetKelasForm = () => setTargetKelas({ id: null, nama: '', prodi_id: currentRole === 'admin_prodi' ? PRODI_MAP_TO_DB[adminProdiDept] : 'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb', angkatan: 36, semester: 1 });
  const resetJadwalForm = () => setTargetJadwal({ id: null, kelas_id: filteredKelasList[0]?.id || '', mata_kuliah_id: filteredMatakuliahList[0]?.id || '', dosen_id: rawUsersList.find(u => u.role === 'dosen')?.id || '', hari: 'Senin', jam_mulai: '08:00:00', jam_selesai: '10:00:00', ruangan: '' });

  // === User CRUD handlers ===
  const handleOpenAddUser = () => {
    setModalType('add');
    resetUserForm();
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user) => {
    setModalType('edit');
    setTargetUser({
      id: user.id,
      nim_nip: user.nim_nip,
      username: user.username || '',
      nama: user.nama,
      password: user.password || '',
      role: user.role,
      prodi_id: user.prodi_id || '',
      kelas_id: user.kelas_id || '',
      email: user.email || '',
      no_hp: user.no_hp || '',
      is_active: user.is_active !== false
    });
    setShowUserModal(true);
  };

  const handleSaveUserSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddUser(targetUser);
    } else {
      onEditUser(targetUser);
    }
    setShowUserModal(false);
  };

  // === Kelas CRUD handlers ===
  const handleOpenAddKelas = () => {
    setModalType('add');
    resetKelasForm();
    setShowKelasModal(true);
  };

  const handleOpenEditKelas = (kelasObj) => {
    setModalType('edit');
    setTargetKelas({
      id: kelasObj.id,
      nama: kelasObj.nama,
      prodi_id: kelasObj.prodi_id,
      angkatan: kelasObj.angkatan,
      semester: kelasObj.semester
    });
    setShowKelasModal(true);
  };

  const handleSaveKelasSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddKelas(targetKelas);
    } else {
      onEditKelas(targetKelas);
    }
    setShowKelasModal(false);
  };

  // === Jadwal CRUD handlers ===
  const handleOpenAddJadwal = () => {
    setModalType('add');
    resetJadwalForm();
    setShowJadwalModal(true);
  };

  const handleOpenEditJadwal = (jadwalObj) => {
    setModalType('edit');
    setTargetJadwal({
      id: jadwalObj.id,
      kelas_id: jadwalObj.kelas_id,
      mata_kuliah_id: jadwalObj.mata_kuliah_id,
      dosen_id: jadwalObj.dosen_id,
      hari: jadwalObj.hari,
      jam_mulai: jadwalObj.jam_mulai,
      jam_selesai: jadwalObj.jam_selesai,
      ruangan: jadwalObj.ruangan
    });
    setShowJadwalModal(true);
  };

  const handleSaveJadwalSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddJadwal(targetJadwal);
    } else {
      onEditJadwal(targetJadwal);
    }
    setShowJadwalModal(false);
  };

  // KHS Admin Menu States
  const [khsProdiId, setKhsProdiId] = useState(currentRole === 'admin_prodi' ? PRODI_MAP_TO_DB[adminProdiDept] : 'ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb');
  const [khsKelasId, setKhsKelasId] = useState('');
  const [khsSearchQuery, setKhsSearchQuery] = useState('');
  const [selectedKhsStudentId, setSelectedKhsStudentId] = useState('');

  // Settings State
  const [tempSettings, setTempSettings] = useState({ ...settings });

  React.useEffect(() => {
    setTempSettings({ ...settings });
  }, [settings]);

  // Reset target forms
  const resetTarunaForm = () => setTargetTaruna({ nim: '', nama: '', prodi: 'D-III Nautika', semester: 1, kelas: '', email: '', ipk: 0, ips_prev: 0, status_ukt: 'Lunas', angkatan: '2026', dosen_wali_nidn: dosenList[0]?.nidn || '' });
  const resetDosenForm = () => setTargetDosen({ nidn: '', nama: '', prodi: 'D-III Nautika', email: '', telepon: '', status: 'Dosen Tetap' });
  const resetMkForm = () => setTargetMk({ kode: '', nama: '', sks: 2, semester: 1, prodi: 'D-III Nautika' });

  // 1. Taruna CRUD
  const handleOpenAddTaruna = () => {
    setModalType('add');
    resetTarunaForm();
    setShowTarunaModal(true);
  };

  const handleOpenEditTaruna = (taruna) => {
    setModalType('edit');
    setTargetTaruna({ ...taruna });
    setShowTarunaModal(true);
  };

  const handleSaveTaruna = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddTaruna(targetTaruna);
    } else {
      onEditTaruna(targetTaruna);
    }
    setShowTarunaModal(false);
  };

  // 2. Dosen CRUD
  const handleOpenAddDosen = () => {
    setModalType('add');
    resetDosenForm();
    setShowDosenModal(true);
  };

  const handleOpenEditDosen = (dosen) => {
    setModalType('edit');
    setTargetDosen({ ...dosen });
    setShowDosenModal(true);
  };

  const handleSaveDosen = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddDosen(targetDosen);
    } else {
      onEditDosen(targetDosen);
    }
    setShowDosenModal(false);
  };

  // 3. Mata Kuliah CRUD
  const handleOpenAddMk = () => {
    setModalType('add');
    resetMkForm();
    setShowMkModal(true);
  };

  const handleOpenEditMk = (mk) => {
    setModalType('edit');
    setTargetMk({ ...mk });
    setShowMkModal(true);
  };

  const handleSaveMk = (e) => {
    e.preventDefault();
    if (modalType === 'add') {
      onAddMk(targetMk);
    } else {
      onEditMk(targetMk);
    }
    setShowMkModal(false);
  };


  // 5. Save settings
  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    alert("Konfigurasi akademik berhasil disimpan!");
  };

  return (
    <div>
      {/* 1. DASHBOARD ADMIN */}
      {activeMenu === 'dashboard' && (
        <div className="animate-fade-in">
          {/* Welcome Banner */}
          <div className="glass-card glow-gold" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(245, 158, 11, 0.15) 100%)' }}>
            <span className="badge badge-warning" style={{ marginBottom: '8px' }}>
              {currentRole === 'admin_prodi' ? `Portal Administrasi Prodi - ${adminProdiDept}` : 'Portal Administrasi Akademik (Adm. Akademik)'}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
              {currentRole === 'admin_prodi' ? `Panel Kendali Prodi - ${adminProdiDept}` : 'Panel Kendali Utama SIAKAD'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Politeknik Transportasi SDP Palembang | Semester: {settings.tahun_ajaran_aktif}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="metrics-grid">
            <div className="glass-card metric-card glow-blue">
              <div className="metric-icon-wrapper blue">
                <Users />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredTarunaList.length} Mahasiswa</span>
                <span className="metric-label">Jumlah Mahasiswa Aktif</span>
              </div>
            </div>

            <div className="glass-card metric-card glow-cyan">
              <div className="metric-icon-wrapper cyan">
                <GraduationCap />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredDosenList.length} Dosen</span>
                <span className="metric-label">Jumlah Dosen Terdaftar</span>
              </div>
            </div>

            <div className="glass-card metric-card glow-gold">
              <div className="metric-icon-wrapper gold">
                <BookOpen />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredMatakuliahList.length} MK</span>
                <span className="metric-label">Mata Kuliah Kurikulum</span>
              </div>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-icon-wrapper success">
                <Plus />
              </div>
              <div className="metric-content">
                <span className="metric-value">
                  {filteredKrsList.filter(k => k.status === 'Menunggu Persetujuan').length} KRS
                </span>
                <span className="metric-label">KRS Menunggu Approval</span>
              </div>
            </div>
          </div>

          <div className="dashboard-layout">
            {/* KRS Approval status list */}
            <div className="glass-card glow-blue">
              <div className="card-header-clean">
                <h3 className="card-title">Antrean Pengajuan KRS Mahasiswa</h3>
              </div>
              {filteredKrsList.filter(k => k.status === 'Menunggu Persetujuan').length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama Mahasiswa</th>
                        <th>Semester</th>
                        <th>Dosen Wali</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKrsList.filter(k => k.status === 'Menunggu Persetujuan').map((krs) => {
                        const student = filteredTarunaList.find(t => t.nim === krs.nim);
                        const walis = filteredDosenList.find(d => d.nidn === student?.dosen_wali_nidn);
                        return (
                          <tr key={krs.id}>
                            <td>{krs.nim}</td>
                            <td><strong>{student?.nama}</strong></td>
                            <td>Smt {krs.semester}</td>
                            <td>{walis?.nama}</td>
                            <td><span className="badge badge-warning">Waiting Dosen</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  Tidak ada antrean pengajuan KRS baru. Semua data bersih!
                </div>
              )}
            </div>

            {/* Quick config widget */}
            <div className="glass-card">
              <div className="card-header-clean">
                <h3 className="card-title"><SettingsIcon /> Pengaturan Cepat</h3>
              </div>
              <div className="status-list">
                <div className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-title">Masa KRS Online</span>
                    <span className="status-item-subtitle">{settings.krs_open ? 'Terbuka' : 'Ditutup'}</span>
                  </div>
                  <span className={`badge ${settings.krs_open ? 'badge-success' : 'badge-danger'}`}>
                    {settings.krs_open ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-title">Semester Aktif</span>
                    <span className="status-item-subtitle">{settings.tahun_ajaran_aktif}</span>
                  </div>
                </div>
                 <div className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-title">Tarif Mahasiswa</span>
                    <span className="status-item-subtitle">
                      {(() => {
                        if (settings.tarif_per_semester) {
                          const values = Object.values(settings.tarif_per_semester);
                          const min = Math.min(...values);
                          const max = Math.max(...values);
                          if (min === max) {
                            return `Rp ${min.toLocaleString('id-ID')}`;
                          }
                          return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
                        }
                        return `Rp ${settings.tarif_ukt?.toLocaleString('id-ID')}`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAJEMEN USER */}
      {activeMenu === 'users' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Manajemen User</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Kelola data pengguna sistem CAT, LMS, dan SIAKAD secara terpadu.' 
                  : `Melihat data pengguna sistem pada Program Studi ${adminProdiDept} (Monitoring Prodi).`}
              </p>
            </div>
            {currentRole === 'admin' && (
              <button onClick={handleOpenAddUser} className="btn btn-primary btn-sm">
                <Plus className="menu-icon" /> Tambah User Baru
              </button>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="metrics-grid" style={{ marginBottom: '24px' }}>
            <div className="glass-card metric-card glow-blue">
              <div className="metric-icon-wrapper blue">
                <Users />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredUsersList.length} User</span>
                <span className="metric-label">Total User Terdaftar</span>
              </div>
            </div>
            <div className="glass-card metric-card glow-cyan">
              <div className="metric-icon-wrapper cyan">
                <Users />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredUsersList.filter(u => u.role === 'mahasiswa').length} Mahasiswa</span>
                <span className="metric-label">Jumlah Mahasiswa</span>
              </div>
            </div>
            <div className="glass-card metric-card glow-gold">
              <div className="metric-icon-wrapper gold">
                <Users />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredUsersList.filter(u => u.role === 'dosen').length} Dosen</span>
                <span className="metric-label">Jumlah Dosen</span>
              </div>
            </div>
            <div className="glass-card metric-card">
              <div className="metric-icon-wrapper success">
                <Users />
              </div>
              <div className="metric-content">
                <span className="metric-value">{filteredUsersList.filter(u => u.is_active !== false).length} Aktif</span>
                <span className="metric-label">User Status Aktif</span>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Cari nama, email, atau NIM/NIP..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="form-control"
              style={{ flex: 2, minWidth: '200px' }}
            />
            <select 
              value={userFilterRole} 
              onChange={(e) => setUserFilterRole(e.target.value)}
              className="form-control"
              style={{ flex: 1, minWidth: '120px' }}
            >
              <option value="Semua Role">Semua Role</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin_prodi">Admin Prodi</option>
              <option value="superadmin">Superadmin</option>
              <option value="pengawas">Pengawas</option>
              <option value="pusbangkatar">Pusbangkatar</option>
            </select>
            
            {currentRole !== 'admin_prodi' ? (
              <select 
                value={userFilterProdi} 
                onChange={(e) => {
                  setUserFilterProdi(e.target.value);
                  setUserFilterKelas('Semua Kelas');
                }}
                className="form-control"
                style={{ flex: 1, minWidth: '150px' }}
              >
                <option value="Semua Prodi">Semua Prodi</option>
                <option value="D-III Nautika">D-III Nautika</option>
                <option value="D-III Permesinan Kapal">D-III Permesinan Kapal</option>
                <option value="D-III Manajemen Transportasi Perairan Daratan (MTPD)">D-III MTPD</option>
              </select>
            ) : null}

            <select 
              value={userFilterKelas} 
              onChange={(e) => setUserFilterKelas(e.target.value)}
              className="form-control"
              style={{ flex: 1, minWidth: '120px' }}
            >
              <option value="Semua Kelas">Semua Kelas</option>
              {filteredKelasList
                .filter(c => userFilterProdi === 'Semua Prodi' || c.prodi_id === PRODI_MAP_TO_DB[userFilterProdi])
                .map(c => (
                  <option key={c.id} value={c.id}>{c.nama}</option>
                ))}
            </select>
          </div>

          {/* User List Table */}
          <div className="glass-card glow-blue">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>NIM/NIP</th>
                    <th>Prodi / Kelas</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsersList.filter(u => {
                    const matchesSearch = userSearch === '' || 
                      u.nama?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.nim_nip?.toLowerCase().includes(userSearch.toLowerCase());
                      
                    const matchesRole = userFilterRole === 'Semua Role' || u.role === userFilterRole;
                    const matchesProdi = userFilterProdi === 'Semua Prodi' || u.prodi_id === PRODI_MAP_TO_DB[userFilterProdi];
                    const matchesKelas = userFilterKelas === 'Semua Kelas' || u.kelas_id === userFilterKelas;
                    
                    return matchesSearch && matchesRole && matchesProdi && matchesKelas;
                  }).map((user) => {
                    const userProdi = PRODI_MAP_FROM_DB[user.prodi_id] || '-';
                    const userKelas = kelasList.find(c => c.id === user.kelas_id)?.nama || '-';
                    const prodiKelasLabel = user.role === 'mahasiswa' 
                      ? `${userProdi} / ${userKelas}`
                      : userProdi;
                    
                    return (
                      <tr key={user.id}>
                        <td><strong>{user.nama}</strong><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email || '-'}</div></td>
                        <td>{user.username || user.nim_nip}</td>
                        <td>{user.nim_nip}</td>
                        <td>{prodiKelasLabel}</td>
                        <td>
                          <span className={`badge ${user.role === 'mahasiswa' ? 'badge-info' : user.role === 'dosen' ? 'badge-primary' : 'badge-warning'}`}>
                            {user.role?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.is_active !== false ? 'badge-success' : 'badge-danger'}`}>
                            {user.is_active !== false ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {currentRole === 'admin' ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button onClick={() => handleOpenEditUser(user)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                                <Edit style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => { if(confirm('Hapus user ini?')) onDeleteUser(user.id) }} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Trash style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          ) : (
                            <span className="badge badge-info">Monitoring</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2b. KELOLA KELAS */}
      {activeMenu === 'kelas' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Manajemen Kelas</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Melihat daftar kelas yang terdaftar (Adm. Akademik Monitoring).' 
                  : `Kelola data kelas untuk Program Studi ${adminProdiDept}.`}
              </p>
            </div>
            {currentRole !== 'admin' && (
              <button onClick={handleOpenAddKelas} className="btn btn-primary btn-sm">
                <Plus className="menu-icon" /> Tambah Kelas Baru
              </button>
            )}
          </div>

          <div className="glass-card glow-cyan">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Nama Kelas</th>
                    <th>Program Studi</th>
                    <th style={{ textAlign: 'center' }}>Angkatan</th>
                    <th style={{ textAlign: 'center' }}>Semester</th>
                    {currentRole !== 'admin' && <th style={{ textAlign: 'center' }}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredKelasList.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.nama}</strong></td>
                      <td>{PRODI_MAP_FROM_DB[c.prodi_id] || '-'}</td>
                      <td style={{ textAlign: 'center' }}>Angkatan {c.angkatan}</td>
                      <td style={{ textAlign: 'center' }}>Smt {c.semester}</td>
                      {currentRole !== 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleOpenEditKelas(c)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                              <Edit style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button onClick={() => { if(confirm('Hapus kelas ini?')) onDeleteKelas(c.id) }} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                              <Trash style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2c. JADWAL PEMBELAJARAN */}
      {activeMenu === 'jadwal-pembelajaran' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Jadwal Pembelajaran</h2>
              <p className="page-subtitle">Sinkronisasi jadwal kelas mingguan dengan database LMS.</p>
            </div>
            {currentRole !== 'admin' && (
              <button onClick={handleOpenAddJadwal} className="btn btn-primary btn-sm">
                <Plus className="menu-icon" /> Tambah Jadwal Baru
              </button>
            )}
          </div>

          <div className="glass-card glow-gold">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mata Kuliah</th>
                    <th>Kelas</th>
                    <th>Dosen Pengampu</th>
                    <th>Hari</th>
                    <th>Waktu Kuliah</th>
                    <th>Ruangan</th>
                    {currentRole !== 'admin' && <th style={{ textAlign: 'center' }}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredJadwalList.map((j) => {
                    const mk = matakuliahList.find(m => m.id === j.mata_kuliah_id || m.kode === j.mata_kuliah_kode);
                    const kl = kelasList.find(c => c.id === j.kelas_id);
                    const dosen = rawUsersList.find(u => u.id === j.dosen_id);
                    return (
                      <tr key={j.id}>
                        <td><strong>{mk?.nama || 'Unknown Matkul'}</strong><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mk?.kode}</div></td>
                        <td>{kl?.nama || 'Unknown Kelas'}</td>
                        <td>{dosen?.nama || 'Unknown Dosen'}</td>
                        <td><strong>{j.hari}</strong></td>
                        <td>{j.jam_mulai?.substring(0, 5)} - {j.jam_selesai?.substring(0, 5)}</td>
                        <td><span className="badge badge-info">{j.ruangan}</span></td>
                        {currentRole !== 'admin' && (
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button onClick={() => handleOpenEditJadwal(j)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                                <Edit style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => { if(confirm('Hapus jadwal ini?')) onDeleteJadwal(j.id) }} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Trash style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2d. DOSEN PEMBIMBING AKADEMIK */}
      {activeMenu === 'dosen-pembimbing' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Kelola Dosen Pembimbing Akademik</h2>
              <p className="page-subtitle">Daftar dosen pembimbing akademik dari seluruh program studi.</p>
            </div>
          </div>

          <div className="glass-card glow-blue">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>NIP / NIDN</th>
                    <th>Nama Dosen</th>
                    <th>Program Studi</th>
                    <th style={{ textAlign: 'center' }}>Jumlah Mahasiswa Bimbingan</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rawUsersList.filter(u => u.role === 'dosen').map((dosen) => {
                    const countBimbingan = rawUsersList.filter(u => u.role === 'mahasiswa' && u.dosen_utama_id === dosen.id).length;
                    return (
                      <tr key={dosen.id}>
                        <td><strong>{dosen.nim_nip}</strong></td>
                        <td><strong>{dosen.nama}</strong><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dosen.email}</div></td>
                        <td>{PRODI_MAP_FROM_DB[dosen.prodi_id] || '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-warning" style={{ fontSize: '13px' }}>
                            {countBimbingan} Mahasiswa
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => {
                              setActiveDosenForBimbingan(dosen);
                              setBimbinganSearchQuery('');
                              setSelectedBimbinganStudentId('');
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            Kelola Bimbingan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      )}

      {/* 4. KELOLA MATAKULIAH */}
      {activeMenu === 'matakuliah' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Kurikulum & Mata Kuliah</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Melihat kurikulum mata kuliah wajib & pilihan per program studi (Adm. Akademik Monitoring).' 
                  : `Kelola mata kuliah wajib & pilihan pada Program Studi ${adminProdiDept}.`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleSyncMatkul} 
                className="btn btn-secondary btn-sm"
                disabled={isSyncing}
                style={{ borderColor: 'var(--secondary)' }}
              >
                <RefreshCw className={`menu-icon ${isSyncing ? 'spin' : ''}`} style={{ color: 'var(--secondary)' }} />
                {isSyncing ? 'Menyinkronkan...' : 'Sinkron CAT'}
              </button>
              {currentRole !== 'admin' && (
                <button onClick={handleOpenAddMk} className="btn btn-primary btn-sm">
                  <Plus className="menu-icon" /> Tambah Matakuliah
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div className="search-wrapper" style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '16px', height: '16px' }} />
              <input 
                type="text" 
                placeholder="Cari kode atau nama mata kuliah..."
                value={mkSearchQuery}
                onChange={(e) => setMkSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '14px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <select 
                value={mkSemesterFilter} 
                onChange={(e) => setMkSemesterFilter(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '14px' }}
              >
                <option value="all">Semua Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          </div>

          <div className="glass-card glow-gold">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Mata Kuliah</th>
                    <th>Program Studi</th>
                    <th style={{ textAlign: 'center' }}>SKS</th>
                    <th style={{ textAlign: 'center' }}>Semester</th>
                    {currentRole !== 'admin' && <th style={{ textAlign: 'center' }}>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {renderedMatakuliahList.map((mk) => (
                    <tr key={mk.kode}>
                      <td><span className="badge badge-primary">{mk.kode}</span></td>
                      <td><strong>{mk.nama}</strong></td>
                      <td>{mk.prodi}</td>
                      <td style={{ textAlign: 'center' }}>{mk.sks} SKS</td>
                      <td style={{ textAlign: 'center' }}>Smt {mk.semester}</td>
                      {currentRole !== 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleOpenEditMk(mk)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                              <Edit style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button onClick={() => { if(confirm('Hapus Mata Kuliah ini?')) onDeleteMk(mk.kode) }} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                              <Trash style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. KARTU HASIL SEMESTER (KHS) */}
      {activeMenu === 'khs-admin' && (() => {
        // Filter students by prodi and class
        const filteredKhsStudents = rawUsersList
          .filter(u => u.role === 'mahasiswa')
          .filter(u => {
            if (currentRole === 'admin_prodi') {
              return u.prodi_id === PRODI_MAP_TO_DB[adminProdiDept];
            }
            return !khsProdiId || u.prodi_id === khsProdiId;
          })
          .filter(u => !khsKelasId || u.kelas_id === khsKelasId)
          .filter(u => {
            if (!khsSearchQuery.trim()) return true;
            const q = khsSearchQuery.toLowerCase();
            return u.nama?.toLowerCase().includes(q) || u.nim_nip?.toLowerCase().includes(q);
          });

        // Auto-select first student in the list if current selection is invalid or empty
        const activeStudent = filteredKhsStudents.find(s => s.id === selectedKhsStudentId) || filteredKhsStudents[0];

        // Find the class options for the select dropdown
        const prodiFilterId = currentRole === 'admin_prodi' ? PRODI_MAP_TO_DB[adminProdiDept] : khsProdiId;
        const khsKelasOptions = kelasList.filter(c => c.prodi_id === prodiFilterId);

        // Fetch grades for the active student
        const studentGrades = activeStudent ? nilaiList.filter(n => n.nim === activeStudent.nim_nip) : [];

        // Calculate total SKS and IPS
        const totalSks = studentGrades.reduce((sum, g) => sum + (g.sks || 0), 0);
        const totalSksBobot = studentGrades.reduce((sum, g) => sum + ((g.sks || 0) * getBobot(g.nilai_huruf)), 0);
        const ips = totalSks > 0 ? (totalSksBobot / totalSks).toFixed(2) : '0.00';

        // Helper to get grade point weight
        function getBobot(letter) {
          switch (letter) {
            case 'A': return 4.0;
            case 'B+': return 3.5;
            case 'B': return 3.0;
            case 'C+': return 2.5;
            case 'C': return 2.0;
            case 'D': return 1.0;
            default: return 0.0;
          }
        }

        return (
          <div className="animate-fade-in">
            <div className="page-header">
              <div>
                <h2 className="page-title">Kartu Hasil Studi (KHS)</h2>
                <p className="page-subtitle">Lihat nilai akhir semester per mahasiswa</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => alert('Fitur ekspor Excel dalam pengembangan')}>
                  Export Excel
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  if (!activeStudent) {
                    alert("Silakan pilih mahasiswa terlebih dahulu.");
                    return;
                  }
                  const prodiName = PRODI_MAP_FROM_DB[activeStudent.prodi_id] || '';
                  const activeKelas = kelasList.find(c => c.id === activeStudent.kelas_id);
                  onPrintKhs({
                    student: activeStudent,
                    grades: studentGrades,
                    semester: activeKelas?.semester || 1,
                    tahun_ajaran: settings.tahun_ajaran_aktif,
                    totalSks,
                    totalSksBobot,
                    ips,
                    prodiName,
                    angkatan: activeKelas?.angkatan || '36'
                  });
                }}>
                  Cetak
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => alert('Mencetak seluruh KHS kelas...')}>
                  Cetak Semua ({filteredKhsStudents.length})
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-card" style={{ marginBottom: '24px', padding: '16px', overflow: 'visible' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
                
                {currentRole !== 'admin_prodi' && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Program Studi:</label>
                    <select 
                      value={khsProdiId} 
                      onChange={(e) => {
                        setKhsProdiId(e.target.value);
                        setKhsKelasId('');
                        setSelectedKhsStudentId('');
                      }}
                      className="form-control"
                    >
                      <option value="ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb">D-III Nautika</option>
                      <option value="39ae54ce-9e86-4b99-943e-53437403e32d">D-III Permesinan Kapal</option>
                      <option value="2df63354-d49e-4f31-88aa-513509e22954">D-III MTPD</option>
                    </select>
                  </div>
                )}

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Kelas:</label>
                  <select 
                    value={khsKelasId} 
                    onChange={(e) => {
                      setKhsKelasId(e.target.value);
                      setSelectedKhsStudentId('');
                    }}
                    className="form-control"
                  >
                    <option value="">-- Semua Kelas --</option>
                    {khsKelasOptions.map(c => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Cari Mahasiswa:</label>
                  <input 
                    type="text" 
                    placeholder="Nama atau NIM..." 
                    value={khsSearchQuery}
                    onChange={(e) => {
                      setKhsSearchQuery(e.target.value);
                      setSelectedKhsStudentId('');
                    }}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Split Layout */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              
              {/* Left Column: Student List */}
              <div className="glass-card" style={{ width: '350px', padding: '16px', maxHeight: '70vh', overflowY: 'auto', flexShrink: 0 }}>
                <h3 className="card-title" style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                  Daftar Mahasiswa ({filteredKhsStudents.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredKhsStudents.map(student => {
                    const studentKelas = kelasList.find(c => c.id === student.kelas_id)?.nama || '-';
                    const isActive = activeStudent && activeStudent.id === student.id;
                    return (
                      <div 
                        key={student.id}
                        onClick={() => setSelectedKhsStudentId(student.id)}
                        style={{ 
                          padding: '12px 16px', 
                          borderRadius: 'var(--radius-sm)', 
                          cursor: 'pointer',
                          background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: isActive ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                          transition: 'all 0.2s ease'
                        }}
                        className="hover-bg-accent"
                      >
                        <div style={{ fontWeight: 'bold', color: isActive ? 'var(--accent)' : 'var(--text-main)', fontSize: '13px' }}>{student.nama}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {student.nim_nip} &bull; {studentKelas}
                        </div>
                      </div>
                    );
                  })}
                  {filteredKhsStudents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Tidak ada mahasiswa ditemukan
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: KHS View */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {activeStudent ? (
                  <div className="glass-card glow-cyan" style={{ padding: '24px' }}>
                    
                    {/* Student Information Header */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '16px', 
                      fontSize: '13px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      padding: '16px', 
                      borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--glass-border)',
                      marginBottom: '24px'
                    }}>
                      <div>Nama Lengkap: <strong style={{ color: 'var(--text-main)' }}>{activeStudent.nama}</strong></div>
                      <div>Program Studi: <strong>{PRODI_MAP_FROM_DB[activeStudent.prodi_id] || '-'}</strong></div>
                      <div>NIM: <strong style={{ color: 'var(--text-main)' }}>{activeStudent.nim_nip}</strong></div>
                      <div>Kelas: <strong>{kelasList.find(c => c.id === activeStudent.kelas_id)?.nama || '-'}</strong></div>
                      <div>Semester Aktif: <strong>Semester {kelasList.find(c => c.id === activeStudent.kelas_id)?.semester || '-'}</strong></div>
                      <div>Dosen Wali: <strong>{rawUsersList.find(d => d.role === 'dosen' && d.id === activeStudent.dosen_utama_id)?.nama || '-'}</strong></div>
                    </div>

                    {/* Grades Table */}
                    <div className="table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                            <th style={{ width: '120px' }}>Kode MK</th>
                            <th>Nama Mata Kuliah</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>SKS</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>Tugas</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>UTS</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>UAS</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>Praktek</th>
                            <th style={{ width: '80px', textAlign: 'center' }}>N. Akhir</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>Grade</th>
                            <th style={{ width: '60px', textAlign: 'center' }}>Bobot</th>
                            <th style={{ width: '80px', textAlign: 'center' }}>SKS x B</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentGrades.map((g, idx) => {
                            const weight = getBobot(g.nilai_huruf);
                            return (
                              <tr key={g.id || idx}>
                                <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                                <td><span className="badge badge-info">{g.matakuliah_kode}</span></td>
                                <td><strong>{g.nama_mk}</strong></td>
                                <td style={{ textAlign: 'center' }}>{g.sks}</td>
                                <td style={{ textAlign: 'center' }}>{g.tugas}</td>
                                <td style={{ textAlign: 'center' }}>{g.uts}</td>
                                <td style={{ textAlign: 'center' }}>{g.uas}</td>
                                <td style={{ textAlign: 'center' }}>{g.praktek}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--accent)' }}>{g.nilai_akhir?.toFixed(1)}</td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className={`badge ${g.nilai_huruf === 'A' ? 'badge-success' : g.nilai_huruf?.startsWith('B') ? 'badge-primary' : 'badge-warning'}`}>
                                    {g.nilai_huruf}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>{weight.toFixed(1)}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{(g.sks * weight).toFixed(1)}</td>
                              </tr>
                            );
                          })}
                          {studentGrades.length === 0 && (
                            <tr>
                              <td colSpan="12" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                                Belum ada data nilai KHS hasil ujian untuk mahasiswa ini.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {studentGrades.length > 0 && (
                          <tfoot>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', fontWeight: 'bold' }}>
                              <td colSpan="3" style={{ textAlign: 'right', padding: '12px' }}>Total SKS Kumulatif & Bobot:</td>
                              <td style={{ textAlign: 'center' }}>{totalSks} SKS</td>
                              <td colSpan="7" style={{ textAlign: 'right' }}>Total SKS x Bobot:</td>
                              <td style={{ textAlign: 'center' }}>{totalSksBobot.toFixed(1)}</td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>

                    {/* Summary Section */}
                    {studentGrades.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '16px 32px', 
                          background: 'rgba(6, 182, 212, 0.08)', 
                          border: '1px solid var(--cyan)', 
                          borderRadius: 'var(--radius-md)',
                          boxShadow: '0 0 15px rgba(6, 182, 212, 0.1)'
                        }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Indeks Prestasi Semester (IPS):</span>
                          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'Outfit', marginTop: '4px' }}>
                            {ips}
                          </div>
                        </div>
                      </div>
                    )}
                    
                  </div>
                ) : (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Pilih mahasiswa dari daftar di sebelah kiri untuk melihat rekap Kartu Hasil Studi (KHS).
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* 6. SETTINGS & SEMESTER CONFIG */}
      {activeMenu === 'semester' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Pengaturan Aplikasi & Akademik</h2>
              <p className="page-subtitle">
                {currentRole === 'admin_prodi' 
                  ? 'Melihat semester aktif, masa pengisian KRS online, dan pengaturan sistem (Monitoring Prodi).' 
                  : 'Atur semester aktif, masa pengisian KRS online, serta kustomisasi identitas aplikasi.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {/* Card 1: Pengaturan Akademik & Sistem */}
            <div className="glass-card glow-blue" style={{ margin: 0 }}>
              <div className="card-header-clean">
                <h3 className="card-title"><SettingsIcon /> Pengaturan Akademik & Sistem</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Tahun Ajaran / Semester Aktif:</label>
                <input 
                  type="text" 
                  value={tempSettings.tahun_ajaran_aktif} 
                  onChange={(e) => setTempSettings({ ...tempSettings, tahun_ajaran_aktif: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Masa Pengisian KRS Online:</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button 
                    onClick={() => { if (currentRole !== 'admin_prodi') setTempSettings({ ...tempSettings, krs_open: true }) }}
                    className={`btn ${tempSettings.krs_open ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    disabled={currentRole === 'admin_prodi'}
                  >
                    <Check className="menu-icon" /> Buka Periode KRS
                  </button>
                  <button 
                    onClick={() => { if (currentRole !== 'admin_prodi') setTempSettings({ ...tempSettings, krs_open: false }) }}
                    className={`btn ${!tempSettings.krs_open ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    disabled={currentRole === 'admin_prodi'}
                  >
                    ✕ Tutup Periode KRS
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Aplikasi:</label>
                <input 
                  type="text" 
                  value={tempSettings.nama_aplikasi || ''} 
                  onChange={(e) => setTempSettings({ ...tempSettings, nama_aplikasi: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sub Nama Aplikasi:</label>
                <input 
                  type="text" 
                  value={tempSettings.sub_nama_aplikasi || ''} 
                  onChange={(e) => setTempSettings({ ...tempSettings, sub_nama_aplikasi: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>
            </div>

            {/* Card 2: Identitas & Informasi Kampus */}
            <div className="glass-card glow-gold" style={{ margin: 0 }}>
              <div className="card-header-clean">
                <h3 className="card-title"><Building2 /> Identitas & Informasi Kampus</h3>
              </div>

              {/* Logo Upload Section */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--glass-border)' }}>
                <label className="form-label" style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>Logo Kampus:</label>
                {tempSettings.logo_url ? (
                  <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={tempSettings.logo_url} alt="Logo Kampus" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#fff', padding: '8px', borderRadius: 'var(--radius-sm)' }} />
                    {currentRole !== 'admin_prodi' && (
                      <button 
                        type="button" 
                        onClick={() => setTempSettings({ ...tempSettings, logo_url: '' })} 
                        style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    onClick={() => { if (currentRole !== 'admin_prodi') document.getElementById('logo-upload-input').click() }}
                    style={{ width: '120px', height: '120px', border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: currentRole === 'admin_prodi' ? 'default' : 'pointer', color: 'var(--text-muted)' }}
                  >
                    <Plus style={{ width: '24px', height: '24px', marginBottom: '4px' }} />
                    <span style={{ fontSize: '10px' }}>Upload Logo</span>
                  </div>
                )}
                <input 
                  id="logo-upload-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert('Ukuran file maksimal 2MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setTempSettings({ ...tempSettings, logo_url: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>Format: PNG/JPG (Max 2MB)</span>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Kampus:</label>
                <input 
                  type="text" 
                  value={tempSettings.nama_kampus || ''} 
                  onChange={(e) => setTempSettings({ ...tempSettings, nama_kampus: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Kampus:</label>
                <input 
                  type="text" 
                  value={tempSettings.alamat_kampus || ''} 
                  onChange={(e) => setTempSettings({ ...tempSettings, alamat_kampus: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telepon Kampus:</label>
                <input 
                  type="text" 
                  value={tempSettings.telepon_kampus || ''} 
                  onChange={(e) => setTempSettings({ ...tempSettings, telepon_kampus: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Kampus:</label>
                <input 
                  type="text" 
                  value={tempSettings.email_kampus || ''} 
                  onChange={(e) => setTempSettings({ ...tempSettings, email_kampus: e.target.value })}
                  className="form-control"
                  disabled={currentRole === 'admin_prodi'}
                />
              </div>
            </div>
          </div>

          {currentRole !== 'admin_prodi' && (
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveSettings} className="btn btn-success" style={{ minWidth: '220px', padding: '12px' }}>
                <Save className="menu-icon" /> Simpan Semua Pengaturan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Persetujuan Ka. Prodi */}
      {activeMenu === 'krs-prodi' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Persetujuan KRS</h2>
              <p className="page-subtitle">Verifikasi akhir dan persetujuan Kartu Rencana Studi (KRS) mahasiswa oleh Kepala Program Studi.</p>
            </div>
          </div>

          <div className="glass-card glow-cyan">
            <div className="card-header-clean">
              <h3 className="card-title">Daftar Pengajuan KRS Menunggu Persetujuan</h3>
              <span className="badge badge-primary">
                {filteredKrsList.filter(k => k.status === 'Menunggu Persetujuan Ka. Prodi').length} Pengajuan
              </span>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mahasiswa / NIM</th>
                    <th>Program Studi</th>
                    <th style={{ textAlign: 'center' }}>Total SKS</th>
                    <th>Mata Kuliah Diusulkan</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKrsList.filter(k => k.status === 'Menunggu Persetujuan Ka. Prodi').length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Tidak ada pengajuan KRS yang menunggu persetujuan Ka. Prodi saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredKrsList
                      .filter(k => k.status === 'Menunggu Persetujuan Ka. Prodi')
                      .map((krs) => {
                        const taruna = tarunaList.find(t => t.nim === krs.nim);
                        
                        // Calculate total SKS and map courses
                        let totalSks = 0;
                        const mappedCourses = krs.kelas_ids.map(kid => {
                          const kelas = kelasList.find(c => c.id === kid);
                          const mk = matakuliahList.find(m => m.kode === kelas?.matakuliah_kode);
                          if (mk) totalSks += mk.sks;
                          return mk ? `${mk.nama} (${mk.sks} SKS)` : 'Unknown';
                        });

                        return (
                          <tr key={krs.id}>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong>{taruna?.nama || 'Unknown'}</strong>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NIM: {krs.nim}</span>
                              </div>
                            </td>
                            <td>{taruna?.prodi || '-'}</td>
                            <td style={{ textAlign: 'center' }}><strong>{totalSks} SKS</strong></td>
                            <td>
                              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-body)' }}>
                                {mappedCourses.map((cName, idx) => (
                                  <li key={idx}>{cName}</li>
                                ))}
                              </ul>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className="badge badge-warning">Menunggu Ka. Prodi</span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {currentRole === 'admin_prodi' ? (
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Setujui KRS untuk mahasiswa ${taruna?.nama}?`)) {
                                        onApproveKrs(krs.id, 'Disetujui Ka. Prodi', '');
                                        alert("KRS Mahasiswa berhasil disetujui oleh Ka. Prodi!");
                                      }
                                    }}
                                    className="btn btn-primary btn-sm"
                                    style={{ 
                                      padding: '6px 12px', 
                                      background: 'rgba(16, 185, 129, 0.15)', 
                                      color: 'var(--success)', 
                                      border: '1px solid rgba(16, 185, 129, 0.3)' 
                                    }}
                                  >
                                    Setujui
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const reason = prompt("Masukkan alasan penolakan KRS:", "Ditolak oleh Ka. Prodi");
                                      if (reason !== null) {
                                        onApproveKrs(krs.id, 'Ditolak', reason);
                                        alert("KRS Mahasiswa ditolak/dikembalikan.");
                                      }
                                    }}
                                    className="btn btn-danger btn-sm"
                                    style={{ 
                                      padding: '6px 12px', 
                                      background: 'rgba(239, 68, 68, 0.15)', 
                                      color: 'var(--danger)', 
                                      border: '1px solid rgba(239, 68, 68, 0.3)' 
                                    }}
                                  >
                                    Tolak
                                  </button>
                                </div>
                              ) : (
                                <span className="badge badge-info" style={{ textTransform: 'none' }}>Hanya Monitoring</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TARUNA MODAL */}
      {showTarunaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah Mahasiswa Baru' : 'Edit Data Mahasiswa'}</h3>
              <button onClick={() => setShowTarunaModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveTaruna}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nomor Induk Mahasiswa (NIM):</label>
                  <input 
                    type="text" 
                    value={targetTaruna.nim}
                    onChange={(e) => setTargetTaruna({ ...targetTaruna, nim: e.target.value })}
                    className="form-control"
                    required
                    disabled={modalType === 'edit'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Lengkap Mahasiswa:</label>
                  <input 
                    type="text" 
                    value={targetTaruna.nama}
                    onChange={(e) => setTargetTaruna({ ...targetTaruna, nama: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Program Studi:</label>
                  <select 
                    value={targetTaruna.prodi}
                    onChange={(e) => setTargetTaruna({ ...targetTaruna, prodi: e.target.value })}
                    className="form-control"
                  >
                    <option value="D-III Nautika">D-III Nautika</option>
                    <option value="D-III Permesinan Kapal">D-III Permesinan Kapal</option>
                    <option value="D-III Manajemen Transportasi Perairan Daratan (MTPD)">D-III MTPD</option>
                  </select>
                </div>

                <div className="grid-2-cols-responsive">
                  <div className="form-group">
                    <label className="form-label">Semester:</label>
                    <input 
                      type="number" 
                      value={targetTaruna.semester}
                      onChange={(e) => setTargetTaruna({ ...targetTaruna, semester: parseInt(e.target.value) || 1 })}
                      className="form-control"
                      min={1} max={6}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kelas:</label>
                    <input 
                      type="text" 
                      value={targetTaruna.kelas}
                      onChange={(e) => setTargetTaruna({ ...targetTaruna, kelas: e.target.value })}
                      className="form-control"
                      placeholder="Contoh: Nautika A"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dosen Pembimbing Akademik (Wali):</label>
                  <select 
                    value={targetTaruna.dosen_wali_nidn}
                    onChange={(e) => setTargetTaruna({ ...targetTaruna, dosen_wali_nidn: e.target.value })}
                    className="form-control"
                  >
                    {dosenList.map(d => (
                      <option key={d.nidn} value={d.nidn}>{d.nama} ({d.prodi})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input 
                    type="email" 
                    value={targetTaruna.email}
                    onChange={(e) => setTargetTaruna({ ...targetTaruna, email: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                {modalType === 'add' && (
                  <div className="grid-2-cols-responsive">
                    <div className="form-group">
                      <label className="form-label">IPK Terakhir:</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={targetTaruna.ipk}
                        onChange={(e) => setTargetTaruna({ ...targetTaruna, ipk: parseFloat(e.target.value) || 0 })}
                        className="form-control"
                        min={0} max={4}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">IPS Lalu:</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={targetTaruna.ips_prev}
                        onChange={(e) => setTargetTaruna({ ...targetTaruna, ips_prev: parseFloat(e.target.value) || 0 })}
                        className="form-control"
                        min={0} max={4}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowTarunaModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSEN MODAL */}
      {showDosenModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah Dosen Baru' : 'Edit Data Dosen'}</h3>
              <button onClick={() => setShowDosenModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveDosen}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">NIDN / Kode Dosen:</label>
                  <input 
                    type="text" 
                    value={targetDosen.nidn}
                    onChange={(e) => setTargetDosen({ ...targetDosen, nidn: e.target.value })}
                    className="form-control"
                    required
                    disabled={modalType === 'edit'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Lengkap Dosen (Gelar):</label>
                  <input 
                    type="text" 
                    value={targetDosen.nama}
                    onChange={(e) => setTargetDosen({ ...targetDosen, nama: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Home Program Studi:</label>
                  <select 
                    value={targetDosen.prodi}
                    onChange={(e) => setTargetDosen({ ...targetDosen, prodi: e.target.value })}
                    className="form-control"
                  >
                    <option value="D-III Nautika">D-III Nautika</option>
                    <option value="D-III Permesinan Kapal">D-III Permesinan Kapal</option>
                    <option value="D-III Manajemen Transportasi Perairan Daratan (MTPD)">D-III MTPD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input 
                    type="email" 
                    value={targetDosen.email}
                    onChange={(e) => setTargetDosen({ ...targetDosen, email: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">No. Telepon / HP:</label>
                  <input 
                    type="text" 
                    value={targetDosen.telepon}
                    onChange={(e) => setTargetDosen({ ...targetDosen, telepon: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDosenModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATAKULIAH MODAL */}
      {showMkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah Mata Kuliah' : 'Edit Mata Kuliah'}</h3>
              <button onClick={() => setShowMkModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveMk}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Kode Mata Kuliah:</label>
                  <input 
                    type="text" 
                    value={targetMk.kode}
                    onChange={(e) => setTargetMk({ ...targetMk, kode: e.target.value })}
                    className="form-control"
                    required
                    disabled={modalType === 'edit'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Mata Kuliah:</label>
                  <input 
                    type="text" 
                    value={targetMk.nama}
                    onChange={(e) => setTargetMk({ ...targetMk, nama: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="grid-2-cols-responsive">
                  <div className="form-group">
                    <label className="form-label">Bobot SKS:</label>
                    <input 
                      type="number" 
                      value={targetMk.sks}
                      onChange={(e) => setTargetMk({ ...targetMk, sks: parseInt(e.target.value) || 2 })}
                      className="form-control"
                      min={1} max={6}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester Kurikulum:</label>
                    <input 
                      type="number" 
                      value={targetMk.semester}
                      onChange={(e) => setTargetMk({ ...targetMk, semester: parseInt(e.target.value) || 1 })}
                      className="form-control"
                      min={1} max={6}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Program Studi:</label>
                  <select 
                    value={targetMk.prodi}
                    onChange={(e) => setTargetMk({ ...targetMk, prodi: e.target.value })}
                    className="form-control"
                  >
                    <option value="D-III Nautika">D-III Nautika</option>
                    <option value="D-III Permesinan Kapal">D-III Permesinan Kapal</option>
                    <option value="D-III Manajemen Transportasi Perairan Daratan (MTPD)">D-III MTPD</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowMkModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* USER MODAL */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah User Baru' : 'Edit User'}</h3>
              <button onClick={() => setShowUserModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveUserSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Username:</label>
                  <input 
                    type="text" 
                    value={targetUser.username}
                    onChange={(e) => setTargetUser({ ...targetUser, username: e.target.value })}
                    className="form-control"
                    placeholder="Masukkan username login"
                    required
                  />
                </div>

                {targetUser.role !== 'keuangan' && (
                  <div className="form-group">
                    <label className="form-label">Nomor Induk (NIM/NIP) (Opsional):</label>
                    <input 
                      type="text" 
                      value={targetUser.nim_nip}
                      onChange={(e) => setTargetUser({ ...targetUser, nim_nip: e.target.value })}
                      className="form-control"
                      disabled={modalType === 'edit'}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Nama Lengkap:</label>
                  <input 
                    type="text" 
                    value={targetUser.nama}
                    onChange={(e) => setTargetUser({ ...targetUser, nama: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password:</label>
                  <input 
                    type="text" 
                    value={targetUser.password}
                    onChange={(e) => setTargetUser({ ...targetUser, password: e.target.value })}
                    className="form-control"
                    placeholder={modalType === 'edit' ? 'Ketik untuk mengubah password' : ''}
                    required={modalType === 'add'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Pengguna:</label>
                  <select 
                    value={targetUser.role}
                    onChange={(e) => setTargetUser({ ...targetUser, role: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                    <option value="admin_prodi">Admin Prodi</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="keuangan">Admin Keuangan</option>
                    <option value="pengawas">Pengawas</option>
                    <option value="pusbangkatar">Pusbangkatar</option>
                  </select>
                </div>

                {targetUser.role !== 'keuangan' && (
                  <div className="form-group">
                    <label className="form-label">Program Studi:</label>
                    <select 
                      value={targetUser.prodi_id}
                      onChange={(e) => setTargetUser({ ...targetUser, prodi_id: e.target.value })}
                      className="form-control"
                      disabled={currentRole === 'admin_prodi'}
                    >
                      <option value="">-- Tidak Ada Prodi / Non-Akademik --</option>
                      <option value="ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb">D-III Nautika</option>
                      <option value="39ae54ce-9e86-4b99-943e-53437403e32d">D-III Permesinan Kapal</option>
                      <option value="2df63354-d49e-4f31-88aa-513509e22954">D-III Manajemen Transportasi Perairan Daratan (MTPD)</option>
                    </select>
                  </div>
                )}

                {targetUser.role === 'mahasiswa' && (
                  <div className="form-group">
                    <label className="form-label">Pilih Kelas:</label>
                    <select 
                      value={targetUser.kelas_id}
                      onChange={(e) => setTargetUser({ ...targetUser, kelas_id: e.target.value })}
                      className="form-control"
                      required
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {filteredKelasList
                        .filter(c => c.prodi_id === targetUser.prodi_id)
                        .map(c => (
                          <option key={c.id} value={c.id}>{c.nama}</option>
                        ))}
                    </select>
                  </div>
                )}

                {targetUser.role !== 'keuangan' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Email (Opsional):</label>
                      <input 
                        type="email" 
                        value={targetUser.email}
                        onChange={(e) => setTargetUser({ ...targetUser, email: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">No. Telepon / HP (Opsional):</label>
                      <input 
                        type="text" 
                        value={targetUser.no_hp}
                        onChange={(e) => setTargetUser({ ...targetUser, no_hp: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </>
                )}

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="userIsActive"
                    checked={targetUser.is_active}
                    onChange={(e) => setTargetUser({ ...targetUser, is_active: e.target.checked })}
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <label htmlFor="userIsActive" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Status User Aktif</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowUserModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KELAS MODAL */}
      {showKelasModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah Kelas Baru' : 'Edit Kelas'}</h3>
              <button onClick={() => setShowKelasModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveKelasSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Kelas:</label>
                  <input 
                    type="text" 
                    value={targetKelas.nama}
                    onChange={(e) => setTargetKelas({ ...targetKelas, nama: e.target.value })}
                    className="form-control"
                    placeholder="Contoh: Nautika A atau PK-1A"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Program Studi:</label>
                  <select 
                    value={targetKelas.prodi_id}
                    onChange={(e) => setTargetKelas({ ...targetKelas, prodi_id: e.target.value })}
                    className="form-control"
                    required
                    disabled={currentRole === 'admin_prodi'}
                  >
                    <option value="ffe7ed2a-97b6-458b-9fc7-4d9b62e04efb">D-III Nautika</option>
                    <option value="39ae54ce-9e86-4b99-943e-53437403e32d">D-III Permesinan Kapal</option>
                    <option value="2df63354-d49e-4f31-88aa-513509e22954">D-III Manajemen Transportasi Perairan Daratan (MTPD)</option>
                  </select>
                </div>

                <div className="grid-2-cols-responsive">
                  <div className="form-group">
                    <label className="form-label">Angkatan:</label>
                    <input 
                      type="number" 
                      value={targetKelas.angkatan}
                      onChange={(e) => setTargetKelas({ ...targetKelas, angkatan: parseInt(e.target.value) || 36 })}
                      className="form-control"
                      min={10} max={60}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester:</label>
                    <input 
                      type="number" 
                      value={targetKelas.semester}
                      onChange={(e) => setTargetKelas({ ...targetKelas, semester: parseInt(e.target.value) || 1 })}
                      className="form-control"
                      min={1} max={6}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowKelasModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JADWAL MODAL */}
      {showJadwalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Tambah Jadwal Baru' : 'Edit Jadwal Kuliah'}</h3>
              <button onClick={() => setShowJadwalModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveJadwalSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Pilih Kelas:</label>
                  <select 
                    value={targetJadwal.kelas_id}
                    onChange={(e) => setTargetJadwal({ ...targetJadwal, kelas_id: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {filteredKelasList.map(c => (
                      <option key={c.id} value={c.id}>{c.nama} ({PRODI_MAP_FROM_DB[c.prodi_id]?.substring(6)})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pilih Mata Kuliah:</label>
                  <select 
                    value={targetJadwal.mata_kuliah_id}
                    onChange={(e) => setTargetJadwal({ ...targetJadwal, mata_kuliah_id: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="">-- Pilih Mata Kuliah --</option>
                    {filteredMatakuliahList.map(m => (
                      <option key={m.id || m.kode} value={m.id || m.kode}>{m.kode} - {m.nama} ({m.sks} SKS)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pilih Dosen Pengampu:</label>
                  <select 
                    value={targetJadwal.dosen_id}
                    onChange={(e) => setTargetJadwal({ ...targetJadwal, dosen_id: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="">-- Pilih Dosen --</option>
                    {rawUsersList
                      .filter(u => u.role === 'dosen')
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.nama}</option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hari Kuliah:</label>
                  <select 
                    value={targetJadwal.hari}
                    onChange={(e) => setTargetJadwal({ ...targetJadwal, hari: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div className="grid-2-cols-responsive">
                  <div className="form-group">
                    <label className="form-label">Jam Mulai:</label>
                    <input 
                      type="time" 
                      value={targetJadwal.jam_mulai}
                      onChange={(e) => setTargetJadwal({ ...targetJadwal, jam_mulai: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jam Selesai:</label>
                    <input 
                      type="time" 
                      value={targetJadwal.jam_selesai}
                      onChange={(e) => setTargetJadwal({ ...targetJadwal, jam_selesai: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ruangan:</label>
                  <input 
                    type="text" 
                    value={targetJadwal.ruangan}
                    onChange={(e) => setTargetJadwal({ ...targetJadwal, ruangan: e.target.value })}
                    className="form-control"
                    placeholder="Contoh: Ruang 103 atau Lab Navigasi"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowJadwalModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-view: Kelola Bimbingan Dosen */}
      {activeDosenForBimbingan && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%' }}>
            <div className="modal-header">
              <h3>Bimbingan Akademik: {activeDosenForBimbingan.nama}</h3>
              <button onClick={() => setActiveDosenForBimbingan(null)} className="btn-close">✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* Search and assign student form */}
              {currentRole !== 'admin' && (
                <div className="glass-card" style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', overflow: 'visible' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Assign Mahasiswa Bimbingan Baru</h4>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="Cari mahasiswa berdasarkan Nama atau NIM..." 
                        value={bimbinganSearchQuery}
                        onChange={(e) => setBimbinganSearchQuery(e.target.value)}
                        className="form-control"
                      />
                      
                      {/* Autocomplete list based on bimbinganSearchQuery */}
                      {bimbinganSearchQuery.trim() !== '' && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: 0, 
                          right: 0, 
                          background: 'var(--bg-secondary)', 
                          border: '1px solid var(--glass-border)', 
                          borderRadius: 'var(--radius-sm)', 
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}>
                          {rawUsersList
                            .filter(u => u.role === 'mahasiswa' && u.dosen_utama_id !== activeDosenForBimbingan.id)
                            .filter(u => 
                              u.nama?.toLowerCase().includes(bimbinganSearchQuery.toLowerCase()) || 
                              u.nim_nip?.toLowerCase().includes(bimbinganSearchQuery.toLowerCase())
                            )
                            .slice(0, 8)
                            .map(s => (
                              <div 
                                key={s.id}
                                onClick={() => {
                                  setSelectedBimbinganStudentId(s.id);
                                  setBimbinganSearchQuery(`${s.nim_nip} - ${s.nama}`);
                                }}
                                style={{ 
                                  padding: '8px 12px', 
                                  cursor: 'pointer',
                                  borderBottom: '1px solid var(--glass-border)'
                                }}
                                className="hover-bg-accent"
                              >
                                <strong>{s.nim_nip}</strong> | {s.nama} ({PRODI_MAP_FROM_DB[s.prodi_id] || '-'})
                              </div>
                            ))}
                          {rawUsersList
                            .filter(u => u.role === 'mahasiswa' && u.dosen_utama_id !== activeDosenForBimbingan.id)
                            .filter(u => 
                              u.nama?.toLowerCase().includes(bimbinganSearchQuery.toLowerCase()) || 
                              u.nim_nip?.toLowerCase().includes(bimbinganSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <div style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Tidak ditemukan mahasiswa yang cocok</div>
                            )}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (selectedBimbinganStudentId) {
                          onAssignBimbingan(selectedBimbinganStudentId, activeDosenForBimbingan.id);
                          setBimbinganSearchQuery('');
                          setSelectedBimbinganStudentId('');
                        } else {
                          alert('Pilih mahasiswa dari daftar hasil pencarian.');
                        }
                      }}
                      className="btn btn-primary"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Tambahkan
                    </button>
                  </div>
                </div>
              )}

              {/* List of currently assigned students */}
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Daftar Mahasiswa Bimbingan Saat Ini</h4>
              
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>NIM</th>
                      <th>Nama Mahasiswa</th>
                      <th>Program Studi / Kelas</th>
                      {currentRole !== 'admin' && <th style={{ textAlign: 'center' }}>Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rawUsersList
                      .filter(u => u.role === 'mahasiswa' && u.dosen_utama_id === activeDosenForBimbingan.id)
                      .length === 0 ? (
                        <tr>
                          <td colSpan={currentRole !== 'admin' ? "4" : "3"} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                            Belum ada mahasiswa bimbingan yang ditugaskan ke dosen ini.
                          </td>
                        </tr>
                      ) : (
                        rawUsersList
                          .filter(u => u.role === 'mahasiswa' && u.dosen_utama_id === activeDosenForBimbingan.id)
                          .map(s => {
                            const userProdi = PRODI_MAP_FROM_DB[s.prodi_id] || '-';
                            const userKelas = kelasList.find(c => c.id === s.kelas_id)?.nama || '-';
                            return (
                              <tr key={s.id}>
                                <td>{s.nim_nip}</td>
                                <td><strong>{s.nama}</strong></td>
                                <td>{userProdi} / {userKelas}</td>
                                {currentRole !== 'admin' && (
                                  <td style={{ textAlign: 'center' }}>
                                    <button 
                                      onClick={() => {
                                        if (confirm(`Hapus bimbingan mahasiswa ${s.nama} dari dosen ini?`)) {
                                          onRemoveBimbingan(s.id);
                                        }
                                      }}
                                      className="btn btn-danger btn-sm"
                                      style={{ padding: '4px 10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                    >
                                      Hapus
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      )}
                  </tbody>
                </table>
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveDosenForBimbingan(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
