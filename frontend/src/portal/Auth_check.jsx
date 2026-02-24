import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

export default function Auth_check({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const url = import.meta.env.VITE_API_URL
  console.log("in front end check");
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/checkauth`,
          { withCredentials: true }
        );

        console.log();
        

        if (res.data.success) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Checking authentication...</div>;

  if (!isAuth) return <Navigate to="/login" />;

  return (
    children
  )
}
