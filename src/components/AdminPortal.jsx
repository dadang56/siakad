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
  RefreshCw
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
  adminProdiDept = null
}) {
  
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

  const filteredKrsList = currentRole === 'admin_prodi' && adminProdiDept
    ? krsList.filter(k => {
        const student = tarunaList.find(t => t.nim === k.nim);
        return student && student.prodi === adminProdiDept;
      })
    : krsList;

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

  // Poin state
  const [selectedTarunaNim, setSelectedTarunaNim] = useState('');
  const [poinType, setPoinType] = useState('pelanggaran');
  const [poinVal, setPoinVal] = useState(10);
  const [poinDesc, setPoinDesc] = useState('');

  // Settings State
  const [tempSettings, setTempSettings] = useState({ ...settings });

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

  // 4. Disciplinary Points
  const handleAddPoinSubmit = (e) => {
    e.preventDefault();
    if (!selectedTarunaNim) {
      alert("Pilih Mahasiswa terlebih dahulu.");
      return;
    }
    if (!poinDesc) {
      alert("Masukkan deskripsi pelanggaran / prestasi.");
      return;
    }

    const value = poinType === 'pelanggaran' ? -Math.abs(poinVal) : Math.abs(poinVal);
    onAddPoin(selectedTarunaNim, {
      id: Date.now(),
      tanggal: new Date().toISOString().split('T')[0],
      jenis: poinType,
      poin: value,
      keterangan: poinDesc
    });

    setPoinDesc('');
    alert("Catatan Poin Ketarunaan berhasil ditambahkan!");
  };

  // Selected Taruna profile for points
  const selectedTaruna = tarunaList.find(t => t.nim === selectedTarunaNim);

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
              {currentRole === 'admin_prodi' ? `Portal Administrasi Prodi - ${adminProdiDept}` : 'Portal Administrasi Akademik & Kemahasiswaan (BAK)'}
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
                    <span className="status-item-title">Tarif UKT Dasar</span>
                    <span className="status-item-subtitle">Rp {settings.tarif_ukt.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KELOLA TARUNA */}
      {activeMenu === 'taruna' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Manajemen Data Mahasiswa</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Melihat daftar biodata serta status akademik Mahasiswa (BAK Monitoring).' 
                  : `Kelola biodata serta status akademik Mahasiswa pada Program Studi ${adminProdiDept}.`}
              </p>
            </div>
            {currentRole !== 'admin' && (
              <button onClick={handleOpenAddTaruna} className="btn btn-primary btn-sm">
                <Plus className="menu-icon" /> Tambah Mahasiswa Baru
              </button>
            )}
          </div>

          <div className="glass-card glow-blue">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>NIM</th>
                    <th>Nama Mahasiswa</th>
                    <th>Program Studi</th>
                    <th>Angkatan / Smt</th>
                    <th>Dosen Wali</th>
                    <th>Keuangan (UKT)</th>
                    <th style={{ textAlign: 'center' }}>{currentRole === 'admin' ? 'Status' : 'Aksi'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTarunaList.map((taruna) => {
                    const wali = filteredDosenList.find(d => d.nidn === taruna.dosen_wali_nidn);
                    return (
                      <tr key={taruna.nim}>
                        <td><strong>{taruna.nim}</strong></td>
                        <td>
                          <div>{taruna.nama}</div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{taruna.email}</span>
                        </td>
                        <td>{taruna.prodi}</td>
                        <td>Th {taruna.angkatan} / Smt {taruna.semester}</td>
                        <td style={{ fontSize: '13px' }}>{wali?.nama || '-'}</td>
                        <td>
                          <span className={`badge ${taruna.status_ukt === 'Lunas' ? 'badge-success' : 'badge-danger'}`}>
                            {taruna.status_ukt}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {currentRole !== 'admin' ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button onClick={() => handleOpenEditTaruna(taruna)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                                <Edit style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button onClick={() => { if(confirm('Hapus Mahasiswa ini?')) onDeleteTaruna(taruna.nim) }} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Trash style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          ) : (
                            <span className="badge badge-info" style={{ textTransform: 'none' }}>Terverifikasi</span>
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

      {/* 3. KELOLA DOSEN */}
      {activeMenu === 'dosen' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Manajemen Data Dosen</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Melihat daftar dosen pengampu mata kuliah & pembimbing perwalian (BAK Monitoring).' 
                  : `Kelola data dosen pengampu & wali pada Program Studi ${adminProdiDept}.`}
              </p>
            </div>
            {currentRole !== 'admin' && (
              <button onClick={handleOpenAddDosen} className="btn btn-primary btn-sm">
                <Plus className="menu-icon" /> Tambah Dosen Baru
              </button>
            )}
          </div>

          <div className="glass-card glow-cyan">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>NIDN</th>
                    <th>Nama Lengkap</th>
                    <th>Program Studi</th>
                    <th>Email</th>
                    <th>Kontak / Telp</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>{currentRole === 'admin' ? 'Keterangan' : 'Aksi'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDosenList.map((dosen) => (
                    <tr key={dosen.nidn}>
                      <td><strong>{dosen.nidn}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {dosen.foto && <img src={dosen.foto} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />}
                          <strong>{dosen.nama}</strong>
                        </div>
                      </td>
                      <td>{dosen.prodi}</td>
                      <td>{dosen.email}</td>
                      <td>{dosen.telepon}</td>
                      <td><span className="badge badge-info">{dosen.status}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        {currentRole !== 'admin' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleOpenEditDosen(dosen)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                              <Edit style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button onClick={() => { if(confirm('Hapus Dosen ini?')) onDeleteDosen(dosen.nidn) }} className="btn btn-danger btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                              <Trash style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        ) : (
                          <span className="badge badge-primary" style={{ textTransform: 'none' }}>Aktif</span>
                        )}
                      </td>
                    </tr>
                  ))}
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
                  ? 'Melihat kurikulum mata kuliah wajib & pilihan per program studi (BAK Monitoring).' 
                  : `Kelola mata kuliah wajib & pilihan pada Program Studi ${adminProdiDept}.`}
              </p>
            </div>
            {currentRole !== 'admin' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleSyncMatkul} 
                  className="btn btn-secondary btn-sm"
                  disabled={isSyncing}
                  style={{ borderColor: 'var(--secondary)' }}
                >
                  <RefreshCw className={`menu-icon ${isSyncing ? 'spin' : ''}`} style={{ color: 'var(--secondary)' }} />
                  {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan CAT & LMS'}
                </button>
                <button onClick={handleOpenAddMk} className="btn btn-primary btn-sm">
                  <Plus className="menu-icon" /> Tambah Matakuliah
                </button>
              </div>
            )}
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
                  {filteredMatakuliahList.map((mk) => (
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

      {/* 5. KETARUNAAN (POIN) */}
      {activeMenu === 'poin' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Pencatatan Poin Kemahasiswaan</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Melihat rekapitulasi poin pelanggaran & prestasi Mahasiswa (BAK Monitoring).' 
                  : `Kelola poin pelanggaran disiplin & prestasi Mahasiswa prodi ${adminProdiDept}.`}
              </p>
            </div>
          </div>

          <div className="dashboard-layout" style={currentRole === 'admin' ? { display: 'block' } : {}}>
            {/* Form Input Poin */}
            {currentRole !== 'admin' && (
              <div className="glass-card glow-gold">
                <div className="card-header-clean">
                  <h3 className="card-title"><ShieldAlert /> Entri Prestasi & Pelanggaran</h3>
                </div>
                <form onSubmit={handleAddPoinSubmit}>
                  <div className="form-group">
                    <label className="form-label">Pilih Mahasiswa:</label>
                    <select 
                      value={selectedTarunaNim}
                      onChange={(e) => setSelectedTarunaNim(e.target.value)}
                      className="form-control"
                    >
                      <option value="">-- Pilih Mahasiswa --</option>
                      {filteredTarunaList.map(t => (
                        <option key={t.nim} value={t.nim}>{t.nim} - {t.nama} ({t.prodi})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Jenis Log Poin:</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="poinType" 
                          value="pelanggaran" 
                          checked={poinType === 'pelanggaran'}
                          onChange={() => setPoinType('pelanggaran')}
                        />
                        Pelanggaran (Poin Negatif)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="poinType" 
                          value="prestasi" 
                          checked={poinType === 'prestasi'}
                          onChange={() => setPoinType('prestasi')}
                        />
                        Prestasi (Poin Positif)
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Besaran Poin:</label>
                    <input 
                      type="number" 
                      value={poinVal}
                      onChange={(e) => setPoinVal(parseInt(e.target.value) || 0)}
                      className="form-control"
                      min={1} max={100}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Poin akan otomatis dikurangi jika pelanggaran, atau ditambahkan jika prestasi.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deskripsi Kejadian / Keterangan:</label>
                    <textarea 
                      value={poinDesc}
                      onChange={(e) => setPoinDesc(e.target.value)}
                      className="form-control"
                      placeholder="Contoh: Terlambat apel pagi 15 menit atau Juara 1 Paduan Suara Tingkat Provinsi"
                      style={{ height: '80px', resize: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Simpan Catatan Poin
                  </button>
                </form>
              </div>
            )}

            {/* Rekap Poin Taruna Terpilih */}
            <div className="glass-card" style={currentRole === 'admin' ? { maxWidth: '800px', margin: '0 auto' } : {}}>
              <div className="card-header-clean">
                <h3 className="card-title">Rekap Kepribadian Mahasiswa</h3>
              </div>
              
              {currentRole === 'admin' && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Pilih Mahasiswa untuk Dimonitor:</label>
                  <select 
                    value={selectedTarunaNim}
                    onChange={(e) => setSelectedTarunaNim(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: '400px' }}
                  >
                    <option value="">-- Pilih Mahasiswa --</option>
                    {filteredTarunaList.map(t => (
                      <option key={t.nim} value={t.nim}>{t.nim} - {t.nama} ({t.prodi})</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedTaruna ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>{selectedTaruna.nama}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status Poin Saat Ini:</div>
                    </div>
                    <div className="badge badge-warning" style={{ fontSize: '16px', padding: '8px 16px' }}>
                      {selectedTaruna.poin_ketarunaan} / 100 Poin
                    </div>
                  </div>

                  <div className="timeline">
                    {selectedTaruna.riwayat_poin.length > 0 ? (
                      selectedTaruna.riwayat_poin.map(log => (
                        <div key={log.id} className="timeline-item">
                          <div className={`timeline-marker ${log.jenis === 'prestasi' ? 'positive' : 'negative'}`}>
                            <ShieldAlert style={{ width: '16px', height: '16px' }} />
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <span className="timeline-title">{log.keterangan}</span>
                              <span className={`badge ${log.jenis === 'prestasi' ? 'badge-success' : 'badge-danger'}`}>
                                {log.poin > 0 ? `+${log.poin}` : log.poin}
                              </span>
                            </div>
                            <div className="timeline-date">{log.tanggal}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Bersih. Mahasiswa belum memiliki rekap catatan pelanggaran.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  Pilih Mahasiswa pada form di sebelah kiri untuk melihat rekap riwayat poin kepribadian asrama.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. SETTINGS & SEMESTER CONFIG */}
      {activeMenu === 'semester' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Konfigurasi Tahun Akademik</h2>
              <p className="page-subtitle">
                {currentRole === 'admin' 
                  ? 'Melihat semester aktif, masa pengisian KRS online, dan tarif UKT dasar (BAK Monitoring).' 
                  : 'Atur semester aktif, masa pengisian KRS online, dan tarif UKT dasar.'}
              </p>
            </div>
          </div>

          <div className="glass-card glow-blue" style={{ maxWidth: '600px' }}>
            <div className="card-header-clean">
              <h3 className="card-title"><SettingsIcon /> Pengaturan Global</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Tahun Ajaran / Semester Aktif:</label>
              <input 
                type="text" 
                value={tempSettings.tahun_ajaran_aktif} 
                onChange={(e) => setTempSettings({ ...tempSettings, tahun_ajaran_aktif: e.target.value })}
                className="form-control"
                disabled={currentRole === 'admin'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Masa Pengisian KRS Online:</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button 
                  onClick={() => { if (currentRole !== 'admin') setTempSettings({ ...tempSettings, krs_open: true }) }}
                  className={`btn ${tempSettings.krs_open ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  disabled={currentRole === 'admin'}
                >
                  <Check className="menu-icon" /> Buka Periode KRS
                </button>
                <button 
                  onClick={() => { if (currentRole !== 'admin') setTempSettings({ ...tempSettings, krs_open: false }) }}
                  className={`btn ${!tempSettings.krs_open ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  disabled={currentRole === 'admin'}
                >
                  ✕ Tutup Periode KRS
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tarif UKT Dasar (Rata-rata):</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)', fontSize: '14px' }}>Rp</span>
                <input 
                  type="number" 
                  value={tempSettings.tarif_ukt} 
                  onChange={(e) => setTempSettings({ ...tempSettings, tarif_ukt: parseInt(e.target.value) || 0 })}
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  disabled={currentRole === 'admin'}
                />
              </div>
            </div>

            {currentRole !== 'admin' && (
              <button onClick={handleSaveSettings} className="btn btn-success" style={{ width: '100%', marginTop: '12px' }}>
                <Save className="menu-icon" /> Simpan Pengaturan
              </button>
            )}
          </div>
        </div>
      )}

      {/* Persetujuan Ka. Prodi */}
      {activeMenu === 'krs-prodi' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Persetujuan Ka. Prodi</h2>
              <p className="page-subtitle">Verifikasi akhir dan persetujuan Kartu Rencana Studi (KRS) taruna oleh Kepala Program Studi.</p>
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
                              {currentRole !== 'admin' ? (
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
    </div>
  );
}
