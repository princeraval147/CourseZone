import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: "include", // ✅ Send cookies for auth
        });

        if (!response.ok) throw new Error("Unauthorized");

        const role = await response.json();
        console.log("User Role:", role);

        if (role !== "instructor") {
          navigate(-1); // 🔄 Redirect to the previous page
          return;
        }

        setIsAdmin(true); // ✅ User is an admin
      } catch (error) {
        setIsAdmin(false); // ❌ Not an admin, redirect
        navigate(-1); // 🔄 Redirect to previous page
      }
    };

    checkAdmin();
  }, [navigate]);

  return isAdmin;
};

export default useAdminAuth;
