import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import API from "../config/api";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState(""); 

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const res = await fetch(`${API}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                credentials: "include",
                body: JSON.stringify({ email , createPassword: password }),
            });

            const data = await res.json();

            if(!res.ok) {
                setMessage(data.message || "Login failed");
                setType("error");
                return;
            }

            setUser(data.user);

            console.log("Login successful", data);

            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage("Login successful");
            setType("success");

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1000);

        }
        catch(err) {
            setMessage("Sever error");
            console.log(err);
        }
    };

    useEffect(() => {
        if(message) {
            const timer = setTimeout(() => {
                setMessage("");
                setType("");
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      
            <form 
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5">
        
            <h2 className="text-3xl font-bold text-center text-gray-800">
                Login
            </h2>

            {/* Username */}
            <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@gmail.com"
                    className={"bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"}
                />
            </div>

            {/* Password */}
            <div className="flex flex-col">
                <label htmlFor="password" className="mb-1 text-gray-700 font-medium">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Button */}
            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
                Login
            </button>

            {message && (
                <p className={`text-center text-sm p-2 rounded ${
                    type === "success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                    }`} 
                > 
                    {message} 
                </p>
            )}

            {/* Links */}
            <div className="flex justify-between text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                    Forgot Password?
                </a>
                
                <Link to="/register" className="text-blue-600 hover:underline">
                    Create Account
                </Link>
            </div>

      </form>

    </div>
    );
}