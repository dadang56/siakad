import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  CheckSquare,
  CreditCard, 
  Download, 
  FileText, 
  AlertTriangle, 
  Info, 
  Printer, 
  ShieldAlert, 
  TrendingUp, 
  User 
} from 'lucide-react';

export default function TarunaPortal({ 
  currentUser, 
  activeMenu, 
  matakuliahList, 
  kelasList, 
  krsList, 
  nilaiList, 
  presensiList, 
  dosenList, 
  settings, 
  onSaveKrs, 
  onPayUkt,
  onPrintKhs
}) {
  
  const [selectedKelasIds, setSelectedKelasIds] = useState([]);
  const [showPrintKrs, setShowPrintKrs] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(4);

  const getTarifForSemester = (sem) => {
    const key = String(sem || 1);
    if (settings?.tarif_per_semester && settings.tarif_per_semester[key]) {
      return settings.tarif_per_semester[key];
    }
    return settings?.tarif_ukt || 4500000;
  };

  // Retrieve current KRS
  const currentKrs = krsList.find(krs => krs.nim === currentUser.nim && krs.tahun_ajaran === settings.tahun_ajaran_aktif);
  
  // Retrieve Dosen Wali
  const dosenWali = dosenList.find(d => d.nidn === currentUser.dosen_wali_nidn);

  // Initialize selected courses when KRS is loaded (Sistem Paket)
  React.useEffect(() => {
    if (currentKrs && currentKrs.kelas_ids && currentKrs.kelas_ids.length > 0) {
      setSelectedKelasIds(currentKrs.kelas_ids);
    } else {
      const packageKelasIds = kelasList
        .filter(kelas => {
          const mk = matakuliahList.find(m => m.kode === kelas.matakuliah_kode);
          return mk && mk.prodi === currentUser.prodi && mk.semester === currentUser.semester;
        })
        .map(kelas => kelas.id);
      setSelectedKelasIds(packageKelasIds);
    }
  }, [currentKrs, currentUser, kelasList, matakuliahList]);

  // Max SKS logic based on previous IPS
  const getMaxSks = (ips) => {
    if (ips >= 3.0) return 24;
    if (ips >= 2.5) return 21;
    if (ips >= 2.0) return 18;
    return 15;
  };
  const maxSks = getMaxSks(currentUser.ips_prev);

  // Calculate current selected SKS
  const getSelectedSks = () => {
    return selectedKelasIds.reduce((total, kid) => {
      const kelas = kelasList.find(k => k.id === kid);
      if (kelas) {
        const mk = matakuliahList.find(m => m.kode === kelas.matakuliah_kode);
        return total + (mk ? mk.sks : 0);
      }
      return total;
    }, 0);
  };
  const selectedSks = getSelectedSks();

  // Handle course selection
  const handleToggleCourse = (kelasId, courseSks) => {
    const isSelected = selectedKelasIds.includes(kelasId);
    if (isSelected) {
      setSelectedKelasIds(selectedKelasIds.filter(id => id !== kelasId));
    } else {
      if (selectedSks + courseSks > maxSks) {
        alert(`Batas SKS Anda adalah ${maxSks}. SKS yang Anda pilih melebihi batas.`);
        return;
      }
      setSelectedKelasIds([...selectedKelasIds, kelasId]);
    }
  };

  // Submit KRS
  const handleSubmitKrs = () => {
    if (selectedKelasIds.length === 0) {
      alert("Pilih minimal 1 mata kuliah.");
      return;
    }
    onSaveKrs(currentUser.nim, selectedKelasIds, 'Menunggu Persetujuan');
  };

  // Get active courses for scheduling
  const getApprovedClasses = () => {
    if (currentKrs && currentKrs.status === 'Disetujui Ka. Prodi') {
      return currentKrs.kelas_ids.map(kid => {
        const kelas = kelasList.find(k => k.id === kid);
        const mk = matakuliahList.find(m => m.kode === kelas.matakuliah_kode);
        const dosen = dosenList.find(d => d.nidn === kelas.dosen_nidn);
        return { ...kelas, matakuliah: mk, dosen };
      }).filter(c => c.matakuliah);
    }
    return [];
  };
  const approvedClasses = getApprovedClasses();

  // Grade point mapping
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

  // Grades for current or historical semester
  const getGradesForSemester = (sem) => {
    if (sem === 4) {
      // Current semester: grades entered by lecturers
      return nilaiList.filter(n => n.nim === currentUser.nim && n.semester === 4);
    } else {
      // History (Smt 3)
      return nilaiList.filter(n => n.nim === currentUser.nim && n.semester === 3);
    }
  };
  const semesterGrades = getGradesForSemester(selectedSemester);

  // Calculate IPS (Semester GPA)
  const calculateIPS = (grades) => {
    if (grades.length === 0) return 0;
    let totalBobotSks = 0;
    let totalSks = 0;
    grades.forEach(g => {
      totalBobotSks += getBobot(g.nilai_huruf) * g.sks;
      totalSks += g.sks;
    });
    return totalSks > 0 ? (totalBobotSks / totalSks).toFixed(2) : 0;
  };
  const calculatedIPS = calculateIPS(semesterGrades);

  // RENDER PORTAL PANELS
  return (
    <div>
      {/* 1. DASHBOARD MENU */}
      {activeMenu === 'dashboard' && (
        <div className="animate-fade-in">
          {/* Welcome Banner */}
          <div className="glass-card glow-cyan" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(29, 78, 216, 0.15) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '8px' }}>Semester Aktif: {settings.tahun_ajaran_aktif}</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Selamat Datang, {currentUser.nama}!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Program Studi: {currentUser.prodi} | Angkatan {currentUser.angkatan}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status Registrasi</div>
                <span className={`badge ${currentUser.status_ukt === 'Lunas' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '13px', padding: '6px 14px', marginTop: '4px' }}>
                  {currentUser.status_ukt === 'Lunas' ? 'Tarif Mahasiswa Lunas / Aktif' : 'Tarif Mahasiswa Belum Bayar'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="metrics-grid">
            <div className="glass-card metric-card glow-blue">
              <div className="metric-icon-wrapper blue">
                <TrendingUp />
              </div>
              <div className="metric-content">
                <span className="metric-value">{currentUser.ipk}</span>
                <span className="metric-label">IP Kumulatif (IPK)</span>
              </div>
            </div>
            
            <div className="glass-card metric-card glow-cyan">
              <div className="metric-icon-wrapper cyan">
                <Award />
              </div>
              <div className="metric-content">
                <span className="metric-value">{currentUser.ips_prev}</span>
                <span className="metric-label">IP Semester Lalu (IPS)</span>
              </div>
            </div>

            <div className="glass-card metric-card glow-gold">
              <div className="metric-icon-wrapper gold">
                <ShieldAlert />
              </div>
              <div className="metric-content">
                <span className="metric-value">{currentUser.poin_ketarunaan}</span>
                <span className="metric-label">Poin Kemahasiswaan</span>
              </div>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-icon-wrapper success">
                <BookOpen />
              </div>
              <div className="metric-content">
                <span className="metric-value">{currentKrs && currentKrs.status === 'Disetujui Ka. Prodi' ? selectedSks : 0} SKS</span>
                <span className="metric-label">SKS Diambil Smt ini</span>
              </div>
            </div>
          </div>

          {/* Detailed Dashboard Grid */}
          <div className="dashboard-layout">
            {/* Left side: Points and Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Poin Kemahasiswaan */}
              <div className="glass-card glow-gold">
                <div className="card-header-clean">
                  <h3 className="card-title" style={{ color: 'var(--accent)' }}>
                    <ShieldAlert /> Catatan Poin Kemahasiswaan (Disiplin & Prestasi)
                  </h3>
                  <span className="badge badge-warning">Aktif</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Sebagai Mahasiswa Poltektrans SDP Palembang, Anda wajib memelihara poin kepribadian. Poin awal adalah 100. Poin minimal kelulusan/yudisium adalah 75.
                </p>
                <div className="timeline">
                  {currentUser.riwayat_poin.length > 0 ? (
                    currentUser.riwayat_poin.map((log) => (
                      <div key={log.id} className="timeline-item">
                        <div className={`timeline-marker ${log.jenis === 'prestasi' ? 'positive' : 'negative'}`}>
                          <Award style={{ width: '16px', height: '16px' }} />
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-title">{log.keterangan}</span>
                            <span className={`badge ${log.jenis === 'prestasi' ? 'badge-success' : 'badge-danger'}`}>
                              {log.poin > 0 ? `+${log.poin}` : log.poin} Poin
                            </span>
                          </div>
                          <div className="timeline-date">{log.tanggal}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Belum ada catatan pelanggaran atau prestasi. Pertahankan disiplin!</div>
                  )}
                </div>
              </div>

              {/* Progress chart */}
              <div className="glass-card">
                <div className="card-header-clean">
                  <h3 className="card-title"><TrendingUp /> Grafik Nilai Akademik</h3>
                </div>
                <div className="grade-chart-container">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar-fill" style={{ height: '70%' }} data-val="3.40"></div>
                    <span className="chart-label">Smt 1</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar-fill" style={{ height: '78%' }} data-val="3.58"></div>
                    <span className="chart-label">Smt 2</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar-fill" style={{ height: '82%' }} data-val="3.75"></div>
                    <span className="chart-label">Smt 3</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar-fill" style={{ height: `${(currentUser.ipk / 4) * 100}%` }} data-val={currentUser.ipk}></div>
                    <span className="chart-label">Kumulatif</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Grafik perkembangan IPS per semester. Nilai Anda stabil di atas batas rata-rata.</div>
              </div>
            </div>

            {/* Right side: Academic status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="glass-card">
                <div className="card-header-clean">
                  <h3 className="card-title"><Info /> Status Akademik</h3>
                </div>
                <div className="status-list">
                  <div className="status-item">
                    <div className="status-item-info">
                      <span className="status-item-title">Dosen Wali (Bimbingan)</span>
                      <span className="status-item-subtitle">{dosenWali?.nama || 'Belum Ditentukan'}</span>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-item-info">
                      <span className="status-item-title">Status KRS</span>
                      <span className="status-item-subtitle">
                        {currentKrs ? (
                          <span className={`badge ${
                            currentKrs.status === 'Disetujui Ka. Prodi' ? 'badge-success' : 
                            currentKrs.status === 'Disetujui Dosen Wali' ? 'badge-info' : 
                            currentKrs.status.includes('Menunggu') ? 'badge-warning' : 
                            currentKrs.status === 'Ditolak' ? 'badge-danger' : 'badge-info'
                          }`}>
                            {currentKrs.status}
                          </span>
                        ) : 'Belum Mengajukan'}
                      </span>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-item-info">
                      <span className="status-item-title">Kehadiran Rata-rata</span>
                      <span className="status-item-subtitle">96.8% (Syarat Ujian: 75%)</span>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-item-info">
                      <span className="status-item-title">Status Mahasiswa</span>
                      <span className="status-item-subtitle"><span className="badge badge-success">Aktif</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick info SDP */}
              <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Pengumuman Kampus</h4>
                <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-body)' }}>
                  Seluruh Mahasiswa Semester 4 wajib mengikuti Ujian Sertifikat Kompetensi Laut/Darat (Basic Safety Training) di Lab Simulator Poltektrans SDP mulai tanggal 12 Juni 2026. Harap lengkapi berkas di Adm. Akademik.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KRS PORTAL */}
      {activeMenu === 'krs' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Kartu Rencana Studi (KRS)</h2>
              <p className="page-subtitle">Penyusunan mata kuliah semester {currentUser.semester} ({settings.tahun_ajaran_aktif})</p>
            </div>
            {currentKrs && currentKrs.status === 'Disetujui Ka. Prodi' && (
              <button onClick={() => setShowPrintKrs(true)} className="btn btn-secondary btn-sm">
                <Printer className="menu-icon" /> Cetak KRS
              </button>
            )}
          </div>

          {/* UKT check */}
          {currentUser.status_ukt !== 'Lunas' ? (
            <div className="custom-alert custom-alert-warning">
              <AlertTriangle className="custom-alert-icon" />
              <div>
                <strong>Akses KRS Ditutup:</strong> Tarif Mahasiswa Anda terdeteksi belum lunas untuk semester ini. Silakan lakukan pembayaran di menu <strong>Keuangan (Tarif Mahasiswa)</strong> terlebih dahulu untuk membuka pengisian KRS.
              </div>
            </div>
          ) : (
            <>
              {/* KRS Status Alerts */}
              {/* KRS Status Alerts */}
              {currentKrs && currentKrs.status === 'Menunggu Persetujuan' && (
                <div className="custom-alert custom-alert-info">
                  <Info className="custom-alert-icon" />
                  <div>
                    <strong>KRS Diajukan:</strong> Usulan rencana studi Anda telah diajukan ke Dosen Wali <strong>{dosenWali?.nama}</strong>. Silakan tunggu persetujuan dosen wali Anda.
                  </div>
                </div>
              )}


              {currentKrs && currentKrs.status === 'Menunggu Persetujuan Ka. Prodi' && (
                <div className="custom-alert custom-alert-info">
                  <Info className="custom-alert-icon" />
                  <div>
                    <strong>KRS Menunggu Persetujuan Ka. Prodi:</strong> Usulan rencana studi Anda sedang ditinjau oleh Kepala Program Studi.
                  </div>
                </div>
              )}

              {currentKrs && currentKrs.status === 'Disetujui Ka. Prodi' && (
                <div className="custom-alert custom-alert-success">
                  <CheckCircle className="custom-alert-icon" />
                  <div>
                    <strong>KRS Disetujui Ka. Prodi:</strong> Rencana studi Anda telah disetujui oleh Kepala Program Studi (Ka. Prodi). Selamat memulai perkuliahan! Jadwal & presensi Anda sekarang aktif.
                  </div>
                </div>
              )}

              {currentKrs && currentKrs.status === 'Ditolak' && (
                <div className="custom-alert custom-alert-warning">
                  <AlertTriangle className="custom-alert-icon" />
                  <div>
                    <strong>KRS Dikembalikan/Ditolak:</strong> Pengajuan KRS Anda dikembalikan dengan catatan: 
                    <p style={{ marginTop: '6px', fontWeight: 'bold', color: 'var(--accent)' }}>"{currentKrs.catatan_dosen}"</p>
                    Silakan sesuaikan kembali pilihan mata kuliah Anda di bawah ini dan ajukan ulang.
                  </div>
                </div>
              )}

              {/* Main KRS Editor Grid */}
              <div className="dashboard-layout">
                {/* Available Classes list */}
                <div className="glass-card">
                  <div className="card-header-clean">
                    <h3 className="card-title">Paket Mata Kuliah Wajib - {currentUser.prodi}</h3>
                    <span className="badge badge-info">Semester {currentUser.semester}</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Sistem KRS menggunakan sistem paket. Seluruh mata kuliah di bawah ini otomatis didaftarkan untuk semester ini.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {kelasList
                      .filter(kelas => {
                        const mk = matakuliahList.find(m => m.kode === kelas.matakuliah_kode);
                        return mk && mk.prodi === currentUser.prodi && mk.semester === currentUser.semester;
                      })
                      .map(kelas => {
                        const mk = matakuliahList.find(m => m.kode === kelas.matakuliah_kode);
                        const dosen = dosenList.find(d => d.nidn === kelas.dosen_nidn);

                        return (
                          <div 
                            key={kelas.id} 
                            className="course-selection-card selected"
                            style={{ cursor: 'default' }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ color: 'var(--text-main)' }}>{mk.nama}</strong>
                                <span className="badge badge-primary">{mk.kode}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                SKS: {mk.sks} | Jadwal: {kelas.hari}, {kelas.jam} | Ruang: {kelas.ruang}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--secondary)', marginTop: '2px' }}>
                                Dosen: {dosen?.nama}
                              </div>
                            </div>
                            
                            <div className="badge badge-success" style={{ background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', fontSize: '11px', borderRadius: '4px', fontWeight: 'bold' }}>
                              ✓ Paket Wajib
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* SKS Summary Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card glow-blue">
                    <div className="card-header-clean">
                      <h3 className="card-title"><FileText /> Ringkasan KRS</h3>
                    </div>
                    <div className="status-list" style={{ marginBottom: '24px' }}>
                      <div className="status-item">
                        <span>IP Semester Lalu (IPS)</span>
                        <strong>{currentUser.ips_prev}</strong>
                      </div>
                      <div className="status-item">
                        <span>Batas Maksimal SKS</span>
                        <strong className="badge badge-success" style={{ fontSize: '13px' }}>{maxSks} SKS</strong>
                      </div>
                      <div className="status-item">
                        <span>SKS yang Dipilih</span>
                        <strong style={{ color: selectedSks > maxSks ? 'var(--danger)' : 'var(--text-main)', fontSize: '16px' }}>{selectedSks} SKS</strong>
                      </div>
                      <div className="status-item">
                        <span>Sisa Kuota SKS</span>
                        <strong>{maxSks - selectedSks} SKS</strong>
                      </div>
                    </div>

                    {(!currentKrs || currentKrs.status === 'Draft' || currentKrs.status === 'Ditolak') ? (
                      <button 
                        onClick={handleSubmitKrs}
                        disabled={selectedSks === 0}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        Ajukan ke Dosen Pembimbing Akademik
                      </button>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status Pengajuan:</span>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--accent)', marginTop: '2px' }}>{currentKrs.status}</div>
                      </div>
                    )}
                  </div>

                  <div className="glass-card">
                    <h4 style={{ marginBottom: '8px' }}>Petunjuk Pengisian</h4>
                    <ul style={{ fontSize: '12px', paddingLeft: '16px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                      <li>Pilih mata kuliah sesuai dengan paket kurikulum semester berjalan.</li>
                      <li>Pastikan jadwal kuliah tidak bertabrakan dengan kelas praktikum lainnya.</li>
                      <li>Konsultasikan rencana studi dengan Dosen Wali Anda secara berkala.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. KHS & TRANSKRIP PORTAL */}
      {activeMenu === 'khs' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Hasil Studi & Transkrip</h2>
              <p className="page-subtitle">Pantau nilai ujian, IPS, IPK, dan riwayat akademis Mahasiswa.</p>
            </div>
          </div>

          <div className="tabs-container">
            <button 
              className={`tab-btn ${selectedSemester !== 'transkrip' ? 'active' : ''}`}
              onClick={() => setSelectedSemester(4)}
            >
              Kartu Hasil Studi (KHS)
            </button>
            <button 
              className={`tab-btn ${selectedSemester === 'transkrip' ? 'active' : ''}`}
              onClick={() => setSelectedSemester('transkrip')}
            >
              Transkrip Nilai Kumulatif
            </button>
          </div>

          {selectedSemester !== 'transkrip' ? (
            <div>
              {/* Semester Selector */}
              <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Pilih Semester KHS:</span>
                    <select 
                      value={selectedSemester} 
                      onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                      className="form-control"
                      style={{ width: '150px', padding: '6px 12px' }}
                    >
                      <option value={3}>Semester 3</option>
                      <option value={4}>Semester 4 (Aktif)</option>
                    </select>
                  </div>
                   {semesterGrades.length > 0 && (
                    <button 
                      onClick={() => {
                        const totalSks = semesterGrades.reduce((sum, g) => sum + (g.sks || 0), 0);
                        const totalSksBobot = semesterGrades.reduce((sum, g) => sum + ((g.sks || 0) * getBobot(g.nilai_huruf)), 0);
                        onPrintKhs({
                          student: {
                            nama: currentUser.nama,
                            nim_nip: currentUser.nim
                          },
                          grades: semesterGrades.map(g => ({
                            ...g,
                            nama_mk: g.nama_mk || matakuliahList.find(m => m.kode === g.matakuliah_kode)?.nama || 'Mata Kuliah'
                          })),
                          semester: selectedSemester,
                          tahun_ajaran: settings.tahun_ajaran_aktif,
                          totalSks,
                          totalSksBobot,
                          ips: calculatedIPS,
                          prodiName: currentUser.prodi,
                          angkatan: currentUser.angkatan || '36'
                        });
                      }} 
                      className="btn btn-secondary btn-sm"
                    >
                      <Printer className="menu-icon" /> Cetak KHS
                    </button>
                  )}
                </div>
              </div>

              {/* Grades Table */}
              <div className="glass-card">
                <div className="card-header-clean">
                  <h3 className="card-title">KHS - Semester {selectedSemester}</h3>
                  <span className="badge badge-info">IPS: {calculatedIPS}</span>
                </div>

                {semesterGrades.length > 0 ? (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Kode MK</th>
                          <th>Mata Kuliah</th>
                          <th style={{ textAlign: 'center' }}>SKS</th>
                          {selectedSemester === 4 && <th style={{ textAlign: 'center' }}>Tugas (20%)</th>}
                          {selectedSemester === 4 && <th style={{ textAlign: 'center' }}>UTS (25%)</th>}
                          {selectedSemester === 4 && <th style={{ textAlign: 'center' }}>UAS (30%)</th>}
                          {selectedSemester === 4 && <th style={{ textAlign: 'center' }}>Praktek (25%)</th>}
                          <th style={{ textAlign: 'center' }}>Nilai Akhir</th>
                          <th style={{ textAlign: 'center' }}>Nilai Huruf</th>
                          <th style={{ textAlign: 'center' }}>Bobot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterGrades.map((g, idx) => (
                          <tr key={idx}>
                            <td>{g.matakuliah_kode}</td>
                            <td>{g.nama_mk || matakuliahList.find(m => m.kode === g.matakuliah_kode)?.nama || 'Mata Kuliah'}</td>
                            <td style={{ textAlign: 'center' }}>{g.sks}</td>
                            {selectedSemester === 4 && <td style={{ textAlign: 'center' }}>{g.tugas || '-'}</td>}
                            {selectedSemester === 4 && <td style={{ textAlign: 'center' }}>{g.uts || '-'}</td>}
                            {selectedSemester === 4 && <td style={{ textAlign: 'center' }}>{g.uas || '-'}</td>}
                            {selectedSemester === 4 && <td style={{ textAlign: 'center' }}>{g.praktek || '-'}</td>}
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{g.nilai_akhir ? g.nilai_akhir.toFixed(1) : '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`badge ${g.nilai_huruf === 'A' ? 'badge-success' : g.nilai_huruf?.startsWith('B') ? 'badge-primary' : 'badge-warning'}`}>
                                {g.nilai_huruf || 'Belum Input'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>{g.nilai_huruf ? getBobot(g.nilai_huruf).toFixed(1) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <Info style={{ width: '40px', height: '40px', margin: '0 auto 12px auto', display: 'block', color: 'var(--warning)' }} />
                    <p style={{ fontWeight: '600' }}>Nilai belum dimasukkan atau divalidasi</p>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Dosen pengampu kelas Anda belum melakukan entri nilai untuk semester berjalan ini.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Transkrip Nilai Kumulatif */
            <div className="glass-card animate-fade-in">
              <div className="card-header-clean">
                <h3 className="card-title">Transkrip Nilai Akademik Kumulatif</h3>
                <div>
                  <span className="badge badge-success" style={{ fontSize: '13px', padding: '6px 14px' }}>IPK: {currentUser.ipk}</span>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kode MK</th>
                      <th>Mata Kuliah</th>
                      <th style={{ textAlign: 'center' }}>Semester</th>
                      <th style={{ textAlign: 'center' }}>SKS</th>
                      <th style={{ textAlign: 'center' }}>Nilai Akhir</th>
                      <th style={{ textAlign: 'center' }}>Nilai Huruf</th>
                      <th style={{ textAlign: 'center' }}>Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nilaiList.filter(n => n.nim === currentUser.nim).map((g, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{g.matakuliah_kode}</td>
                        <td>{g.nama_mk || matakuliahList.find(m => m.kode === g.matakuliah_kode)?.nama || 'Mata Kuliah'}</td>
                        <td style={{ textAlign: 'center' }}>{g.semester}</td>
                        <td style={{ textAlign: 'center' }}>{g.sks}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{g.nilai_akhir}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${g.nilai_huruf === 'A' ? 'badge-success' : g.nilai_huruf?.startsWith('B') ? 'badge-primary' : 'badge-warning'}`}>
                            {g.nilai_huruf}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>{getBobot(g.nilai_huruf).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)' }}>
                Total SKS Kumulatif Lulus: <strong>{nilaiList.filter(n => n.nim === currentUser.nim).reduce((tot, cur) => tot + cur.sks, 0)} SKS</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. JADWAL PEMBELAJARAN */}
      {activeMenu === 'jadwal' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Jadwal Pembelajaran</h2>
              <p className="page-subtitle">Jadwal perkuliahan mingguan mahasiswa aktif semester ini.</p>
            </div>
          </div>

          {currentKrs && currentKrs.status === 'Disetujui Ka. Prodi' ? (
            <div className="glass-card">
              <div className="card-header-clean">
                <h3 className="card-title"><Calendar /> Jadwal Kuliah Semester Ini</h3>
              </div>
              {approvedClasses.length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Hari</th>
                        <th>Mata Kuliah</th>
                        <th>Waktu</th>
                        <th>Ruang</th>
                        <th>Dosen Pengampu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedClasses.map((cl, idx) => (
                        <tr key={idx}>
                          <td><strong>{cl.hari}</strong></td>
                          <td>
                            <div>{cl.matakuliah.nama}</div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cl.id}</span>
                          </td>
                          <td>{cl.jam}</td>
                          <td><span className="badge badge-info">{cl.ruang}</span></td>
                          <td style={{ fontSize: '13px' }}>{cl.dosen?.nama}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  KRS Anda disetujui tetapi tidak ada mata kuliah terpasang. Hubungi Adm. Akademik.
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
              <Calendar style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 16px auto', display: 'block' }} />
              <h3>Jadwal Belum Tersedia</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', maxWidth: '450px', margin: '8px auto 0 auto' }}>
                Jadwal kuliah akan aktif setelah KRS Anda diajukan dan <strong>Disetujui oleh Ka. Prodi</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4.5. PRESENSI */}
      {activeMenu === 'presensi' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Presensi Kehadiran</h2>
              <p className="page-subtitle">Statistik rekapitulasi kehadiran kelas Mahasiswa semester berjalan.</p>
            </div>
          </div>

          {currentKrs && currentKrs.status === 'Disetujui Ka. Prodi' ? (
            <div className="glass-card glow-cyan" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="card-header-clean">
                <h3 className="card-title">Rekapitulasi Kehadiran</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Ketentuan akademik Poltektrans SDP Palembang mewajibkan minimal kehadiran <strong>75%</strong> untuk dapat mengikuti ujian semester.
              </p>

              <div className="status-list">
                {approvedClasses.map((cl, idx) => {
                  const pres = presensiList.find(p => p.nim === currentUser.nim && p.kelas_id === cl.id) || 
                    { total_pertemuan: 16, hadir: 16, sakit: 0, izin: 0, alfa: 0 };
                  
                  const attendancePercent = ((pres.hadir / pres.total_pertemuan) * 100).toFixed(0);
                  const belowThreshold = attendancePercent < 75;

                  return (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{cl.matakuliah.nama}</span>
                        <span style={{ fontWeight: 'bold', color: belowThreshold ? 'var(--danger)' : 'var(--success)' }}>
                          {attendancePercent}% ({pres.hadir}/{pres.total_pertemuan})
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            background: belowThreshold ? 'var(--danger)' : 'var(--secondary)', 
                            width: `${attendancePercent}%`,
                            borderRadius: '3px'
                          }}
                        ></div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Hadir: {pres.hadir}</span>
                        <span>Sakit: {pres.sakit}</span>
                        <span>Izin: {pres.izin}</span>
                        <span>Alfa: {pres.alfa}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
              <CheckSquare style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 16px auto', display: 'block' }} />
              <h3>Daftar Presensi Belum Aktif</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', maxWidth: '450px', margin: '8px auto 0 auto' }}>
                Nama Anda akan dimasukkan ke dalam daftar absensi kelas setelah KRS disetujui oleh Kepala Program Studi (Ka. Prodi).
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. KEUANGAN PORTAL */}
      {activeMenu === 'keuangan' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Pembayaran Keuangan</h2>
              <p className="page-subtitle">Tarif Mahasiswa Politeknik Transportasi SDP Palembang</p>
            </div>
          </div>

          <div className="dashboard-layout">
            {/* Tagihan Card */}
            <div className="glass-card glow-blue">
              <div className="card-header-clean">
                <h3 className="card-title"><CreditCard /> Informasi Tagihan Semester Ini</h3>
                <span className={`badge ${currentUser.status_ukt === 'Lunas' ? 'badge-success' : 'badge-warning'}`}>
                  {currentUser.status_ukt === 'Lunas' ? 'Lunas' : 'Belum Dibayar'}
                </span>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mata Anggaran Pembayaran</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>Tarif Mahasiswa Program Studi {currentUser.prodi}</div>
                <div style={{ fontSize: '28px', fontFamily: 'Outfit', fontWeight: '800', color: 'var(--accent)', marginTop: '8px' }}>
                  Rp {getTarifForSemester(currentUser.semester).toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Batas Pembayaran: 15 Juni 2026</div>
              </div>

              {currentUser.status_ukt !== 'Lunas' ? (
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Pembayaran Tarif Mahasiswa dilakukan secara Virtual Account Bank Mandiri/BNI. Setelah Anda melakukan pembayaran, silakan hubungi <strong>Admin Keuangan / Bendahara Kampus</strong> untuk melakukan konfirmasi verifikasi manual di sistem agar status keuangan Anda diaktifkan dan membuka kunci pengisian KRS.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                    <AlertTriangle style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px' }}><strong>Perhatian:</strong> Akses pengisian KRS Anda terkunci hingga pembayaran diverifikasi oleh Admin Keuangan.</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                  <CheckCircle style={{ width: '20px', height: '20px' }} />
                  <strong>Pembayaran Lunas. Status keuangan aktif untuk semester ini.</strong>
                </div>
              )}
            </div>

            {/* Riwayat Pembayaran */}
            <div className="glass-card">
              <div className="card-header-clean">
                <h3 className="card-title">Riwayat Transaksi</h3>
              </div>
              <div className="status-list">
                <div className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-title">Tarif Mahasiswa Semester {currentUser.semester || 4}</span>
                    <span className="status-item-subtitle">{currentUser.status_ukt === 'Lunas' ? 'Lunas - VA Mandiri' : 'Menunggu Pembayaran'}</span>
                  </div>
                  <span className={`badge ${currentUser.status_ukt === 'Lunas' ? 'badge-success' : 'badge-warning'}`}>
                    {currentUser.status_ukt === 'Lunas' ? 'Success' : 'Pending'}
                  </span>
                </div>
                <div className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-title">Tarif Mahasiswa Semester 3</span>
                    <span className="status-item-subtitle">Lunas - 15 Des 2025</span>
                  </div>
                  <span className="badge badge-success">Success</span>
                </div>
                <div className="status-item">
                  <div className="status-item-info">
                    <span className="status-item-title">Tarif Mahasiswa Semester 2</span>
                    <span className="status-item-subtitle">Lunas - 10 Jun 2025</span>
                  </div>
                  <span className="badge badge-success">Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOCK PRINT KRS MODAL */}
      {showPrintKrs && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', background: 'white', color: '#1e293b' }}>
            <div className="modal-header" style={{ borderColor: '#e2e8f0' }}>
              <h3 style={{ color: '#0f172a' }}>KRS Cetak Preview</h3>
              <button onClick={() => setShowPrintKrs(false)} className="btn-close" style={{ color: '#64748b' }}>✕</button>
            </div>
            <div className="modal-body print-container">
              <div className="print-header">
                <div className="print-title">Politeknik Transportasi SDP Palembang</div>
                <div className="print-subtitle">Kementerian Perhubungan Republik Indonesia</div>
                <div style={{ fontSize: '10px', marginTop: '4px' }}>Jl. Sabar Jaya No.116, Perajen, Banyuasin, Sumatera Selatan</div>
              </div>
              <div style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '20px' }}>
                KARTU RENCANA STUDI (KRS)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '20px' }}>
                <div>
                  <div>NIM: <strong>{currentUser.nim}</strong></div>
                  <div>Nama: <strong>{currentUser.nama}</strong></div>
                  <div>Prodi: <strong>{currentUser.prodi}</strong></div>
                </div>
                <div>
                  <div>Tahun Ajaran: <strong>{settings.tahun_ajaran_aktif}</strong></div>
                  <div>Semester: <strong>{currentUser.semester}</strong></div>
                  <div>Dosen Wali: <strong>{dosenWali?.nama}</strong></div>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0f172a', borderTop: '2px solid #0f172a' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>No</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Kode MK</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Mata Kuliah</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>SKS</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Hari & Jam</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedKelasIds.map((kid, idx) => {
                    const kelas = kelasList.find(k => k.id === kid);
                    const mk = matakuliahList.find(m => m.kode === kelas.matakuliah_kode);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px' }}>{idx + 1}</td>
                        <td style={{ padding: '8px' }}>{mk.kode}</td>
                        <td style={{ padding: '8px' }}>{mk.nama}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{mk.sks}</td>
                        <td style={{ padding: '8px' }}>{kelas.hari}, {kelas.jam}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', textAlign: 'center', fontSize: '11px', marginTop: '40px' }}>
                <div>
                  <div>Menyetujui,</div>
                  <div style={{ marginTop: '50px', fontWeight: 'bold' }}>({dosenWali?.nama})</div>
                  <div>Dosen Wali</div>
                </div>
                <div>
                  <div>Palembang, {new Date().toLocaleDateString('id-ID')}</div>
                  <div style={{ marginTop: '50px', fontWeight: 'bold' }}>({currentUser.nama})</div>
                  <div>Mahasiswa</div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Printer className="menu-icon" /> Print PDF
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowPrintKrs(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Print modals end */}
    </div>
  );
}
