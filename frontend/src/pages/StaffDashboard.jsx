import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, UserPlus, FileHeart, ShieldAlert } from 'lucide-react';

const StaffDashboard = () => {
  const { authFetch } = useContext(AuthContext);

  // States
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeForm, setActiveForm] = useState('body'); // 'body' or 'medical'

  // Body Analysis Form State
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [bmi, setBmi] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [visceralFat, setVisceralFat] = useState('');
  const [waterPercent, setWaterPercent] = useState('');
  const [proteinPercent, setProteinPercent] = useState('');
  const [metabolicAge, setMetabolicAge] = useState('');
  const [boneMass, setBoneMass] = useState('');

  // Medical Report Form State
  const [sugar, setSugar] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [hemoglobin, setHemoglobin] = useState('');
  
  // Advanced Medical state (optional)
  const [wbc, setWbc] = useState('');
  const [rbc, setRbc] = useState('');
  const [platelets, setPlatelets] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [hdl, setHdl] = useState('');
  const [ldl, setLdl] = useState('');
  const [triglycerides, setTriglycerides] = useState('');
  const [vitaminD, setVitaminD] = useState('');
  const [vitaminB12, setVitaminB12] = useState('');
  const [t3, setT3] = useState('');
  const [t4, setT4] = useState('');
  const [tsh, setTsh] = useState('');
  const [sgot, setSgot] = useState('');
  const [sgpt, setSgpt] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [urea, setUrea] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [testosterone, setTestosterone] = useState('');
  const [estrogen, setEstrogen] = useState('');

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const fetchClients = async () => {
    try {
      const res = await authFetch(`/api/users?role=user&search=${searchQuery}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectClient = (usr) => {
    setSelectedUser(usr);
    // Reset forms
    resetForms();
  };

  const resetForms = () => {
    setWeight('');
    setBodyFat('');
    setBmi('');
    setMuscleMass('');
    setVisceralFat('');
    setWaterPercent('');
    setProteinPercent('');
    setMetabolicAge('');
    setBoneMass('');

    setSugar('');
    setBpSystolic('');
    setBpDiastolic('');
    setHemoglobin('');
    setWbc('');
    setRbc('');
    setPlatelets('');
    setCholesterol('');
    setHdl('');
    setLdl('');
    setTriglycerides('');
    setVitaminD('');
    setVitaminB12('');
    setT3('');
    setT4('');
    setTsh('');
    setSgot('');
    setSgpt('');
    setBilirubin('');
    setUrea('');
    setCreatinine('');
    setTestosterone('');
    setEstrogen('');
  };

  const handleBodyAnalysisSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await authFetch('/api/health/body-analysis', {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedUser._id,
          weight: Number(weight),
          bodyFat: Number(bodyFat),
          bmi: Number(bmi),
          muscleMass: Number(muscleMass),
          visceralFat: Number(visceralFat),
          waterPercent: Number(waterPercent),
          proteinPercent: Number(proteinPercent),
          metabolicAge: Number(metabolicAge),
          boneMass: Number(boneMass),
        }),
      });

      if (res.ok) {
        alert('Body Analysis parameters recorded successfully!');
        resetForms();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMedicalReportSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const payload = {
      userId: selectedUser._id,
      sugar: Number(sugar),
      bpSystolic: Number(bpSystolic),
      bpDiastolic: Number(bpDiastolic),
      hemoglobin: Number(hemoglobin),
      cbc: wbc || rbc || platelets ? {
        wbc: wbc ? Number(wbc) : undefined,
        rbc: rbc ? Number(rbc) : undefined,
        platelets: platelets ? Number(platelets) : undefined,
      } : undefined,
      lipidProfile: cholesterol || hdl || ldl || triglycerides ? {
        cholesterol: cholesterol ? Number(cholesterol) : undefined,
        hdl: hdl ? Number(hdl) : undefined,
        ldl: ldl ? Number(ldl) : undefined,
        triglycerides: triglycerides ? Number(triglycerides) : undefined,
      } : undefined,
      vitamins: vitaminD || vitaminB12 ? {
        vitaminD: vitaminD ? Number(vitaminD) : undefined,
        vitaminB12: vitaminB12 ? Number(vitaminB12) : undefined,
      } : undefined,
      thyroid: t3 || t4 || tsh ? {
        t3: t3 ? Number(t3) : undefined,
        t4: t4 ? Number(t4) : undefined,
        tsh: tsh ? Number(tsh) : undefined,
      } : undefined,
      liverFunction: sgot || sgpt || bilirubin ? {
        sgot: sgot ? Number(sgot) : undefined,
        sgpt: sgpt ? Number(sgpt) : undefined,
        bilirubin: bilirubin ? Number(bilirubin) : undefined,
      } : undefined,
      kidneyFunction: urea || creatinine ? {
        urea: urea ? Number(urea) : undefined,
        creatinine: creatinine ? Number(creatinine) : undefined,
      } : undefined,
      hormonalTests: testosterone || estrogen ? {
        testosterone: testosterone ? Number(testosterone) : undefined,
        estrogen: estrogen ? Number(estrogen) : undefined,
      } : undefined,
    };

    try {
      const res = await authFetch('/api/health/medical-report', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Medical lab reports recorded successfully!');
        resetForms();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UserPlus size={24} color="var(--accent-emerald)" />
        Ecosystem Staff & Coach Control Panel
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        
        {/* Left Side: Client Selector */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3>Client Lookup Directory</h3>
          <div className="form-group" style={{ margin: '1rem 0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
            {users.length > 0 ? (
              users.map((usr) => (
                <div
                  key={usr._id}
                  onClick={() => selectClient(usr)}
                  style={{
                    padding: '1rem',
                    background: selectedUser?._id === usr._id ? 'var(--accent-emerald-glow)' : 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedUser?._id === usr._id ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{usr.name}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {usr.membershipId || '--'}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span className="user-tag" style={{ fontSize: '0.65rem' }}>{usr.wellnessLevel}</span>
                    <strong style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>{usr.points} XP</strong>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No clients found.</p>
            )}
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div style={{ gridColumn: 'span 8' }}>
          {selectedUser ? (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Currently Profiling Client</p>
                  <h2 style={{ color: 'var(--accent-emerald)' }}>{selectedUser.name}</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setActiveForm('body')} className={`btn ${activeForm === 'body' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Body Analysis Input
                  </button>
                  <button onClick={() => setActiveForm('medical')} className={`btn ${activeForm === 'medical' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Medical Report Entry
                  </button>
                </div>
              </div>

              {/* A. BODY ANALYSIS FORM */}
              {activeForm === 'body' && (
                <form onSubmit={handleBodyAnalysisSubmit}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileHeart size={18} color="var(--accent-emerald)" />
                    Record Body Composition Metrics
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Body Weight (kg)</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 74.2" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Body Fat %</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 18.5" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">BMI Score</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 23.4" value={bmi} onChange={(e) => setBmi(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Muscle Mass % / kg</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 34.2" value={muscleMass} onChange={(e) => setMuscleMass(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Visceral Fat Level</label>
                      <input type="number" className="form-control" placeholder="e.g. 7" value={visceralFat} onChange={(e) => setVisceralFat(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Water Content %</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 55.4" value={waterPercent} onChange={(e) => setWaterPercent(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Protein Content %</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 17.5" value={proteinPercent} onChange={(e) => setProteinPercent(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Metabolic Age</label>
                      <input type="number" className="form-control" placeholder="e.g. 29" value={metabolicAge} onChange={(e) => setMetabolicAge(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bone Mass (kg)</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 3.2" value={boneMass} onChange={(e) => setBoneMass(e.target.value)} required />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Save Body Analysis Data</button>
                </form>
              )}

              {/* B. MEDICAL REPORT FORM */}
              {activeForm === 'medical' && (
                <form onSubmit={handleMedicalReportSubmit}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileHeart size={18} color="var(--accent-emerald)" />
                    Record Blood & Medical Laboratory Data
                  </h3>

                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Basic Metrics</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Blood Sugar (mg/dL)</label>
                      <input type="number" className="form-control" placeholder="fasting" value={sugar} onChange={(e) => setSugar(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">BP Systolic (mmHg)</label>
                      <input type="number" className="form-control" placeholder="e.g. 120" value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">BP Diastolic (mmHg)</label>
                      <input type="number" className="form-control" placeholder="e.g. 80" value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hemoglobin (g/dL)</label>
                      <input type="number" step="0.1" className="form-control" placeholder="e.g. 14.2" value={hemoglobin} onChange={(e) => setHemoglobin(e.target.value)} required />
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-violet)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Advanced Chemistry (Optional)</h4>
                  
                  {/* CBC & Lipids */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">WBC Count (cells/mcL)</label>
                      <input type="number" className="form-control" value={wbc} onChange={(e) => setWbc(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">RBC Count (million/mcL)</label>
                      <input type="number" step="0.01" className="form-control" value={rbc} onChange={(e) => setRbc(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Platelets (k/mcL)</label>
                      <input type="number" className="form-control" value={platelets} onChange={(e) => setPlatelets(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Total Cholesterol</label>
                      <input type="number" className="form-control" value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">HDL Cholesterol</label>
                      <input type="number" className="form-control" value={hdl} onChange={(e) => setHdl(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">LDL Cholesterol</label>
                      <input type="number" className="form-control" value={ldl} onChange={(e) => setLdl(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Triglycerides</label>
                      <input type="number" className="form-control" value={triglycerides} onChange={(e) => setTriglycerides(e.target.value)} />
                    </div>
                  </div>

                  {/* Vitamins & Thyroid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Vitamin D (ng/mL)</label>
                      <input type="number" className="form-control" value={vitaminD} onChange={(e) => setVitaminD(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vitamin B12 (pg/mL)</label>
                      <input type="number" className="form-control" value={vitaminB12} onChange={(e) => setVitaminB12(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">T3 Level</label>
                      <input type="number" step="0.01" className="form-control" value={t3} onChange={(e) => setT3(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">T4 Level</label>
                      <input type="number" step="0.1" className="form-control" value={t4} onChange={(e) => setT4(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">TSH Level (uIU/mL)</label>
                      <input type="number" step="0.01" className="form-control" value={tsh} onChange={(e) => setTsh(e.target.value)} />
                    </div>
                  </div>

                  {/* Liver & Kidney & Hormones */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">SGOT (U/L)</label>
                      <input type="number" className="form-control" value={sgot} onChange={(e) => setSgot(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SGPT (U/L)</label>
                      <input type="number" className="form-control" value={sgpt} onChange={(e) => setSgpt(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bilirubin (mg/dL)</label>
                      <input type="number" step="0.1" className="form-control" value={bilirubin} onChange={(e) => setBilirubin(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Blood Urea</label>
                      <input type="number" className="form-control" value={urea} onChange={(e) => setUrea(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Serum Creatinine</label>
                      <input type="number" step="0.01" className="form-control" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Save Medical Lab Report</button>
                </form>
              )}

            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-secondary)' }}>
              <ShieldAlert size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p>Please select a client from the lookup directory to start entering health telemetry.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;
