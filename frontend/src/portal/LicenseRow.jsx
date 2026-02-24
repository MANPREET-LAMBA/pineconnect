import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';

export default function LicenseRow() {
  const [username, setUsername] = useState("Sohaib");
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState("Algo");

  const licenseKey = "LIC-8X92-KD92-PL01";
  const status = "Active";

  const copyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    notify();
    
  };

  const notify = () => toast("Wow so easy!");

  return (
    <div className="p-3">
        <div className="w-full flex items-center justify-between bg-[#0f0f14] text-white px-4 py-3 rounded-xl border border-purple-500/40">

      {/* License */}
      <div
        onClick={copyLicense}
        
        className="w-full cursor-pointer text-purple-400 hover:text-purple-300"
      >
        {licenseKey}
        <ToastContainer  />
      </div>

      {/* Username */}
      <div className="w-full flex items-center gap-2 px-3">
        {isEditing ? (
          <input
            value={username}
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
            className="bg-transparent border-b border-purple-500 outline-none w-full"
          />
        ) : (
          <>
            <span>{username}</span>
            <Pencil
              size={16}
              className="cursor-pointer text-purple-400 hover:text-purple-300"
              onClick={() => setIsEditing(true)}
            />
          </>
        )}
      </div>

      {/* Status */}
      <div className="w-full pl-3">
        <span className="px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-400">
          {status}
        </span>
      </div>

       <div className="w-full pl-3 ">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-[#0f0f14] border  border-purple-500/30 rounded-md px-3 py-1 outline-none"
        >
          <option value="Algo">Algo</option>
          <option value="Manual">Manual</option>
        </select>
      </div>
    </div>
    </div>
  );
}
