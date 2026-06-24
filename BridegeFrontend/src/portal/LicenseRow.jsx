import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {API_BASE} from "../FinalApi"

 // adjust if needed

// Reusable PATCH helper
const patchLicense = async (licenseKey, endpoint, body) => {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(licenseKey)}/${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
};

const LicenseRow = ({ licenseKey, initialUser, initialType, status }) => {
  const [username, setUsername]       = useState(initialUser);
  const [isEditing, setIsEditing]     = useState(false);
  const [type, setType]               = useState(initialType);
  const [copied, setCopied]           = useState(false);

  // Per-field save states: "idle" | "saving" | "saved" | "error"
  const [ownerState, setOwnerState]   = useState("idle");
  const [modeState, setModeState]     = useState("idle");

  // Debounce ref for owner updates
  const ownerTimer = useRef(null);

  // ── Owner: save on blur ────────────────────────────────────────────────────
  const handleOwnerBlur = async () => {
    setIsEditing(false);
    if (username.trim() === initialUser) return; // nothing changed

    setOwnerState("saving");
    try {
      await patchLicense(licenseKey, "owner", { username: username.trim() });
      setOwnerState("saved");
    } catch {
      setOwnerState("error");
      setUsername(initialUser); // revert on failure
    } finally {
      setTimeout(() => setOwnerState("idle"), 6500);
    }
  };

  // ── Mode: save immediately on select change ────────────────────────────────
  const handleModeChange = async (e) => {
    const newMode = e.target.value;
    setType(newMode);
    setModeState("saving");
    try {
      await patchLicense(licenseKey, "mode", { mode: newMode });
      setModeState("saved");
    } catch {
      setModeState("error");
      setType(type); // revert
    } finally {
      setTimeout(() => setModeState("idle"), 6500);
    }
  };

  // ── Copy key ───────────────────────────────────────────────────────────────
  const copyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const SaveIndicator = ({ state }) => {
    if (state === "saving") return <Loader2 size={13} className="text-purple-400 animate-spin" />;
    if (state === "saved")  return <CheckCircle2 size={13} className="text-emerald-400" />;
    if (state === "error")  return <AlertCircle size={13} className="text-red-400" />;
    return null;
  };

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11151C] hover:bg-[#161B22] p-4 md:px-6 md:py-4 rounded-2xl border border-slate-800 transition-all">

      {/* ── License Key ─────────────────────────────────────────────────── */}
      <div className="w-full md:w-1/4">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          License Key
        </label>
        <div onClick={copyLicense} className="flex items-center gap-2 cursor-pointer">
          <code className="text-purple-400 font-mono text-sm group-hover:text-purple-300 transition-colors truncate">
            {licenseKey}
          </code>
          {copied
            ? <CheckCircle2 size={14} className="text-emerald-500" />
            : <Copy size={14} className="text-slate-600" />}
        </div>
      </div>

      {/* ── Owner / Username ─────────────────────────────────────────────── */}
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
              onBlur={handleOwnerBlur}
              onKeyDown={(e) => e.key === "Enter" && handleOwnerBlur()}
              className="bg-slate-800 border border-purple-500/50 rounded px-2 py-0.5 text-sm outline-none w-full"
            />
          ) : (
            <>
              <span className="text-slate-200 text-sm font-medium">{username}</span>
              <Pencil
                size={14}
                className="text-slate-500 cursor-pointer hover:text-purple-400"
                onClick={() => setIsEditing(true)}
              />
            </>
          )}
          <SaveIndicator state={ownerState} />
        </div>
        {ownerState === "error" && (
          <p className="text-red-400 text-[10px] mt-1">Failed to save. Reverted.</p>
        )}
      </div>

      {/* ── Status ──────────────────────────────────────────────────────── */}
      <div className="w-full md:w-1/6">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          Status
        </label>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {status}
        </span>
      </div>

      {/* ── Mode Select ─────────────────────────────────────────────────── */}
      <div className="w-full md:w-1/6">
        <label className="md:hidden text-[10px] text-slate-500 uppercase font-bold mb-1 block">
          Mode
        </label>
        <div className="flex items-center gap-2">
          <select
            value={type}
            onChange={handleModeChange}
            disabled={modeState === "saving"}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1.5 w-full outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
          >
            <option value="ON">ON</option>
            <option value="OFF">OFF</option>
          </select>
          <SaveIndicator state={modeState} />
        </div>
        {modeState === "error" && (
          <p className="text-red-400 text-[10px] mt-1">Failed to save. Reverted.</p>
        )}
      </div>

    </div>
  );
};

export default LicenseRow;