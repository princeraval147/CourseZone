// hooks/useAuth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized");

        setIsAuthenticated(true); // User is authenticated
      } catch (error) {
        setIsAuthenticated(false); // User is not authenticated
        navigate("/login", { replace: true });
      }
    };

    checkProfile();
  }, [navigate]);

  return isAuthenticated;
};

export default useAuth;
