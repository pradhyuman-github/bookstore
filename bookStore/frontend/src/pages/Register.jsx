import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Register() {
    const [message, setMessage] = useState("");
    const [type, setType] = useState(""); 

    const [formData, setFormData] = useState({
        username: "",
        contact: "",
        email: "",
        createPassword: "",
        confirmPassword: "",
    });

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    
const handleSubmitBtn = async (e) => {
    e.preventDefault();

    // password check
    if (formData.createPassword !== formData.confirmPassword) {
        alert("Password and Confirm Password do not match!");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log(data);

        if(res.ok) {
            setMessage("Register successful");
            setType("success");

            const userToStore = {
                _id: data.data._id,
                username: data.data.username,
                contact: data.data.contact,
                email: data.data.email,
            };
            localStorage.setItem("user", JSON.stringify(userToStore));

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }
        else {
            setMessage("Register failed");
            setType("error");
        }

    } 
    catch (err) {
        setMessage("Server error");
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
        <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
      
            <form 
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5"
                onSubmit={handleSubmitBtn}
            >
        
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Register
                </h2>

                {/* Name */}
                <div className="flex flex-col">
                    <label htmlFor="username" className="mb-1 font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter name"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                    <label htmlFor="contactNo" className="mb-1 font-medium text-gray-700">
                        Contact Number
                    </label>
                    <input
                        id="contactNo"
                        name="contact"
                        type="tel"
                        pattern="[6-9]{1}[0-9]{9}"
                        maxLength="10"
                        placeholder="Enter 10-digit number"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label htmlFor="createPassword" className="mb-1 font-medium text-gray-700">
                        Create Password
                    </label>
                    <input
                        id="createPassword"
                        name="createPassword"
                        type="password"
                        placeholder="Enter password"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="mb-1 font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                >
                    Submit
                </button>

                {message && (
                    <p className={`text-center text-sm p-2 rounded ${
                        type === "success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                        }`} 
                    > 
                        {message} 
                    </p>
                )}

                <div>
                    <Link to="/login" className="text-purple-600 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>

            </form>

        </div>
    );
}