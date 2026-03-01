import React, { useState, useEffect } from "react";
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
  Cpu,
} from "lucide-react";

const LicenseRow = ({ licenseKey, initialUser, initialType, status }) => {
  const [username, setUsername] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(initialType);
  const [copied, setCopied] = useState(false);

  const copyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11151C] hover:bg-[#161B22] p-4 md:px-6 md:py-4 rounded-2xl border border-slate-800 transition-all">
      {/* Key Info */}
      <div className="w-full md:w-1/4">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          License Key
        </label>
        <div
          onClick={copyLicense}
          className="flex items-center gap-2 cursor-pointer"
        >
          <code className="text-purple-400 font-mono text-sm group-hover:text-purple-300 transition-colors truncate">
            {licenseKey}
          </code>
          {copied ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <Copy size={14} className="text-slate-600" />
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="w-full md:w-1/4">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          Username
        </label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setIsEditing(false)}
              className="bg-slate-800 border border-purple-500/50 rounded px-2 py-0.5 text-sm outline-none w-full"
            />
          ) : (
            <>
              <span className="text-slate-200 text-sm font-medium">
                {username}
              </span>
              <Pencil
                size={14}
                className="text-slate-500 cursor-pointer hover:text-purple-400"
                onClick={() => setIsEditing(true)}
              />
            </>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="w-full md:w-1/6">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          Status
        </label>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {status}
        </span>
      </div>

      {/* Mode Select */}
      <div className="w-full md:w-1/6">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          Mode
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1.5 w-full outline-none focus:border-purple-500/50 transition-colors"
        >
          <option value="Algo">Algorithm</option>
          <option value="Manual">Manual Handle</option>
        </select>
      </div>
    </div>
  );
};

export default LicenseRow;
