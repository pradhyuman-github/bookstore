import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import API from "../config/api";

export default function AdminProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch(`${API}/users/admin-check`,
      {
        credentials: "include"
      }
    )
    .then(res => {
        if (res.ok) {
            setAuthorized(true);
        }

        setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });

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