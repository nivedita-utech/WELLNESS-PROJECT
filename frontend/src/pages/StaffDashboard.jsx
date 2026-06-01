import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, UserPlus, FileHeart, ShieldAlert, Activity, ArrowRight, Camera } from 'lucide-react';

const StaffDashboard = () => {
  const { authFetch } = useContext(AuthContext);

  // States
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeForm, setActiveForm] = useState('body'); // 'body', 'medical', or 'transformations'
  const [transformations, setTransformations] = useState([]);

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
      const res = await authFetch(`/api/users?role=user&search=${searchQuery}&status=Active`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectClient = async (usr) => {
    setSelectedUser(usr);
    // Reset forms
    resetForms();

    // Fetch transformations
    try {
      const res = await authFetch(`/api/wellness/transformation/user/${usr._id}`);
      if (res.ok) {
        const data = await res.json();
        setTransformations(data);
      }
    } catch (err) {
      console.error(err);
    }
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-brand-teal/10 rounded-2xl flex items-center justify-center">
          <UserPlus size={24} className="text-brand-teal" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ecosystem Staff & Coach Control Panel</h2>
          <p className="text-sm text-slate-500">Manage clients, body analyses, and medical reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Client Selector */}
        <div className="glass-card lg:col-span-4 flex flex-col h-[calc(100vh-140px)] sticky top-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Client Lookup Directory</h3>
          <div className="relative mb-4 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
              placeholder="Search name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {users.length > 0 ? (
              users.map((usr) => (
                <div
                  key={usr._id}
                  onClick={() => selectClient(usr)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    selectedUser?._id === usr._id 
                      ? 'bg-brand-teal/5 border-brand-teal shadow-sm shadow-brand-teal/10' 
                      : 'bg-white border-slate-100 hover:border-brand-teal/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`font-bold ${selectedUser?._id === usr._id ? 'text-brand-teal' : 'text-slate-800 group-hover:text-brand-teal transition-colors'}`}>{usr.name}</p>
                      <span className="text-xs text-slate-400 font-mono">ID: {usr.membershipId || '--'}</span>
                    </div>
                    <ArrowRight size={16} className={`${selectedUser?._id === usr._id ? 'text-brand-teal' : 'text-slate-300 group-hover:text-brand-teal'} transition-colors`} />
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {usr.wellnessLevel}
                    </span>
                    <strong className="text-amber-500 text-xs font-bold">{usr.points} XP</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Search size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No clients found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-8">
          {selectedUser ? (
            <div className="glass-card animate-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold text-lg uppercase shrink-0">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Currently Profiling Client</p>
                    <h2 className="text-xl font-bold text-slate-800">{selectedUser.name}</h2>
                  </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => setActiveForm('body')} 
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeForm === 'body' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Body Analysis
                  </button>
                  <button 
                    onClick={() => setActiveForm('medical')} 
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeForm === 'medical' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Medical Report
                  </button>
                  <button 
                    onClick={() => setActiveForm('transformations')} 
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      activeForm === 'transformations' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Transformations
                  </button>
                </div>
              </div>

              {/* A. BODY ANALYSIS FORM */}
              {activeForm === 'body' && (
                <form onSubmit={handleBodyAnalysisSubmit} className="animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity size={20} className="text-brand-teal" />
                    <h3 className="text-lg font-bold text-slate-800">Record Body Composition Metrics</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Body Weight (kg)</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 74.2" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Body Fat %</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 18.5" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">BMI Score</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 23.4" value={bmi} onChange={(e) => setBmi(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Muscle Mass % / kg</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 34.2" value={muscleMass} onChange={(e) => setMuscleMass(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Visceral Fat Level</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 7" value={visceralFat} onChange={(e) => setVisceralFat(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Water Content %</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 55.4" value={waterPercent} onChange={(e) => setWaterPercent(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Protein Content %</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 17.5" value={proteinPercent} onChange={(e) => setProteinPercent(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Metabolic Age</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 29" value={metabolicAge} onChange={(e) => setMetabolicAge(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Bone Mass (kg)</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-all" placeholder="e.g. 3.2" value={boneMass} onChange={(e) => setBoneMass(e.target.value)} required />
                    </div>
                  </div>

                  <button type="submit" className="w-full premium-gradient text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                    Save Body Analysis Data
                  </button>
                </form>
              )}

              {/* C. TRANSFORMATIONS VIEWER */}
              {activeForm === 'transformations' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <Camera size={20} className="text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-800">Client Transformation History</h3>
                  </div>

                  {transformations.length > 0 ? (
                    <div className="space-y-6">
                      {transformations.map((trans, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                            <span className="text-sm font-bold text-brand-teal">
                              {new Date(trans.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="text-xs font-semibold bg-brand-teal/10 text-brand-teal px-2 py-1 rounded">
                              {trans.weight ? `${trans.weight} kg` : 'No weight logged'}
                            </span>
                          </div>
                          
                          {/* Dimensions */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                            <div>
                              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Chest</p>
                              <p className="text-sm font-semibold text-slate-700">{trans.chest ? `${trans.chest}"` : '--'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Waist</p>
                              <p className="text-sm font-semibold text-slate-700">{trans.waist ? `${trans.waist}"` : '--'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Hips</p>
                              <p className="text-sm font-semibold text-slate-700">{trans.hips ? `${trans.hips}"` : '--'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Biceps</p>
                              <p className="text-sm font-semibold text-slate-700">{trans.biceps ? `${trans.biceps}"` : '--'}</p>
                            </div>
                          </div>

                          {trans.notes && (
                            <div className="mb-5 bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-600">
                              <strong className="text-xs uppercase text-slate-400 mb-1 block">Client Notes:</strong>
                              "{trans.notes}"
                            </div>
                          )}

                          {/* Photos */}
                          {(trans.beforePhoto || trans.afterPhoto) && (
                            <div className="grid grid-cols-2 gap-4">
                              {trans.beforePhoto && (
                                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                                  <p className="text-xs text-center py-1.5 bg-slate-100 font-semibold text-slate-500 border-b border-slate-200">Before Photo</p>
                                  <img src={trans.beforePhoto} alt="Before" className="w-full h-48 object-cover" />
                                </div>
                              )}
                              {trans.afterPhoto && (
                                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                                  <p className="text-xs text-center py-1.5 bg-slate-100 font-semibold text-slate-500 border-b border-slate-200">Current Photo</p>
                                  <img src={trans.afterPhoto} alt="After" className="w-full h-48 object-cover" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100 border-dashed">
                      <Camera size={32} className="text-slate-300 mx-auto mb-3" />
                      <h4 className="text-sm font-semibold text-slate-700 mb-1">No Transformations Logged</h4>
                      <p className="text-xs text-slate-500">This client hasn't submitted any progress photos or dimensions yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* B. MEDICAL REPORT FORM */}
              {activeForm === 'medical' && (
                <form onSubmit={handleMedicalReportSubmit} className="animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <FileHeart size={20} className="text-brand-sky" />
                    <h3 className="text-lg font-bold text-slate-800">Record Blood & Medical Laboratory Data</h3>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6">
                    <h4 className="text-sm font-bold text-brand-sky flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-sky"></span> Basic Metrics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Blood Sugar (mg/dL)</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-sky transition-all" placeholder="fasting" value={sugar} onChange={(e) => setSugar(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">BP Systolic (mmHg)</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-sky transition-all" placeholder="e.g. 120" value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">BP Diastolic (mmHg)</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-sky transition-all" placeholder="e.g. 80" value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Hemoglobin (g/dL)</label>
                        <input type="number" step="0.1" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-sky transition-all" placeholder="e.g. 14.2" value={hemoglobin} onChange={(e) => setHemoglobin(e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-brand-teal flex items-center gap-2 mb-4 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span> Advanced Chemistry (Optional)
                  </h4>
                  
                  {/* CBC & Lipids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">WBC Count (cells/mcL)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={wbc} onChange={(e) => setWbc(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">RBC Count (M/mcL)</label>
                      <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={rbc} onChange={(e) => setRbc(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Platelets (k/mcL)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={platelets} onChange={(e) => setPlatelets(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Total Cholesterol</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">HDL Cholesterol</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={hdl} onChange={(e) => setHdl(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">LDL Cholesterol</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={ldl} onChange={(e) => setLdl(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Triglycerides</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={triglycerides} onChange={(e) => setTriglycerides(e.target.value)} />
                    </div>
                  </div>

                  {/* Vitamins & Thyroid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Vit D (ng/mL)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={vitaminD} onChange={(e) => setVitaminD(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Vit B12 (pg/mL)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={vitaminB12} onChange={(e) => setVitaminB12(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">T3 Level</label>
                      <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={t3} onChange={(e) => setT3(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">T4 Level</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={t4} onChange={(e) => setT4(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">TSH (uIU/mL)</label>
                      <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={tsh} onChange={(e) => setTsh(e.target.value)} />
                    </div>
                  </div>

                  {/* Liver & Kidney & Hormones */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">SGOT (U/L)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={sgot} onChange={(e) => setSgot(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">SGPT (U/L)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={sgpt} onChange={(e) => setSgpt(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Bilirubin</label>
                      <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={bilirubin} onChange={(e) => setBilirubin(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Blood Urea</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={urea} onChange={(e) => setUrea(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Creatinine</label>
                      <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-all" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-sky hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                    Save Medical Lab Report
                  </button>
                </form>
              )}

            </div>
          ) : (
            <div className="glass-card flex flex-col items-center justify-center h-[calc(100vh-140px)] text-slate-400 border-dashed border-2 border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={40} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">No Client Selected</h3>
              <p className="text-sm text-center max-w-sm">Please select a client from the lookup directory on the left to start entering health telemetry.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;
