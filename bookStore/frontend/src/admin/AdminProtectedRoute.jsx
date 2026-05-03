import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export default function AdminProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/users/admin-check",
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