import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Clock,
  Calendar,
  AlertTriangle,
  Edit
} from 'lucide-react';

export default function KeuanganPortal({
  activeMenu,
  tarunaList,
  settings,
  onConfirmUkt,
  onUpdateSettings
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [prodiFilter, setProdiFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [tarifMahasiswa, setTarifMahasiswa] = useState(settings.tarif_ukt || 0);

  useEffect(() => {
    setTarifMahasiswa(settings.tarif_ukt || 0);
  }, [settings.tarif_ukt]);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTaruna, setEditingTaruna] = useState(null);
  const [editStatus, setEditStatus] = useState('Belum Lunas');
  const [editKeterangan, setEditKeterangan] = useState('');

  // Live Date and Time State
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calculations
  const tarifUkt = settings.tarif_ukt || 5000000;
  
  const prodis = [
    { name: 'D-III Nautika', color: 'var(--secondary)' },
    { name: 'D-III Permesinan Kapal', color: 'var(--accent)' },
    { name: 'D-III Manajemen Transportasi Perairan Daratan (MTPD)', color: 'var(--primary-light)' }
  ];

  const prodiStats = prodis.map(prodi => {
    const list = tarunaList.filter(t => t.prodi === prodi.name);
    const total = list.length;
    const lunas = list.filter(t => t.status_ukt === 'Lunas').length;
    const belumLunas = total - lunas;
    return { ...prodi, total, lunas, belumLunas };
  });

  // Overall totals
  const totalTaruna = tarunaList.length;
  const totalLunas = tarunaList.filter(t => t.status_ukt === 'Lunas').length;
  const totalBelumLunas = totalTaruna - totalLunas;

  // Filter Taruna list
  const filteredTarunas = tarunaList.filter(t => {
    const matchesSearch = t.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.nim.includes(searchTerm);
    const matchesProdi = prodiFilter === 'all' || t.prodi === prodiFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'Lunas' && t.status_ukt === 'Lunas') ||
                          (statusFilter === 'Belum Lunas' && t.status_ukt !== 'Lunas');
    return matchesSearch && matchesProdi && matchesStatus;
  });

  const handleOpenEdit = (t) => {
    setEditingTaruna(t);
    setEditStatus(t.status_ukt);
    setEditKeterangan(t.keterangan_pembayaran || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingTaruna) {
      onConfirmUkt(editingTaruna.nim, editStatus, editKeterangan);
      setShowEditModal(false);
      setEditingTaruna(null);
      alert("Detail pembayaran berhasil diperbarui!");
    }
  };

  return (
    <div className="portal-container">
      {/* 1. DASHBOARD OVERVIEW */}
      {activeMenu === 'dashboard' && (
        <div className="animate-fade-in">
          {/* Header & Live DateTime */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
            <div>
              <h1 className="page-title">Dashboard Keuangan</h1>
              <p className="page-subtitle">Ringkasan status pembayaran Tarif Mahasiswa per Program Studi.</p>
            </div>
            
            {/* Live Clock Widget */}
            <div className="glass-card glow-cyan" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--glass-border)' }}>
              <Clock style={{ color: 'var(--secondary)', width: '22px', height: '22px' }} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                  {formatTime(currentDateTime)} WIB
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {formatDate(currentDateTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Prodi Summary Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            {prodiStats.map((p, index) => (
              <div 
                key={index} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  borderTop: `4px solid ${p.color}`,
                  background: 'rgba(30, 41, 59, 0.4)'
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px', minHeight: '38px', lineHeight: '1.4' }}>
                  {p.name}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Mahasiswa</span>
                    <strong style={{ fontSize: '16px', color: 'var(--text-main)' }}>{p.total} Orang</strong>
                  </div>

                  {/* Lunas */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle style={{ width: '14px', height: '14px', color: 'var(--success)' }} /> Sudah Lunas
                    </span>
                    <span className="badge badge-success" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {p.lunas} Orang
                    </span>
                  </div>

                  {/* Belum Lunas */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle style={{ width: '14px', height: '14px', color: 'var(--accent)' }} /> Belum Lunas
                    </span>
                    <span className="badge badge-warning" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {p.belumLunas} Orang
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grand Total Row */}
          <div className="glass-card glow-gold" style={{ padding: '24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', background: 'rgba(245, 158, 11, 0.03)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Mahasiswa Kampus</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalTaruna} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Orang</span></div>
            </div>
            
            <div style={{ width: '1px', background: 'var(--glass-border)' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--success)', marginBottom: '4px', fontWeight: '500' }}>Total Lunas Keseluruhan</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>{totalLunas} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Orang</span></div>
            </div>

            <div style={{ width: '1px', background: 'var(--glass-border)' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px', fontWeight: '500' }}>Total Belum Lunas</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>{totalBelumLunas} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Orang</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VERIFIKASI PEMBAYARAN */}
      {activeMenu === 'verifikasi' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h1 className="page-title">Verifikasi Pembayaran</h1>
              <p className="page-subtitle">Kelola dan konfirmasi status pembayaran Tarif Mahasiswa.</p>
            </div>
          </div>

          {/* Filters Area */}
          <div className="filter-bar glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <div className="search-wrapper" style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '16px' }} />
              <input 
                type="text" 
                placeholder="Cari nama atau NIM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter style={{ width: '14px', color: 'var(--text-muted)' }} />
                <select 
                  value={prodiFilter} 
                  onChange={(e) => setProdiFilter(e.target.value)}
                  style={{ padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                >
                  <option value="all">Semua Program Studi</option>
                  <option value="D-III Nautika">D-III Nautika</option>
                  <option value="D-III Permesinan Kapal">D-III Permesinan Kapal</option>
                  <option value="D-III Manajemen Transportasi Perairan Daratan (MTPD)">D-III MTPD</option>
                </select>
              </div>

              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
              >
                <option value="all">Semua Status Tarif</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="glass-card">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mahasiswa / NIM</th>
                    <th>Program Studi</th>
                    <th>Semester</th>
                    <th>Tarif Mahasiswa</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th>Keterangan</th>
                    <th style={{ textAlign: 'center' }}>Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTarunas.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Tidak ada data mahasiswa yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredTarunas.map((t) => (
                      <tr key={t.nim}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong>{t.nama}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NIM: {t.nim}</span>
                          </div>
                        </td>
                        <td>{t.prodi}</td>
                        <td style={{ textAlign: 'center' }}>Smt {t.semester}</td>
                        <td><strong>Rp {tarifUkt.toLocaleString('id-ID')}</strong></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${t.status_ukt === 'Lunas' ? 'badge-success' : 'badge-warning'}`}>
                            {t.status_ukt === 'Lunas' ? 'Lunas' : 'Belum Lunas'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: t.status_ukt === 'Lunas' ? 'var(--text-body)' : 'var(--accent)' }}>
                            {t.keterangan_pembayaran || '-'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                            {t.status_ukt !== 'Lunas' && (
                              <button 
                                onClick={() => {
                                  if (confirm(`Konfirmasi pembayaran tarif mahasiswa untuk ${t.nama} (${t.nim})?`)) {
                                    onConfirmUkt(t.nim, 'Lunas', 'Lunas (Tarif Mahasiswa Semester 4)');
                                  }
                                }} 
                                className="btn btn-primary btn-sm"
                                style={{ 
                                  padding: '6px 12px', 
                                  background: 'rgba(16, 185, 129, 0.1)', 
                                  color: 'var(--success)', 
                                  border: '1px solid rgba(16, 185, 129, 0.2)' 
                                }}
                              >
                                Konfirmasi Lunas
                              </button>
                            )}
                            <button 
                              onClick={() => handleOpenEdit(t)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Edit Detail Pembayaran"
                            >
                              <Edit style={{ width: '14px', height: '14px' }} /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingTaruna && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Edit Detail Pembayaran</h3>
              <button onClick={() => setShowEditModal(false)} className="btn-close">✕</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mahasiswa / NIM</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '2px' }}>{editingTaruna.nama}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{editingTaruna.nim} | {editingTaruna.prodi}</div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-body)' }}>
                    Status Pembayaran
                  </label>
                  <select 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="Belum Lunas">Belum Lunas</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-body)' }}>
                    Keterangan Pembayaran
                  </label>
                  <textarea 
                    value={editKeterangan} 
                    onChange={(e) => setEditKeterangan(e.target.value)}
                    placeholder="Masukkan keterangan (contoh: Kurang Rp 1.500.000 untuk Uang Seragam & Asrama)"
                    rows="3"
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary btn-sm">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 3. PENGATURAN TARIF */}
      {activeMenu === 'tarif-setting' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h1 className="page-title">Pengaturan Tarif Mahasiswa</h1>
              <p className="page-subtitle">Atur nominal tagihan biaya kuliah / tarif dasar mahasiswa.</p>
            </div>
          </div>

          <div className="glass-card glow-cyan" style={{ maxWidth: '600px', padding: '24px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <DollarSign /> Atur Tarif Pembayaran
            </h3>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-body)' }}>
                Tarif Mahasiswa Dasar (per Semester):
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)', fontSize: '14px' }}>Rp</span>
                <input 
                  type="number" 
                  value={tarifMahasiswa} 
                  onChange={(e) => setTarifMahasiswa(parseInt(e.target.value) || 0)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 10px 10px 36px', 
                    background: 'var(--bg-tertiary)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: 'var(--radius-sm)', 
                    color: 'var(--text-main)' 
                  }}
                />
              </div>
            </div>

            <button 
              onClick={() => {
                onUpdateSettings({ ...settings, tarif_ukt: tarifMahasiswa });
                alert("Tarif Mahasiswa berhasil diperbarui!");
              }} 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Simpan Tarif Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
