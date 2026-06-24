import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../Api";

const Auth_check = ({ children }) => {

  const [auth, setAuth] = useState(null);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        await axios.get(
          `${API_BASE_URL}/api/checkauth`,
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
