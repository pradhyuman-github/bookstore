import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../config/api";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/users/admin-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, createPassword: password })
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin", "true");
        
        setMessage("Admin login successful", "success");
 
        setTimeout(() => {
          navigate("/admin");
        }, 2000);

      }
      else {
        setMessage(data.message, "error");
      }

    }
    catch(err) {
      console.log(err);

      setMessage("Server error", "error");
    }
  };

  useEffect(() => {
    const checkAdmin = async() => {
      try {
        const res = await fetch(`${API}/users/user-profile`, { credentials: "include" });
        const data = await res.json();

        if(data.success && data.user?.role === "admin") {
          navigate("/admin", { replace: true });
        }
      }
      catch(err) {
        console.log("Check admin error: ", err);
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Admin Login
          </h1>

          <p className="text-slate-300 mt-3 text-sm">
            Access the admin dashboard securely
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={ (e) => setEmail(e.target.value) }
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={ (e) => setPassword(e.target.value) }
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition-all duration-200"
          >
            Login
          </button>
        </form>

        {message && (
          <p className={`mt-5 text-center text-sm font-medium px-4 py-3 rounded-xl 
            ${message.toLowerCase().includes("success")
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message}
          </p>
          )
        }

      </div>
    </div>
  );
};
