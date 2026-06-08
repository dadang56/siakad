import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Key, HelpCircle } from 'lucide-react';

export default function Login({ onLogin, settings }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(username.trim(), password.trim());
      if (!success) {
        setError('Username atau password salah. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi database.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="login-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.1)',
        filter: 'blur(80px)',
        top: '10%',
        left: '20%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'rgba(30, 58, 95, 0.25)',
        filter: 'blur(100px)',
        bottom: '10%',
        right: '20%',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Campus Header info */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {settings?.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt="Logo Kampus" 
              style={{ height: '70px', objectFit: 'contain', marginBottom: '12px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} 
            />
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: '#d4af37',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              S
            </div>
          )}
          <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px', color: '#fff', margin: '0 0 4px 0' }}>
            {settings?.nama_aplikasi || 'SIAKAD'}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {settings?.sub_nama_aplikasi || 'Sistem Informasi Akademik'}
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontWeight: '500' }}>
            {settings?.nama_kampus || 'Politeknik Transportasi SDP Palembang'}
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card glow-gold" style={{ 
          margin: 0, 
          padding: '32px', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '6px', textAlign: 'center' }}>
            Selamat Datang Kembali
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
            Masukkan kredensial Anda untuk masuk ke sistem.
          </p>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger)',
              fontSize: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px' }}>Username / NIM / NIP:</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <User style={{ width: '16px', height: '16px' }} />
                </span>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Masukkan NIM, NIP, atau username"
                  className="form-control"
                  style={{ paddingLeft: '38px', background: 'rgba(0,0,0,0.25)' }}
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px' }}>Password:</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                  <Lock style={{ width: '16px', height: '16px' }} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan password Anda"
                  className="form-control"
                  style={{ paddingLeft: '38px', paddingRight: '38px', background: 'rgba(0,0,0,0.25)' }}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ 
                marginTop: '10px', 
                padding: '12px', 
                fontSize: '14px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 10px rgba(245, 158, 11, 0.25)'
              }}
            >
              {isLoading ? (
                <span>Menghubungkan...</span>
              ) : (
                <>
                  <LogIn style={{ width: '16px', height: '16px' }} /> Masuk Ke Sistem
                </>
              )}
            </button>
          </form>

          {/* Collapsible Helper Panel for Demo Accounts */}
          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <button 
              onClick={() => setShowHelp(!showHelp)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <HelpCircle style={{ width: '14px', height: '14px' }} /> 
              {showHelp ? 'Sembunyikan Akun Demo' : 'Tampilkan Akun Demo (Uji Coba)'}
            </button>

            {showHelp && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'animate-fade-in 0.2s ease-out'
              }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Klik akun untuk mengisi form otomatis:</span>
                
                {/* Adm Akademik */}
                <div 
                  onClick={() => fillCredentials('admin', 'admin123')}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', border: '1px solid rgba(245, 158, 11, 0.1)' }}
                  title="Klik untuk memilih"
                >
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Adm. Akademik</span>
                  <span style={{ color: 'var(--accent)' }}>admin / admin123</span>
                </div>

                {/* Admin Prodi */}
                <div 
                  onClick={() => fillCredentials('prodinautika', 'prodinautika')}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(30, 58, 95, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', border: '1px solid rgba(30, 58, 95, 0.3)' }}
                  title="Klik untuk memilih"
                >
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Prodi Nautika</span>
                  <span style={{ color: 'var(--primary-light)' }}>prodinautika / prodinautika</span>
                </div>

                <div 
                  onClick={() => fillCredentials('prodipk', 'prodipk')}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(30, 58, 95, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', border: '1px solid rgba(30, 58, 95, 0.3)' }}
                  title="Klik untuk memilih"
                >
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Prodi Permesinan</span>
                  <span style={{ color: 'var(--primary-light)' }}>prodipk / prodipk</span>
                </div>

                {/* Mahasiswa */}
                <div 
                  onClick={() => fillCredentials('2502022', '2502022')}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  title="Klik untuk memilih"
                >
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Mahasiswa (Yoza)</span>
                  <span style={{ color: 'var(--text-muted)' }}>2502022 / 2502022</span>
                </div>

                {/* Dosen */}
                <div 
                  onClick={() => fillCredentials('DESTIYS01', 'ujian@2026')}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  title="Klik untuk memilih"
                >
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Dosen (Desti)</span>
                  <span style={{ color: 'var(--text-muted)' }}>DESTIYS01 / ujian@2026</span>
                </div>

                {/* Keuangan notice */}
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px', fontStyle: 'italic' }}>
                  *Akun Keuangan dapat dibuat di Manajemen User oleh Adm. Akademik.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
