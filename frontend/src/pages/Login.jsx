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
        <div 
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-no-repeat bg-position-[70%_center] md:bg-center"
            style={{ backgroundImage: "url('bgLogin.png')"}}
        >
            <div className="absolute inset-0 bg-[#020912]/30"></div>
      
            <form 
                onSubmit={handleSubmit}
                className="relative z-10 w-full max-w-md bg-transparent backdrop-blur-xs p-8 rounded-2xl shadow-lg space-y-5 border border-primaryDarkColor">
        
            <h2 className="text-3xl font-bold text-center text-primaryColor">
                Login
            </h2>

            {/* Username */}
            <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-textSecondaryColor font-semibold">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@gmail.com"
                    className={"bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"}
                />
            </div>

            {/* Password */}
            <div className="flex flex-col">
                <label htmlFor="password" className="mb-1 text-textSecondaryColor font-semibold">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"
                />
            </div>

            {/* Button */}
            <button
                type="submit"
                className="w-full py-2 bg-primaryColor text-black font-semibold rounded-lg hover:bg-primaryHoverColor cursor-pointer transition duration-200"
            >
                Login
            </button>

            {message && (
                <p className={`flex items-center justify-center gap-2 text-sm p-2 rounded 
                    ${ type === "success" 
                        ? "ri-shield-check-fill text-green-500 bg-green-100/15 backdrop-blur-sm border" 
                        : "ri-close-circle-fill text-red-500 bg-red-100/15 backdrop-blur-sm border"
                    }`} 
                > 
                    {message} 
                </p>
            )}

            {/* Links */}
            <div className="flex justify-between text-sm">
                <a href="#" className="text-starColor hover:underline">
                    Forgot Password?
                </a>
                
                <Link to="/register" className="text-starColor hover:underline">
                    Create Account
                </Link>
            </div>

      </form>

    </div>
    );
}