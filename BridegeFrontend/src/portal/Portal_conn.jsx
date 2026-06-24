
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


import LicenseRow from "./LicenseRow"
import axios from 'axios';
import { API_BASE_URL } from '../FinalApi';
const Portal_conn = () => {
const [data,dataset] = useState([]);
  useEffect(() => {
    const dataXX = async () => {
      try {
        console.log("hello");

        const res = await axios.get(`${API_BASE_URL}/api/getLicense`, { withCredentials: true });
        dataset(res.data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    dataXX();
  },[])
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">License Management</h1>
          <p className="text-slate-500 text-sm">Monitor and configure your active trading licenses.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/20">
          Add Key
        </button>
      </div>

      <div className="bg-[#11151C]/50 border border-slate-800 rounded-3xl p-1 overflow-hidden">
        {/* Header Only for Desktop */}
        <div className="hidden  md:flex justify-evenly px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
          <span className="w-1/4">License Key</span>
          <span className="w-1/4">Owner</span>
          <span className="w-1/6">Status</span>
          <span className="w-1/6">Algo On / Off</span>
        </div>

        <div className="p-2 space-y-2 overflow-hidden">

          {
            data.map((e)=>{
              return(          <LicenseRow key={e.licenseKey} licenseKey= {e.licenseKey} initialUser={e.licenseName} initialType="Algo" status={e.status} />
)
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Portal_conn