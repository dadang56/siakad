import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  GraduationCap, 
  FileText, 
  Info, 
  Save,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export default function DosenPortal({ 
  currentUser, 
  activeMenu, 
  tarunaList, 
  matakuliahList, 
  kelasList, 
  krsList, 
  nilaiList, 
  presensiList, 
  onApproveKrs, 
  onSaveGrades, 
  onSaveAttendance 
}) {
  
  const [selectedKrsToReview, setSelectedKrsToReview] = useState(null);
  const [catatanDosen, setCatatanDosen] = useState('');
  const [selectedKelasId, setSelectedKelasId] = useState('');
  
  // State for in-progress grading edits
  const [gradingState, setGradingState] = useState({});
  // State for in-progress attendance edits
  const [attendanceState, setAttendanceState] = useState({});

  // Clock state
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[time.getDay()];
  const dateNum = time.getDate();
  const monthName = months[time.getMonth()];
  const yearNum = time.getFullYear();
  const timeStr = time.toTimeString().split(' ')[0]; // HH:MM:SS

  // 1. Filter data relevant to this Dosen
  const taughtClasses = kelasList.filter(k => k.dosen_nidn === currentUser.nidn);
  const advisoryCadets = tarunaList.filter(t => t.dosen_wali_nidn === currentUser.nidn);
  
  // Calculate total students taught across all classes
  const getEnrolledStudentsCount = (kelasId) => {
    return krsList.filter(k => k.status === 'Disetujui Ka. Prodi' && k.kelas_ids.includes(kelasId)).length;
  };

  const totalEnrolledStudents = taughtClasses.reduce((tot, c) => tot + getEnrolledStudentsCount(c.id), 0);

  // 2. KRS Review Setup
  const handleOpenReviewModal = (krs) => {
    setSelectedKrsToReview(krs);
    setCatatanDosen(krs.catatan_dosen || '');
  };

  const handleReviewAction = (approved) => {
    onApproveKrs(
      selectedKrsToReview.id, 
      approved ? 'Menunggu Persetujuan Ka. Prodi' : 'Ditolak', 
      catatanDosen
    );
    setSelectedKrsToReview(null);
    setCatatanDosen('');
  };

  // 3. Grading setup
  const handleSelectKelasForGrading = (kelasId) => {
    setSelectedKelasId(kelasId);
    
    // Find enrolled students
    const enrolledStudents = tarunaList.filter(t => {
      const krs = krsList.find(k => k.nim === t.nim && k.status === 'Disetujui Ka. Prodi');
      return krs && krs.kelas_ids.includes(kelasId);
    });

    // Initialize grading state from current nilaiList or defaults
    const newGradingState = {};
    enrolledStudents.forEach(t => {
      const currentNilai = nilaiList.find(n => n.nim === t.nim && n.matakuliah_kode === kelasList.find(k => k.id === kelasId).matakuliah_kode) || {};
      newGradingState[t.nim] = {
        tugas: currentNilai.tugas || 0,
        uts: currentNilai.uts || 0,
        uas: currentNilai.uas || 0,
        praktek: currentNilai.praktek || 0
      };
    });
    setGradingState(newGradingState);
  };

  // Handle grade text input
  const handleGradeChange = (nim, field, value) => {
    const numericVal = Math.min(100, Math.max(0, parseFloat(value) || 0));
    setGradingState({
      ...gradingState,
      [nim]: {
        ...gradingState[nim],
        [field]: numericVal
      }
    });
  };

  // Automated grade calculation
  const calculateFinalGrade = (nim) => {
    const grades = gradingState[nim] || { tugas: 0, uts: 0, uas: 0, praktek: 0 };
    return (grades.tugas * 0.20) + (grades.uts * 0.25) + (grades.uas * 0.30) + (grades.praktek * 0.25);
  };

  // Automated letter grade mapping
  const getLetterGrade = (score) => {
    if (score >= 85) return 'A';
    if (score >= 78) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C+';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'E';
  };

  // Save Grades
  const handleSaveGradesSubmit = () => {
    const activeKelas = kelasList.find(k => k.id === selectedKelasId);
    if (!activeKelas) return;

    const mk = matakuliahList.find(m => m.kode === activeKelas.matakuliah_kode);
    
    Object.keys(gradingState).forEach(nim => {
      const grades = gradingState[nim];
      const finalScore = calculateFinalGrade(nim);
      const letterGrade = getLetterGrade(finalScore);

      onSaveGrades({
        nim,
        matakuliah_kode: mk.kode,
        nama_mk: mk.nama,
        sks: mk.sks,
        semester: mk.semester,
        tugas: grades.tugas,
        uts: grades.uts,
        uas: grades.uas,
        praktek: grades.praktek,
        nilai_akhir: finalScore,
        nilai_huruf: letterGrade
      });
    });
    alert("Nilai berhasil disimpan!");
  };

  // 4. Attendance setup
  const handleSelectKelasForAttendance = (kelasId) => {
    setSelectedKelasId(kelasId);
    
    // Find enrolled students
    const enrolledStudents = tarunaList.filter(t => {
      const krs = krsList.find(k => k.nim === t.nim && k.status === 'Disetujui Ka. Prodi');
      return krs && krs.kelas_ids.includes(kelasId);
    });

    const newAttendanceState = {};
    enrolledStudents.forEach(t => {
      const currentPres = presensiList.find(p => p.nim === t.nim && p.kelas_id === kelasId) || {
        total_pertemuan: 16,
        hadir: 16,
        sakit: 0,
        izin: 0,
        alfa: 0
      };
      newAttendanceState[t.nim] = { ...currentPres };
    });
    setAttendanceState(newAttendanceState);
  };

  // Handle attendance change
  const handleAttendanceChange = (nim, field, value) => {
    const intVal = Math.max(0, parseInt(value) || 0);
    const studentPres = attendanceState[nim] || { total_pertemuan: 16, hadir: 16, sakit: 0, izin: 0, alfa: 0 };
    
    const updated = { ...studentPres, [field]: intVal };
    // Recalculate total_pertemuan
    updated.total_pertemuan = updated.hadir + updated.sakit + updated.izin + updated.alfa;

    setAttendanceState({
      ...attendanceState,
      [nim]: updated
    });
  };

  // Save Attendance
  const handleSaveAttendanceSubmit = () => {
    Object.keys(attendanceState).forEach(nim => {
      onSaveAttendance(nim, selectedKelasId, attendanceState[nim]);
    });
    alert("Presensi berhasil disimpan!");
  };

  return (
    <div>
      {/* 1. DASHBOARD DOSEN */}
      {activeMenu === 'dashboard' && (() => {
        // Grouping bimbingan students by prodi
        const bimbinganByProdi = advisoryCadets.reduce((acc, student) => {
          const prodi = student.prodi || 'Tidak Diketahui';
          if (!acc[prodi]) acc[prodi] = [];
          acc[prodi].push(student);
          return acc;
        }, {});

        return (
          <div className="animate-fade-in">
            {/* Clock and Time Widget */}
            <div className="glass-card glow-cyan" style={{ marginBottom: '32px', padding: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 182, 212, 0.15) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span className="badge badge-info" style={{ marginBottom: '8px' }}>Portal Dosen Pengampu & Wali</span>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Selamat Datang, {currentUser.nama}!</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 0 }}>NIDN: {currentUser.nidn} | Jurusan/Prodi: {currentUser.prodi}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {timeStr}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600', marginTop: '4px' }}>
                    {dayName}, {dateNum} {monthName} {yearNum}
                  </div>
                </div>
              </div>
            </div>

            {/* Bimbingan Students Grouped by Prodi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-card glow-blue">
                <div className="card-header-clean" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} className="text-blue" />
                    Daftar Mahasiswa Bimbingan per Program Studi
                  </h3>
                  <span className="badge badge-primary">{advisoryCadets.length} Mahasiswa</span>
                </div>

                {Object.keys(bimbinganByProdi).length > 0 ? (
                  Object.keys(bimbinganByProdi).map((prodiName) => {
                    const students = bimbinganByProdi[prodiName];
                    return (
                      <div key={prodiName} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '8px 12px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '6px' }}>
                          <GraduationCap size={16} className="text-cyan" />
                          <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--cyan)' }}>{prodiName}</h4>
                          <span className="badge badge-info" style={{ marginLeft: 'auto' }}>{students.length} Mahasiswa</span>
                        </div>
                        <div className="table-container">
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>NIM</th>
                                <th>Nama Mahasiswa</th>
                                <th>Semester</th>
                                <th>Kelas</th>
                                <th style={{ textAlign: 'center' }}>IPK</th>
                                <th style={{ textAlign: 'center' }}>Status Keuangan</th>
                                <th style={{ textAlign: 'center' }}>Status KRS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => {
                                const krs = krsList.find(k => k.nim === student.nim && k.tahun_ajaran === '2026/2027 Ganjil');
                                return (
                                  <tr key={student.nim}>
                                    <td>{student.nim}</td>
                                    <td><strong>{student.nama}</strong></td>
                                    <td>Semester {student.semester}</td>
                                    <td>{student.kelas}</td>
                                    <td style={{ textAlign: 'center' }}>{student.ipk}</td>
                                    <td style={{ textAlign: 'center' }}>
                                      <span className={`badge ${student.status_ukt === 'Lunas' ? 'badge-success' : 'badge-danger'}`}>
                                        {student.status_ukt}
                                      </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      <span className={`badge ${
                                        !krs ? 'badge-danger' : 
                                        krs.status === 'Disetujui Ka. Prodi' ? 'badge-success' : 
                                        krs.status === 'Disetujui Dosen Wali' ? 'badge-info' : 
                                        krs.status.includes('Menunggu') ? 'badge-warning' : 
                                        krs.status === 'Ditolak' ? 'badge-danger' : 'badge-info'
                                      }`}>
                                        {krs ? krs.status : 'Belum Isi'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Anda tidak memiliki mahasiswa bimbingan akademik.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. KRS ADVISORY (PERWALIAN) */}
      {activeMenu === 'perwalian' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Perwalian KRS Mahasiswa</h2>
              <p className="page-subtitle">Pemeriksaan dan persetujuan Kartu Rencana Studi Mahasiswa bimbingan akademik Anda.</p>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header-clean">
              <h3 className="card-title">Daftar Mahasiswa Bimbingan</h3>
              <span className="badge badge-primary">{advisoryCadets.length} Total</span>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>NIM</th>
                    <th>Nama Mahasiswa</th>
                    <th>Prodi</th>
                    <th style={{ textAlign: 'center' }}>IPK</th>
                    <th style={{ textAlign: 'center' }}>IPS Lalu</th>
                    <th style={{ textAlign: 'center' }}>Status KRS</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {advisoryCadets.map((taruna) => {
                    const krs = krsList.find(k => k.nim === taruna.nim && k.tahun_ajaran === '2026/2027 Ganjil');
                    return (
                      <tr key={taruna.nim}>
                        <td>{taruna.nim}</td>
                        <td><strong>{taruna.nama}</strong></td>
                        <td>{taruna.prodi}</td>
                        <td style={{ textAlign: 'center' }}>{taruna.ipk}</td>
                        <td style={{ textAlign: 'center' }}>{taruna.ips_prev}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${
                            !krs ? 'badge-danger' : 
                            krs.status === 'Disetujui Ka. Prodi' ? 'badge-success' : 
                            krs.status === 'Disetujui Dosen Wali' ? 'badge-info' : 
                            krs.status.includes('Menunggu') ? 'badge-warning' : 
                            krs.status === 'Ditolak' ? 'badge-danger' : 'badge-info'
                          }`}>
                            {krs ? krs.status : 'Belum Isi'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {krs && krs.status === 'Menunggu Persetujuan' ? (
                            <button 
                              onClick={() => handleOpenReviewModal(krs)} 
                              className="btn btn-warning btn-sm"
                            >
                              Review KRS
                            </button>
                          ) : krs ? (
                            <button 
                              onClick={() => handleOpenReviewModal(krs)} 
                              className="btn btn-secondary btn-sm"
                            >
                              Lihat Detail
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Menunggu Mahasiswa</span>
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

      {/* 3. GRADING (INPUT NILAI) */}
      {activeMenu === 'nilai' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Input Nilai Kuliah</h2>
              <p className="page-subtitle">Pengisian nilai evaluasi perkuliahan (Tugas, UTS, UAS, Praktikum) Mahasiswa.</p>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <div className="form-group" style={{ maxWidth: '400px', marginBottom: 0 }}>
              <label className="form-label">Pilih Kelas Kuliah:</label>
              <select 
                value={selectedKelasId} 
                onChange={(e) => handleSelectKelasForGrading(e.target.value)}
                className="form-control"
              >
                <option value="">-- Pilih Kelas --</option>
                {taughtClasses.map((c) => {
                  const mk = matakuliahList.find(m => m.kode === c.matakuliah_kode);
                  return (
                    <option key={c.id} value={c.id}>
                      {c.id} - {mk?.nama}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {selectedKelasId ? (
            <div className="glass-card glow-cyan">
              <div className="card-header-clean">
                <div>
                  <h3 className="card-title">Tabel Penilaian Kelas: {selectedKelasId}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bobot: Tugas (20%), UTS (25%), UAS (30%), Praktikum/Lab (25%)</span>
                </div>
                <button onClick={handleSaveGradesSubmit} className="btn btn-success btn-sm">
                  <Save className="menu-icon" /> Simpan Nilai Kelas
                </button>
              </div>

              {Object.keys(gradingState).length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama Mahasiswa</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Tugas</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>UTS</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>UAS</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Praktikum</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>Nilai Akhir</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>Grade Huruf</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tarunaList
                        .filter(t => gradingState[t.nim] !== undefined)
                        .map(taruna => {
                          const nim = taruna.nim;
                          const score = calculateFinalGrade(nim);
                          const letter = getLetterGrade(score);
                          
                          return (
                            <tr key={nim}>
                              <td>{nim}</td>
                              <td><strong>{taruna.nama}</strong></td>
                              <td style={{ textAlign: 'center' }}>
                                <input 
                                  type="number" 
                                  value={gradingState[nim].tugas} 
                                  onChange={(e) => handleGradeChange(nim, 'tugas', e.target.value)}
                                  className="form-control"
                                  style={{ width: '70px', padding: '6px', textAlign: 'center', margin: '0 auto' }}
                                  min={0} max={100}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <input 
                                  type="number" 
                                  value={gradingState[nim].uts} 
                                  onChange={(e) => handleGradeChange(nim, 'uts', e.target.value)}
                                  className="form-control"
                                  style={{ width: '70px', padding: '6px', textAlign: 'center', margin: '0 auto' }}
                                  min={0} max={100}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <input 
                                  type="number" 
                                  value={gradingState[nim].uas} 
                                  onChange={(e) => handleGradeChange(nim, 'uas', e.target.value)}
                                  className="form-control"
                                  style={{ width: '70px', padding: '6px', textAlign: 'center', margin: '0 auto' }}
                                  min={0} max={100}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <input 
                                  type="number" 
                                  value={gradingState[nim].praktek} 
                                  onChange={(e) => handleGradeChange(nim, 'praktek', e.target.value)}
                                  className="form-control"
                                  style={{ width: '70px', padding: '6px', textAlign: 'center', margin: '0 auto' }}
                                  min={0} max={100}
                                />
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '15px', color: 'var(--accent)' }}>
                                {score.toFixed(1)}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={`badge ${letter === 'A' ? 'badge-success' : letter.startsWith('B') ? 'badge-primary' : 'badge-warning'}`}>
                                  {letter}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Belum ada Mahasiswa yang mengambil dan disetujui untuk kelas ini.</div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Silakan pilih kelas kuliah pada dropdown di atas untuk memulai penilaian.
            </div>
          )}
        </div>
      )}

      {/* 4. ATTENDANCE (MONITORING PRESENSI) */}
      {activeMenu === 'presensi' && (
        <div className="animate-fade-in">
          <div className="page-header">
            <div>
              <h2 className="page-title">Monitoring presensi mahasiswa</h2>
              <p className="page-subtitle">Daftar kehadiran perkuliahan mahasiswa bimbingan akademik Anda yang ter-plotting (sinkron otomatis dengan LMS).</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {advisoryCadets.map(student => {
              const studentKrs = krsList.find(k => k.nim === student.nim && k.status === 'Disetujui Ka. Prodi');
              const enrolledKelasIds = studentKrs ? studentKrs.kelas_ids : [];

              return (
                <div key={student.nim} className="glass-card glow-blue">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{student.nama}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: 0 }}>NIM: {student.nim} | Program Studi: {student.prodi} | Semester {student.semester}</p>
                    </div>
                    <div>
                      <span className={`badge ${studentKrs ? 'badge-success' : 'badge-danger'}`}>
                        {studentKrs ? 'KRS Disetujui' : 'Belum Plotting KRS'}
                      </span>
                    </div>
                  </div>

                  {enrolledKelasIds.length > 0 ? (
                    <div className="table-container">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>ID Kelas</th>
                            <th>Mata Kuliah</th>
                            <th style={{ textAlign: 'center', width: '80px' }}>Hadir</th>
                            <th style={{ textAlign: 'center', width: '80px' }}>Sakit</th>
                            <th style={{ textAlign: 'center', width: '80px' }}>Izin</th>
                            <th style={{ textAlign: 'center', width: '80px' }}>Alfa</th>
                            <th style={{ textAlign: 'center', width: '120px' }}>Total Pertemuan</th>
                            <th style={{ textAlign: 'center', width: '100px' }}>Kehadiran (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledKelasIds.map(kelasId => {
                            const cl = kelasList.find(c => c.id === kelasId);
                            const mk = matakuliahList.find(m => m.kode === cl?.matakuliah_kode);
                            const pres = presensiList.find(p => p.nim === student.nim && p.kelas_id === kelasId) || 
                              { total_pertemuan: 16, hadir: 16, sakit: 0, izin: 0, alfa: 0 };
                            
                            const percent = pres.total_pertemuan > 0 ? ((pres.hadir / pres.total_pertemuan) * 100).toFixed(0) : 0;

                            return (
                              <tr key={kelasId}>
                                <td><strong>{kelasId}</strong></td>
                                <td>
                                  <div>{mk?.nama || 'Mata Kuliah'}</div>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mk?.kode}</span>
                                </td>
                                <td style={{ textAlign: 'center' }}>{pres.hadir}</td>
                                <td style={{ textAlign: 'center' }}>{pres.sakit}</td>
                                <td style={{ textAlign: 'center' }}>{pres.izin}</td>
                                <td style={{ textAlign: 'center' }}>{pres.alfa}</td>
                                <td style={{ textAlign: 'center' }}>{pres.total_pertemuan} Sesi</td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className={`badge ${percent >= 75 ? 'badge-success' : 'badge-danger'}`}>
                                    {percent}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Belum ada mata kuliah yang di-plotting/disetujui untuk semester ini.
                    </div>
                  )}
                </div>
              );
            })}
            
            {advisoryCadets.length === 0 && (
              <div className="glass-card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                Anda tidak memiliki mahasiswa bimbingan akademik.
              </div>
            )}
          </div>
        </div>
      )}

      {/* KRS REVIEW MODAL */}
      {selectedKrsToReview && (() => {
        const student = tarunaList.find(t => t.nim === selectedKrsToReview.nim);
        const isReadonly = selectedKrsToReview.status !== 'Menunggu Persetujuan';

        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Review Usulan KRS - {student?.nama}</h3>
                <button onClick={() => setSelectedKrsToReview(null)} className="btn-close">✕</button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                  <div>NIM: <strong>{student?.nim}</strong></div>
                  <div>IPK Kumulatif: <strong>{student?.ipk}</strong></div>
                  <div>Prodi: <strong>{student?.prodi}</strong></div>
                  <div>IPS Semester Lalu: <strong>{student?.ips_prev}</strong></div>
                </div>

                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Daftar Mata Kuliah Diusulkan:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {selectedKrsToReview.kelas_ids.map(kid => {
                    const kelas = kelasList.find(k => k.id === kid);
                    const mk = matakuliahList.find(m => m.kode === kelas?.matakuliah_kode);
                    return (
                      <div key={kid} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', fontSize: '13px' }}>
                        <div>
                          <strong>{mk?.nama}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{kelas?.id} | {kelas?.hari}, {kelas?.jam} ({kelas?.ruang})</div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{mk?.sks} SKS</div>
                      </div>
                    );
                  })}
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Pembimbing Akademik:</label>
                  <textarea 
                    value={catatanDosen} 
                    onChange={(e) => setCatatanDosen(e.target.value)}
                    className="form-control"
                    style={{ height: '80px', resize: 'none' }}
                    placeholder="Contoh: Jadwal matakuliah Naut-405 tabrakan dengan BST, harap direvisi."
                    disabled={isReadonly}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedKrsToReview(null)}>Tutup</button>
                {!isReadonly && (
                  <>
                    <button className="btn btn-danger btn-sm" onClick={() => handleReviewAction(false)}>Kembalikan / Tolak</button>
                    <button className="btn btn-success btn-sm" onClick={() => handleReviewAction(true)}>Setujui KRS</button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
