import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Auth_check = ({ children }) => {

  const [auth, setAuth] = useState(null);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        await axios.get(
          "https://bridge-etn0.onrender.com/api/checkauth",
          { withCredentials: true }
        );

        setAuth(true);

      } catch (error) {

        setAuth(false);

      }
    };

    checkAuth();

  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return auth ? children : <Navigate to="/login" />;

};

export default Auth_check;
