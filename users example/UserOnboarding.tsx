
import React, { useState } from 'react';
import { X, UserPlus, Shield, Users, Briefcase, GraduationCap, Building2, Check, ShieldCheck, Sparkles, Phone, Mail, Globe, ChevronDown } from 'lucide-react';
import { UserLevel, UserRole } from '../../types';

const COUNTRY_CODES = [
  { code: '+20', label: 'EG', name: 'Egypt' },
  { code: '+966', label: 'SA', name: 'Saudi Arabia' },
  { code: '+971', label: 'AE', name: 'UAE' },
  { code: '+1', label: 'US', name: 'USA' },
  { code: '+44', label: 'UK', name: 'UK' },
  { code: '+965', label: 'KW', name: 'Kuwait' },
  { code: '+974', label: 'QA', name: 'Qatar' },
];

const UserOnboarding: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [level, setLevel] = useState<UserLevel>('user');
  const [role, setRole] = useState<UserRole>('student');
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const validateEmail = (val: string) => {
    setEmail(val);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(val ? regex.test(val) : null);
  };

  const getRolesForLevel = (lvl: UserLevel): UserRole[] => {
    switch (lvl) {
      case 'manager': return ['manager'];
      case 'leader': return ['cx_leader', 'hr_leader', 'ops_leader', 'coord_leader', 'comm_leader', 'academic_manager'];
      // Fix: 'squad_admin' is not a valid UserRole, changed to 'block_admin'
      case 'admin': return ['block_admin'];
      case 'agent': return ['cx_agent', 'hr_agent', 'ops_agent', 'community_manager', 'team_leader', 'coordinator', 'instructor'];
      default: return ['student', 'instructor'];
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-5xl rounded-[64px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative flex h-[90vh] border border-white/20">
        
        {/* Left Informational Sidebar - Abstract Visuals */}
        <div className="w-1/4 bg-[#0a0f18] p-12 text-white flex flex-col justify-center items-center relative overflow-hidden border-r border-white/5">
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ADEF]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="grid grid-cols-4 gap-4 p-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="aspect-square border border-white/20 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#00ADEF] to-blue-600 rounded-[40px] flex items-center justify-center mb-8 shadow-[0_25px_50px_-12px_rgba(0,173,239,0.5)] ring-8 ring-blue-500/10 animate-bounce-slow">
               <UserPlus size={44} className="text-white" />
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-[#00ADEF] rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500/50 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Form Container - Enhanced UI */}
        <div className="flex-1 p-16 overflow-y-auto no-scrollbar bg-white relative">
           <button 
             onClick={onClose} 
             className="absolute top-8 right-8 p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-[24px] transition-all shadow-sm z-50 border border-slate-100 active:scale-90"
           >
             <X size={24} />
           </button>

           <div className="max-w-3xl mx-auto space-y-16">
              {/* Hierarchy Section */}
              <section>
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-2 h-8 bg-[#00ADEF] rounded-full"></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Unit Hierarchy</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'leader', label: 'Leader', icon: Briefcase, desc: 'HQ Dept Head' },
                      { id: 'admin', label: 'Squad Admin', icon: Building2, desc: 'Hub Manager' },
                      { id: 'agent', label: 'Agent', icon: Users, desc: 'Ops & Support' },
                      { id: 'user', label: 'General', icon: GraduationCap, desc: 'Student / Dev' },
                    ].map(l => (
                      <button 
                        key={l.id}
                        onClick={() => { setLevel(l.id as any); setRole(getRolesForLevel(l.id as any)[0]); }}
                        className={`group relative flex items-center gap-6 p-6 rounded-[32px] border-2 transition-all text-left transform active:scale-[0.98] ${
                           level === l.id 
                            ? 'border-[#00ADEF] bg-blue-50/20 shadow-lg' 
                            : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50/50'
                        }`}
                      >
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${level === l.id ? 'bg-[#00ADEF] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                            <l.icon size={24} />
                         </div>
                         <div>
                            <span className={`squad font-black text-lg tracking-tight ${level === l.id ? 'text-[#00ADEF]' : 'text-slate-800'}`}>{l.label}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{l.desc}</span>
                         </div>
                         {level === l.id && (
                           <div className="ml-auto text-[#00ADEF]"><Check size={20} strokeWidth={4} /></div>
                         )}
                      </button>
                    ))}
                 </div>
              </section>

              {/* Designation Section */}
              <section>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-8 bg-slate-900 rounded-full"></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Designation</h3>
                 </div>

                 <div className="flex flex-wrap gap-3">
                    {getRolesForLevel(level).map(r => (
                      <button 
                        key={r}
                        onClick={() => setRole(r)}
                        className={`px-8 py-4 rounded-[22px] text-[13px] font-black capitalize transition-all border-2 transform active:scale-95 ${
                           role === r 
                             ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                             : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                         {r.replace('_', ' ')}
                      </button>
                    ))}
                 </div>
              </section>

              {/* Identity Details Section */}
              <section className="space-y-10">
                 <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Identity Details</h3>
                 </div>

                 <div className="grid grid-cols-1 gap-8">
                    {/* Full Name */}
                    <div className="group">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 squad ml-4">Full Legal Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Alexander Pierce" 
                         className="w-full bg-slate-50 border-2 border-slate-50 focus:border-[#00ADEF] focus:bg-white rounded-[28px] px-10 py-6 text-lg font-bold outline-none transition-all placeholder:text-slate-300 text-slate-900" 
                       />
                    </div>

                    {/* Email with Validation UI */}
                    <div className="group">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 squad ml-4">Corporate Email</label>
                       <div className="relative">
                          <input 
                            type="email" 
                            placeholder="name@academy.com" 
                            value={email}
                            onChange={(e) => validateEmail(e.target.value)}
                            className={`w-full bg-slate-50 border-2 rounded-[28px] px-10 py-6 text-lg font-bold outline-none transition-all placeholder:text-slate-300 text-slate-900 pr-16 ${
                              isEmailValid === true ? 'border-emerald-500 focus:border-emerald-500' : 
                              isEmailValid === false ? 'border-red-500 focus:border-red-500' : 
                              'border-slate-50 focus:border-[#00ADEF]'
                            }`} 
                          />
                          <div className="absolute right-8 top-1/2 -translate-y-1/2">
                             {isEmailValid === true && <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Check size={18} strokeWidth={4} /></div>}
                             {isEmailValid === false && <div className="p-2 bg-red-100 text-red-600 rounded-xl"><X size={18} strokeWidth={4} /></div>}
                             {isEmailValid === null && <Mail size={22} className="text-slate-300" />}
                          </div>
                       </div>
                    </div>

                    {/* Phone Number with Country Code */}
                    <div className="group">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 squad ml-4">Contact Number</label>
                       <div className="flex gap-4">
                          <div className="relative min-w-[140px]">
                             <select 
                               value={countryCode.code}
                               onChange={(e) => setCountryCode(COUNTRY_CODES.find(c => c.code === e.target.value) || COUNTRY_CODES[0])}
                               className="w-full bg-slate-50 border-2 border-slate-50 focus:border-[#00ADEF] focus:bg-white rounded-[28px] px-8 py-6 text-lg font-bold outline-none transition-all appearance-none cursor-pointer text-slate-900"
                             >
                                {COUNTRY_CODES.map(c => (
                                  <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                                ))}
                             </select>
                             <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                          </div>
                          <input 
                            type="tel" 
                            placeholder="000 000 000" 
                            className="flex-1 bg-slate-50 border-2 border-slate-50 focus:border-[#00ADEF] focus:bg-white rounded-[28px] px-10 py-6 text-lg font-bold outline-none transition-all placeholder:text-slate-300 text-slate-900" 
                          />
                       </div>
                    </div>

                    {/* Hub Assignment - Now with Unassigned Option */}
                    <div className="group">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 squad ml-4">Operational Unit</label>
                       <div className="relative">
                          <select className="w-full bg-slate-50 border-2 border-slate-50 focus:border-[#00ADEF] focus:bg-white rounded-[28px] px-10 py-6 text-lg font-bold outline-none transition-all appearance-none text-slate-900 cursor-pointer">
                             <option value="">Unassigned (External Personnel)</option>
                             <option value="bl1">Hub: Squad Alpha</option>
                             <option value="bl2">Hub: Squad Beta</option>
                             <option value="hq">Personnel: Global HQ</option>
                          </select>
                          <ChevronDown size={24} className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                       </div>
                    </div>
                 </div>
              </section>

              <div className="pt-10 pb-20">
                <button className="w-full py-8 bg-[#00ADEF] text-white rounded-[32px] font-black text-2xl shadow-[0_25px_60px_-12px_rgba(0,173,239,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.25em] flex items-center justify-center gap-5 group">
                   Deploy Personnel <ShieldCheck size={32} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default UserOnboarding;
