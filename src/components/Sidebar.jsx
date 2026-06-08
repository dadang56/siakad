import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  CreditCard, 
  ShieldAlert, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings as SettingsIcon, 
  Award,
  CheckSquare,
  LogOut,
  UserCheck,
  Anchor
} from 'lucide-react';

export default function Sidebar({ 
  currentRole, 
  currentUser, 
  activeMenu, 
  setActiveMenu, 
  onLogout,
  settings,
  isOpen,
  onMenuClick
}) {
  
  // Menu definition based on role
  const getMenuItems = () => {
    switch (currentRole) {
      case 'taruna':
        return [
          { id: 'krs', label: 'Rencana Studi (KRS)', icon: FileText },
          { id: 'khs', label: 'Hasil Studi (KHS)', icon: GraduationCap },
          { id: 'jadwal', label: 'Jadwal Pembelajaran', icon: Calendar },
          { id: 'presensi', label: 'Presensi', icon: CheckSquare },
          { id: 'keuangan', label: 'Keuangan (Tarif Mahasiswa)', icon: CreditCard }
        ];
      case 'dosen':
        return [
          { id: 'dashboard', label: 'Dashboard Dosen', icon: LayoutDashboard },
          { id: 'perwalian', label: 'Bimbingan KRS Mahasiswa', icon: UserCheck },
          { id: 'presensi', label: 'Monitoring presensi mahasiswa', icon: CheckSquare }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
          { id: 'users', label: 'Manajemen User', icon: Users },
          { id: 'kelas', label: 'Kelas (Monitoring)', icon: GraduationCap },
          { id: 'matakuliah', label: 'Mata Kuliah (Monitoring)', icon: BookOpen },
          { id: 'jadwal-pembelajaran', label: 'Jadwal Pembelajaran (Monitoring)', icon: Calendar },
          { id: 'dosen-pembimbing', label: 'Dosen Pembimbing Akademik', icon: UserCheck },
          { id: 'khs-admin', label: 'Kartu Hasil Semester (KHS)', icon: Award },
          { id: 'semester', label: 'Pengaturan', icon: SettingsIcon }
        ];
      case 'admin_prodi':
        return [
          { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
          { id: 'kelas', label: 'Kelola Kelas', icon: GraduationCap },
          { id: 'matakuliah', label: 'Kelola Mata Kuliah', icon: BookOpen },
          { id: 'jadwal-pembelajaran', label: 'Kelola Jadwal Pembelajaran', icon: Calendar },
          { id: 'dosen-pembimbing', label: 'Dosen Pembimbing Akademik', icon: UserCheck },
          { id: 'krs-prodi', label: 'Persetujuan KRS', icon: UserCheck },
          { id: 'khs-admin', label: 'Kartu Hasil Semester (KHS)', icon: Award }
        ];
      case 'keuangan':
        return [
          { id: 'dashboard', label: 'Dashboard Keuangan', icon: LayoutDashboard },
          { id: 'verifikasi', label: 'Verifikasi Pembayaran', icon: UserCheck },
          { id: 'tarif-setting', label: 'Pengaturan Tarif', icon: SettingsIcon }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Branding Section */}
      <div className="sidebar-branding">
        {settings?.logo_url ? (
          <img src={settings.logo_url} alt="Logo" className="branding-logo" />
        ) : (
          <Anchor className="logo-icon branding-logo-fallback" />
        )}
        <div className="branding-text">
          <span className="branding-app-name">
            {settings?.nama_aplikasi || 'Si-PANDU'}
          </span>
          <span className="branding-campus-name">
            {settings?.nama_kampus || 'POLTEKTRANS'}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
        <div className="menu-section-label">
          Menu Utama
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const themeClass = currentRole === 'dosen' ? 'dosen-theme' : (currentRole === 'admin' || currentRole === 'admin_prodi') ? 'admin-theme' : currentRole === 'keuangan' ? 'keuangan-theme' : '';
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveMenu(item.id);
                    if (onMenuClick) onMenuClick();
                  }}
                  className={`menu-item ${activeMenu === item.id ? `active ${themeClass}` : ''}`}
                  style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                >
                  <Icon className="menu-icon" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-copyright">
          {settings?.nama_kampus || 'Poltektrans SDP Palembang'}<br />
          {settings?.nama_aplikasi || 'SIAKAD'} v1.0.0 © 2026
        </div>
      </div>
    </aside>
  );
}
