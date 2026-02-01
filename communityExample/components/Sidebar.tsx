
import React from 'react';
import { 
  Folder, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Users, 
  HelpCircle, 
  UserCircle, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'exams', label: 'Final Exams', icon: GraduationCap },
  { id: 'schedule', label: 'My Schedule', icon: Calendar },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'management', label: 'Community Management', icon: ShieldCheck },
  { id: 'support', label: 'Support & Help', icon: HelpCircle },
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 bg-[#00ADEF] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">3C</div>
          <h1 className="text-gray-800 font-bold text-[11px] leading-tight uppercase tracking-wider">
            3C ONLINE<br/><span className="text-[#00ADEF]">CODING SCHOOL</span>
          </h1>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E0F4FF] text-[#00ADEF] font-semibold active-tab-shadow'
                    : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 text-[11px] text-[#94a3b8] font-medium">
        © 2026 3C Coding School
      </div>
    </div>
  );
};

export default Sidebar;
