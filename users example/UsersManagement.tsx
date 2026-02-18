
import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Download, 
  ChevronUp, ChevronDown, MoreVertical, 
  Star, Edit2, Trash2, Mail, Phone, History, 
  X, ShieldCheck, UserPlus, Building2, BarChart3
} from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { User, UserActivity } from '../../types';
import UserOnboarding from '../Blocks/UserOnboarding';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortKey, setSortKey] = useState<'name' | 'points' | 'level'>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') {
      list = list.filter(u => u.role === roleFilter);
    }
    return list.sort((a, b) => {
      let valA: any = a[sortKey as keyof User] || 0;
      let valB: any = b[sortKey as keyof User] || 0;
      if (sortKey === 'level') {
        valA = a.gradeLevel || 0;
        valB = b.gradeLevel || 0;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchQuery, roleFilter, sortKey, sortOrder]);

  const toggleSort = (key: 'name' | 'points' | 'level') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const UserDetailModal = ({ user, onClose }: { user: User, onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right-full duration-500 relative flex flex-col no-scrollbar">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <ShieldCheck size={24} className="text-blue-500" /> User Profile Vault
          </h3>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-12">
          <div className="flex items-center gap-8 mb-12">
            <div className="relative">
              <img src={user.avatar} className="w-28 h-28 rounded-[36px] border-[6px] border-white shadow-2xl object-cover ring-1 ring-slate-100" alt=""/>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                <Star size={16} fill="currentColor" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{user.name}</h2>
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase bg-slate-900 text-white shadow-lg shadow-slate-200">
                  {user.role.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  LvL {user.gradeLevel || 'S'} Rank
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 group hover:bg-white transition-all">
               <Mail size={16} className="text-blue-500 mb-3" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
               <p className="text-sm font-bold text-slate-900 break-all">{user.email}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 group hover:bg-white transition-all">
               <Phone size={16} className="text-emerald-500 mb-3" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
               <p className="text-sm font-bold text-slate-900">{user.phone || 'N/A'}</p>
            </div>
          </div>

          {/* HR Performance KPIs Section */}
          {user.kpis && user.kpis.length > 0 && (
            <div className="mb-12">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 size={16} className="text-[#00ADEF]" /> Performance KPIs
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {user.kpis.map((kpi, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 hover:bg-white transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.name}</p>
                      <p className="text-sm font-black text-slate-900">{kpi.score}%</p>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#00ADEF] to-blue-600 transition-all duration-1000" 
                        style={{ width: `${kpi.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-12">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <History size={16} /> Activity History
            </h4>
            <div className="space-y-6 relative pl-6 border-l-2 border-slate-100 ml-2">
              {user.history && user.history.length > 0 ? (
                user.history.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-1">{log.timestamp}</p>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{log.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-sm">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-10 max-w-7xl mx-auto pb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">Users Directory</h1>
          <p className="text-slate-400 font-bold text-xl tracking-tight max-w-2xl leading-relaxed">
             Global directory for all students, mentors, and administrators.
          </p>
        </div>
        <button onClick={() => setShowOnboarding(true)} className="flex items-center justify-center gap-4 px-10 py-6 bg-black text-white rounded-[32px] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl w-full md:w-auto">
           <UserPlus size={24} /> Register New User
        </button>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-slate-50/20">
          <div className="relative flex-1 max-w-lg">
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-[28px] py-5 pl-14 pr-6 text-sm font-bold outline-none focus:border-[#00ADEF] transition-all" 
            />
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
          <div className="flex flex-wrap gap-4">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border-2 border-slate-100 rounded-[24px] px-6 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-[#00ADEF] shadow-sm appearance-none min-w-[180px]"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="block_admin">Admins</option>
            </select>
            <button className="p-4 bg-white border-2 border-slate-100 rounded-[24px] text-slate-400 hover:text-slate-900 shadow-sm transition-all"><Download size={20}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">User Entity {sortKey === 'name' && (sortOrder === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}</div>
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer" onClick={() => toggleSort('level')}>
                  <div className="flex items-center gap-1">Rank/LvL {sortKey === 'level' && (sortOrder === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}</div>
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Assignment</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer" onClick={() => toggleSort('points')}>
                  <div className="flex items-center gap-1">XP Points {sortKey === 'points' && (sortOrder === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}</div>
                </th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="group hover:bg-slate-50/40 transition-all cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <img src={user.avatar} className="w-14 h-14 rounded-[20px] shadow-lg border-2 border-white object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-[#00ADEF] transition-colors text-lg tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">LvL {user.gradeLevel || 'S'}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Building2 size={16} className="text-slate-300" />
                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{user.blockId || 'Global HQ'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Star size={16} className="text-amber-500 fill-amber-500" />
                       <span className="text-lg font-black text-slate-900 tracking-tighter">{user.points?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={(e) => { e.stopPropagation(); }} className="p-3 bg-white text-slate-400 hover:text-blue-500 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all"><Edit2 size={16}/></button>
                       <button onClick={(e) => { e.stopPropagation(); }} className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {showOnboarding && <UserOnboarding onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default UsersManagement;
