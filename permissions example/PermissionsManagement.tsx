
import React, { useState, useMemo } from 'react';
import { 
  Shield, Lock, Unlock, Search, Users, ShieldCheck, UserCheck, 
  AlertTriangle, Save, RefreshCw, Layers,
  ChevronDown, X, Check, Globe, Laptop, Building2,
  ShieldAlert, Settings, UserSquare, Filter, Zap,
  Sparkles, CheckCircle2, Key, Info
} from 'lucide-react';
import { AVAILABLE_PERMISSIONS, MOCK_USERS } from '../../constants';
import { UserRole } from '../../types';

const PermissionsManagement: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'role' | 'user'>('role');
  const [selectedRoleId, setSelectedRoleId] = useState<UserRole>('student');
  const [selectedUserId, setSelectedUserId] = useState<string>(MOCK_USERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionFilter, setPermissionFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'System': true,
    'Infrastructure': true,
    'Personnel': true,
    'Community': true,
  });

  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    manager: AVAILABLE_PERMISSIONS.map(p => p.id),
    cx_leader: ['view_dashboard', 'manage_blocks', 'manage_groups', 'edit_users', 'create_post', 'moderate_content'],
    block_admin: ['view_dashboard', 'manage_blocks', 'create_post', 'moderate_content'],
    instructor: ['view_dashboard', 'create_post', 'view_exams'],
    student: ['create_post'],
  });

  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>(
    Object.fromEntries(MOCK_USERS.map(u => [u.id, u.permissions || []]))
  );

  const currentPermissions = selectedType === 'role' 
    ? rolePermissions[selectedRoleId] || [] 
    : userPermissions[selectedUserId] || [];

  const isAllSelected = currentPermissions.length === AVAILABLE_PERMISSIONS.length;

  const togglePermission = (permissionId: string) => {
    if (selectedType === 'role') {
      setRolePermissions(prev => {
        const current = prev[selectedRoleId] || [];
        const next = current.includes(permissionId)
          ? current.filter(id => id !== permissionId)
          : [...current, permissionId];
        return { ...prev, [selectedRoleId]: next };
      });
    } else {
      setUserPermissions(prev => {
        const current = prev[selectedUserId] || [];
        const next = current.includes(permissionId)
          ? current.filter(id => id !== permissionId)
          : [...current, permissionId];
        return { ...prev, [selectedUserId]: next };
      });
    }
  };

  const selectAll = () => {
    const allIds = AVAILABLE_PERMISSIONS.map(p => p.id);
    if (selectedType === 'role') {
      setRolePermissions(prev => ({ ...prev, [selectedRoleId]: allIds }));
    } else {
      setUserPermissions(prev => ({ ...prev, [selectedUserId]: allIds }));
    }
  };

  const clearAll = () => {
    if (selectedType === 'role') {
      setRolePermissions(prev => ({ ...prev, [selectedRoleId]: [] }));
    } else {
      setUserPermissions(prev => ({ ...prev, [selectedUserId]: [] }));
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Security Matrix Synchronized.');
    }, 1200);
  };

  const roles: { id: UserRole; label: string; icon: any; color: string; ring: string; desc: string }[] = [
    { id: 'manager', label: 'Global Manager', icon: ShieldCheck, color: 'bg-slate-900', ring: 'ring-slate-100', desc: 'L1 Authority' },
    { id: 'cx_leader', label: 'Core Leader', icon: Zap, color: 'bg-indigo-600', ring: 'ring-indigo-50', desc: 'L2 HQ Lead' },
    { id: 'block_admin', label: 'Squad Admin', icon: Building2, color: 'bg-[#00ADEF]', ring: 'ring-blue-50', desc: 'L3 Hub Mgr' },
    { id: 'instructor', label: 'Team Member', icon: UserCheck, color: 'bg-emerald-500', ring: 'ring-emerald-50', desc: 'L4 Specialist' },
    { id: 'student', label: 'General User', icon: Users, color: 'bg-slate-400', ring: 'ring-slate-50', desc: 'L5 Member' },
  ];

  const categories = Array.from(new Set(AVAILABLE_PERMISSIONS.map(p => p.category)));
  const filteredUsers = MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId);

  return (
    <div className="p-8 max-w-7xl mx-auto pb-40 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Dynamic Security Badge */}
      {isAllSelected && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500 flex justify-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full px-10 py-3 flex items-center gap-4 shadow-2xl shadow-amber-200 border-2 border-white/30 backdrop-blur-sm">
            <ShieldAlert size={20} className="animate-pulse" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Global Bypass: Maximum Authorization Mode</p>
            <button onClick={clearAll} className="px-4 py-1.5 bg-white/20 hover:bg-white/40 rounded-full text-[9px] font-black uppercase tracking-widest transition-all">Reset Guard</button>
          </div>
        </div>
      )}

      {/* Modern Pill Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-[#00ADEF] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 transform -rotate-6">
              <Key size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-1">Matrix Control</h1>
              <p className="text-slate-400 font-bold text-base tracking-tight">Synchronize organizational access protocols.</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex bg-white p-2 rounded-full border border-slate-100 shadow-2xl">
              <button 
                onClick={selectAll} 
                className="whitespace-nowrap flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 group"
              >
                <Unlock size={14} strokeWidth={3} className="transition-transform group-hover:rotate-12" /> Grant All
              </button>
              <button 
                onClick={clearAll} 
                className="whitespace-nowrap flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                <Lock size={14} strokeWidth={3} /> Revoke All
              </button>
           </div>
           
           <button 
             onClick={handleSave} 
             className="whitespace-nowrap flex items-center gap-3 px-10 py-5 bg-slate-900 text-white hover:bg-emerald-500 rounded-full font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl hover:shadow-emerald-200 hover:scale-[1.05] active:scale-95 border-b-4 border-black/20"
           >
             {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <><Save size={16} /> Sync Matrix</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10 items-start">
        
        {/* Entity Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-32 animate-in slide-in-from-left-12 duration-700">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
             <div className="flex bg-slate-50 p-2 rounded-3xl mb-8">
                <button 
                  onClick={() => setSelectedType('role')} 
                  className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'role' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Roles
                </button>
                <button 
                  onClick={() => setSelectedType('user')} 
                  className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'user' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Users
                </button>
             </div>

             {selectedType === 'role' ? (
               <div className="space-y-3">
                  {roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all border-2 transform hover:scale-[1.02] active:scale-95 ${selectedRoleId === role.id ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}
                    >
                       <div className={`p-2 rounded-xl transition-all ${selectedRoleId === role.id ? 'bg-white/10' : role.color + ' text-white'}`}>
                          <role.icon size={18} strokeWidth={2.5} />
                       </div>
                       <div className="text-left overflow-hidden">
                          <p className="font-black text-[11px] uppercase tracking-tighter truncate leading-none">{role.label}</p>
                          <p className={`text-[8px] font-bold uppercase mt-1 opacity-60 tracking-wider whitespace-nowrap ${selectedRoleId === role.id ? 'text-white' : 'text-slate-400'}`}>{role.desc}</p>
                       </div>
                    </button>
                  ))}
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Find personnel..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full bg-slate-50 border-none rounded-[20px] py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300" 
                    />
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
                     {filteredUsers.map(user => (
                       <button 
                         key={user.id} 
                         onClick={() => setSelectedUserId(user.id)} 
                         className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl transition-all ${selectedUserId === user.id ? 'bg-[#00ADEF] text-white shadow-xl shadow-blue-100' : 'hover:bg-slate-50 text-slate-500'}`}
                       >
                          <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/20" alt=""/>
                          <div className="text-left truncate">
                            <p className="font-black text-[11px] truncate leading-none mb-1">{user.name}</p>
                            <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${selectedUserId === user.id ? 'text-white/70' : 'text-slate-400'}`}>{user.role}</p>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="col-span-12 lg:col-span-9 space-y-6 animate-in slide-in-from-right-12 duration-700">
          <div className="bg-white rounded-[56px] border border-slate-100 shadow-sm overflow-hidden">
             
             {/* Dynamic Sub-Header */}
             <div className="px-12 py-10 border-b border-slate-50 bg-slate-50/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-slate-900 text-white rounded-[28px] flex items-center justify-center shadow-2xl ring-[12px] ring-slate-100 transition-all hover:rotate-6">
                      <Layers size={32} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">
                         {selectedType === 'role' ? roles.find(r => r.id === selectedRoleId)?.label : selectedUser?.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-[#00ADEF]/10 text-[#00ADEF] rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Verified Hub Auth</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Schema Sync: {currentPermissions.length} / {AVAILABLE_PERMISSIONS.length}</p>
                      </div>
                   </div>
                </div>
                
                <div className="relative max-w-sm w-full">
                  <input 
                    type="text" 
                    placeholder="Search Permissions Matrix..." 
                    value={permissionFilter}
                    onChange={(e) => setPermissionFilter(e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-full py-4 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-blue-50/50 transition-all shadow-sm"
                  />
                  <Filter size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
             </div>

             {/* Permission Category Modules */}
             <div className="divide-y divide-slate-50">
               {categories.map((category) => {
                 const perms = AVAILABLE_PERMISSIONS.filter(p => 
                   p.category === category && 
                   (p.label.toLowerCase().includes(permissionFilter.toLowerCase()) || p.category.toLowerCase().includes(permissionFilter.toLowerCase()))
                 );
                 if (perms.length === 0) return null;

                 const activeCount = perms.filter(p => currentPermissions.includes(p.id)).length;
                 const isExpanded = expandedCategories[category];

                 // Category specific colors
                 const catColor = 
                    category === 'System' ? 'text-blue-500' :
                    category === 'Infrastructure' ? 'text-indigo-500' :
                    category === 'Personnel' ? 'text-emerald-500' :
                    category === 'Community' ? 'text-purple-500' : 'text-slate-500';

                 const catBg = 
                    category === 'System' ? 'bg-blue-500' :
                    category === 'Infrastructure' ? 'bg-indigo-500' :
                    category === 'Personnel' ? 'bg-emerald-500' :
                    category === 'Community' ? 'bg-purple-500' : 'bg-slate-500';

                 return (
                   <div key={category} className="transition-all animate-in fade-in slide-in-from-top-4">
                      <button 
                        onClick={() => toggleCategory(category)}
                        className={`w-full px-12 py-8 flex items-center justify-between hover:bg-slate-50/50 transition-all ${isExpanded ? 'bg-slate-50/5' : ''}`}
                      >
                         <div className="flex items-center gap-6">
                            <div className="h-12 w-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                               <div className={`w-full ${catBg} transition-all duration-1000 ease-out`} style={{ height: `${(activeCount / perms.length) * 100}%` }}></div>
                            </div>
                            <div>
                              <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-[0.25em]">{category} Layer</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Functional Security Cluster</p>
                            </div>
                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black transition-all border flex items-center gap-2 ${activeCount > 0 ? `bg-white ${catColor} border-slate-100 shadow-lg` : 'bg-slate-50 text-slate-400 border-transparent'}`}>
                               <Shield size={12} strokeWidth={3} /> {activeCount} / {perms.length} Active
                            </div>
                         </div>
                         <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-slate-900 text-white rotate-180 shadow-2xl' : 'bg-slate-50 text-slate-400'}`}>
                            <ChevronDown size={24} />
                         </div>
                      </button>

                      {isExpanded && (
                        <div className="px-12 pb-14 pt-2 animate-in slide-in-from-top-6 duration-500">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {perms.map(p => {
                                const isActive = currentPermissions.includes(p.id);
                                return (
                                  <button
                                    key={p.id}
                                    onClick={() => togglePermission(p.id)}
                                    className={`group relative flex items-start gap-5 p-7 rounded-[36px] border-2 text-left transition-all hover:scale-[1.03] active:scale-95 ${isActive ? `bg-white border-2 border-slate-100 shadow-2xl` : 'bg-[#fcfdfe] border-transparent hover:border-slate-200'}`}
                                  >
                                     <div className={`mt-0.5 w-10 h-10 rounded-[18px] flex items-center justify-center transition-all border-2 ${isActive ? `${catBg} text-white border-white shadow-xl rotate-12` : 'bg-white text-slate-200 border-slate-50'}`}>
                                        {isActive ? <Check size={22} strokeWidth={4} /> : null}
                                     </div>
                                     <div className="flex-1">
                                        <p className={`font-black text-[13px] uppercase tracking-wider mb-2 transition-colors whitespace-nowrap overflow-hidden truncate ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{p.label}</p>
                                        <p className={`text-[11px] leading-relaxed font-bold transition-colors ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{p.description}</p>
                                     </div>
                                     {isActive && (
                                       <div className="absolute top-6 right-8">
                                         <Sparkles size={16} className={catColor} />
                                       </div>
                                     )}
                                  </button>
                                );
                              })}
                           </div>
                        </div>
                      )}
                   </div>
                 );
               })}
             </div>
          </div>
          
          {/* Subtle Audit Note */}
          <div className="flex items-center justify-center gap-3 py-10 opacity-40">
            <Info size={14} className="text-slate-400" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academy L1 Audit Logs are generated for every schema synchronization</p>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PermissionsManagement;
