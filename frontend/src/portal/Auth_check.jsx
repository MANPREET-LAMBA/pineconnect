import { useState,useEffect } from "react";
const  Auth_check = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(true); // Mocked for preview

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center space-y-4">
       <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
       <p className="text-slate-400 font-medium animate-pulse">Initializing Terminal...</p>
    </div>
  );

  return children;
};

export default Auth_check;

