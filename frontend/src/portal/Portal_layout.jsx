import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Zap, 
  Hand, 
  Link as LinkIcon, 
  Menu, 
  X, 
  Pencil, 
  Copy, 
  CheckCircle2,
  ChevronRight,
  User,
  LogOut,
  Cpu
} from 'lucide-react';
import Portal_conn from '../portal/Portal_conn';

export default function Portal_layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Connection');

  const navItems = [
    { id: 'Connection', icon: LinkIcon, label: 'Connection' },
    { id: 'Algo', icon: Zap, label: 'Algo Settings' },
    { id: 'Manual', icon: Hand, label: 'Manual Handle' },
  ];

  return (
   
      <div className="min-h-screen overflow-hidden bg-[#0B0E14] text-slate-300 font-sans">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#11151C] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-black text-white italic">P</div>
            <span className="font-bold text-white tracking-tighter uppercase">PineConnect</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Container */}
        <div className="flex h-screen overflow-hidden">
          
          {/* SIDEBAR */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-[#11151C] border-r border-slate-800 transform transition-transform duration-300 lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Sidebar Glow Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-purple-600/5 blur-3xl -z-10" />
            
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div className="p-8 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-900/50 rotate-3">
                    <Cpu className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-xl text-white tracking-tighter leading-tight italic">PINE</h2>
                    <p className="text-[10px] text-purple-500 font-bold tracking-widest uppercase">Connect v2.4</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-1.5 mt-4 lg:mt-0">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-200
                      ${activeTab === item.id 
                        ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/20' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                      <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight size={14} />}
                  </button>
                ))}
              </nav>

              {/* User Profile Footer */}
              <div className="p-4 m-4 rounded-2xl bg-slate-800/20 border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">Sohaib_User</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Plan</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors border-t border-slate-800 pt-3">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-x-hidden overflow-y-scroll bg-[#0B0E14] relative">
            {/* Background Accent */}
            <div className="absolute top-[-10%] right-[-5%] w-1/3 h-1/3 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
              {/* Render content based on tab */}
              {activeTab === 'Connection' && <Portal_conn />}
              {activeTab === 'Algo' && (
                 <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
                    <Zap size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">Algo Configuration coming soon...</p>
                 </div>
              )}
              {activeTab === 'Manual' && (
                 <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
                    <Hand size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">Manual Controls coming soon...</p>
                 </div>
              )}
            </div>
          </main>
        </div>
      </div>
   
  );
}