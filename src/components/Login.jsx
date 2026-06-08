import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login({ onLogin, settings }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <div className="login-container-wrapper" style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: '#020617',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* 1. LEFT PANEL: Dynamic Premium Branding (Desktop only) */}
      {!isMobile && (
        <div style={{
          width: '50%',
          background: 'linear-gradient(135deg, #090d16 0%, #1e3a8a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          position: 'relative',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}>
          {/* Floating background glowing blobs */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.08)',
            filter: 'blur(100px)',
            top: '-50px',
            left: '-50px',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(30, 58, 138, 0.4)',
            filter: 'blur(120px)',
            bottom: '-50px',
            right: '-50px',
            pointerEvents: 'none'
          }} />

          {/* Large dynamic campus logo */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            animation: 'fadeIn 0.6s ease-out forwards'
          }}>
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt="Logo Kampus" 
                style={{ 
                  height: '160px', 
                  objectFit: 'contain', 
                  marginBottom: '32px', 
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' 
                }} 
              />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                color: '#d4af37',
                fontSize: '48px',
                fontWeight: 'bold',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
              }}>
                S
              </div>
            )}
            
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              color: '#fff', 
              margin: '0 0 12px 0', 
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {settings?.nama_aplikasi || 'SIAKAD'}
            </h1>
            <h3 style={{ 
              fontSize: '14px', 
              color: '#d4af37', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              margin: '0 0 24px 0',
              fontWeight: '700'
            }}>
              {settings?.sub_nama_aplikasi || 'Sistem Informasi Akademik'}
            </h3>
            
            <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.1)', width: '150px', margin: '0 auto 24px auto' }} />
            
            <p style={{ 
              fontSize: '15px', 
              color: '#e2e8f0', 
              maxWidth: '380px', 
              lineHeight: '1.6', 
              margin: '0 auto',
              fontWeight: '500'
            }}>
              {settings?.nama_kampus || 'Politeknik Transportasi SDP Palembang'}
            </p>
          </div>
        </div>
      )}

      {/* 2. RIGHT PANEL: Glassmorphic Login Form */}
      <div style={{
        width: isMobile ? '100%' : '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        position: 'relative'
      }}>
        {/* Floating background glowing blob (For mobile/right side) */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.05)',
          filter: 'blur(90px)',
          top: '30%',
          right: '10%',
          pointerEvents: 'none'
        }} />

        <div style={{ width: '100%', maxWidth: '380px', zIndex: 1 }}>
          
          {/* Mobile logo header */}
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt="Logo Kampus" 
                  style={{ height: '110px', objectFit: 'contain', marginBottom: '16px', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' }} 
                />
              ) : (
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: '#d4af37',
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}>
                  S
                </div>
              )}
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>
                {settings?.nama_aplikasi || 'SIAKAD'}
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {settings?.sub_nama_aplikasi || 'Sistem Informasi Akademik'}
              </p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                {settings?.nama_kampus || 'Politeknik Transportasi SDP Palembang'}
              </p>
            </div>
          )}

          {/* Form Card */}
          <div className="glass-card glow-gold" style={{ 
            margin: 0, 
            padding: '40px 32px', 
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>
              Masuk Akun
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>
              Silakan masukkan kredensial sistem Anda.
            </p>

            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--danger)',
                fontSize: '12px',
                marginBottom: '24px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Username Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>Username:</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <User style={{ width: '16px', height: '16px' }} />
                  </span>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="Username Anda"
                    className="form-control"
                    style={{ paddingLeft: '40px', background: 'rgba(0,0,0,0.3)', height: '42px', fontSize: '13px' }}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>Password:</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                    <Lock style={{ width: '16px', height: '16px' }} />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Password Anda"
                    className="form-control"
                    style={{ paddingLeft: '40px', paddingRight: '40px', background: 'rgba(0,0,0,0.3)', height: '42px', fontSize: '13px' }}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '14px', 
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

              {/* Login Button */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading}
                style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                  height: '44px',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <LogIn style={{ width: '16px', height: '16px' }} /> Masuk Ke Sistem
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Secure branding tag line footer */}
          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Layanan Akademik Terintegrasi © 2026<br />
            {settings?.nama_kampus || 'Politeknik Transportasi SDP Palembang'}
          </div>

        </div>
      </div>

    </div>
  );
}
