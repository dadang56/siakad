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
  UserCheck
} from 'lucide-react';

export default function Sidebar({ 
  currentRole, 
  currentUser, 
  activeMenu, 
  setActiveMenu, 
  onLogout 
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
          { id: 'keuangan', label: 'Keuangan (UKT)', icon: CreditCard }
        ];
      case 'dosen':
        return [
          { id: 'dashboard', label: 'Dashboard Dosen', icon: LayoutDashboard },
          { id: 'perwalian', label: 'Bimbingan KRS Mahasiswa', icon: UserCheck },
          { id: 'presensi', label: 'Monitoring presensi mahasiswa', icon: CheckSquare }
        ];
      case 'admin':
      case 'admin_prodi':
        return [
          { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
          { id: 'taruna', label: 'Kelola Mahasiswa', icon: Users },
          { id: 'dosen', label: 'Kelola Dosen', icon: GraduationCap },
          { id: 'matakuliah', label: 'Mata Kuliah', icon: BookOpen },
          { id: 'krs-prodi', label: 'Persetujuan Ka. Prodi', icon: UserCheck },
          { id: 'poin', label: 'Kemahasiswaan (Poin)', icon: ShieldAlert },
          { id: 'semester', label: 'Pengaturan', icon: SettingsIcon }
        ];
      case 'keuangan':
        return [
          { id: 'dashboard', label: 'Dashboard Keuangan', icon: LayoutDashboard },
          { id: 'verifikasi', label: 'Verifikasi Pembayaran', icon: UserCheck }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Avatar helper
  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <aside className="app-sidebar">
      {/* Profile Section */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          {currentUser?.foto ? (
            <img src={currentUser.foto} alt={currentUser.nama} />
          ) : (
            getInitials(currentUser?.nama || (currentRole === 'keuangan' ? 'Keuangan' : 'Admin'))
          )}
        </div>
        <div className="profile-info">
          <span className="profile-name" title={currentUser?.nama || (currentRole === 'keuangan' ? 'Hj. Masayu, S.E.' : 'Administrator')}>
            {currentUser?.nama || (currentRole === 'keuangan' ? 'Hj. Masayu, S.E.' : 'Administrator')}
          </span>
          <span className="profile-role">
            {currentRole === 'taruna' ? `Mahasiswa - ${currentUser?.nim}` : 
             currentRole === 'dosen' ? 'Dosen Wali' : 
             currentRole === 'keuangan' ? 'Admin Keuangan' : 
             currentRole === 'admin_prodi' ? `Admin Prodi - ${currentUser?.prodi || ''}` : 'Admin BAK'}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const themeClass = currentRole === 'dosen' ? 'dosen-theme' : (currentRole === 'admin' || currentRole === 'admin_prodi') ? 'admin-theme' : currentRole === 'keuangan' ? 'keuangan-theme' : '';
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
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
        <button 
          onClick={onLogout}
          className="menu-item"
          style={{ width: '100%', background: 'none', border: 'none', color: 'var(--danger)', marginTop: 'auto', padding: '12px 16px' }}
        >
          <LogOut className="menu-icon" />
          <span>Ganti User</span>
        </button>
        <div style={{ marginTop: '16px', fontSize: '10px' }}>
          Poltektrans SDP Palembang<br />
          SIAKAD v1.0.0 © 2026
        </div>
      </div>
    </aside>
  );
}
