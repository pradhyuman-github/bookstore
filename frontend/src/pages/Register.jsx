import { useState, useEffect } from "react";
import { Link } from "react-router";
import API from "../config/api";

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
            const res = await fetch(`${API}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
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
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setType("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);


    return (
        <div
            className="min-h-screen flex items-center justify-center px-5 py-6 sm:py-0 bg-cover bg-no-repeat bg-position-[25%_center] md:bg-center"
            style={{ backgroundImage: "url('bgRegister.png')" }}
        >
            <div className="absolute inset-0 bg-[#020912]/40"></div>

            <form
                className="relative z-10 w-full max-w-md bg-transparent backdrop-blur-xs p-8 rounded-2xl shadow-lg space-y-5 border border-primaryDarkColor"
                onSubmit={handleSubmitBtn}
            >

                <h2 className="text-3xl font-bold text-center text-primaryColor">
                    Register
                </h2>

                {/* Name */}
                <div className="flex flex-col">
                    <label htmlFor="username" className="mb-1 font-medium text-textMutedColor">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter name"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"
                    />
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                    <label htmlFor="contactNo" className="mb-1 font-medium text-textMutedColor">
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
                        className="w-full bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-medium text-textMutedColor">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label htmlFor="createPassword" className="mb-1 font-medium text-textMutedColor">
                        Create Password
                    </label>
                    <input
                        id="createPassword"
                        name="createPassword"
                        type="password"
                        placeholder="Enter password"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"
                    />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="mb-1 font-medium text-textMutedColor">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        required
                        onChange={handleFormChange}
                        className="w-full bg-surfaceColor p-2 rounded-md text-textColor border border-borderColor focus:outline-none focus:ring-1 focus:ring-primaryDarkColor"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-primaryColor text-black font-semibold rounded-lg hover:bg-primaryHoverColor cursor-pointer transition duration-200"
                >
                    Submit
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

                <div>
                    <Link to="/login" className="text-starColor hover:underline">
                        Already have an account? Login
                    </Link>
                </div>

            </form>

        </div>
    );
}