import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import API from "../config/api";

export default function AdminProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async() => {
      try {
        const res = await fetch(`${API}/users/admin-check`,
          { credentials: "include" }
        );

        const data = await res.json();

        if(res.ok && data.success) {
          setAuthorized(true);
        }
        else {
          setAuthorized(false);
        }
      }
      catch(err) {
        console.log(err);
        setAuthorized(false);
      }
      finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return (
        <Navigate
            to="/admin/login"
            replace
        />
    );
  }

  return children;
}