import { useState } from "react";
import { NavLink, useNavigate } from "react-router";

export default function AdminHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async() => {
        try {
            await fetch("http://localhost:5000/users/logout", {
                method: "POST",
                credentials: "include"
            });

            navigate("/admin/login", {replace: true});
        }
        catch(err) {
            console.log("Error logging out: ", err);
        }
    }

    const navLinkStyle = ({ isActive }) => 
        isActive
            ? "text-purple-500 border-b-2 border-purple-500 font-semibold text-sm sm:text-base"
            : "bg-purple-400 hover:bg-purple-500 transition-all duration-200 shadow-md rounded-full px-4 py-2 text-sm sm:text-base";

    return (
        <div className="w-full">
            <nav className="bg-white backdrop-blur-xl shadow-md border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-700">
                    Admin Panel
                </h2>

                <div className="hidden lg:flex items-center gap-4">
                    <NavLink
                        to="/admin/add"
                        className={navLinkStyle} 
                    >
                        Add Books
                    </NavLink>
                    
                    <NavLink
                        to="/admin/view"
                        className={navLinkStyle}
                    >
                        View Books
                    </NavLink>
                    
                    <NavLink
                        to="/admin/create-coupon"
                        className={navLinkStyle}
                    >
                        Create Coupon
                    </NavLink>
                    
                    <NavLink
                        to="/admin/view-coupon"
                        className={navLinkStyle}
                    >
                        View Coupon
                    </NavLink>

                    <NavLink 
                        to="/admin/all-orders"
                        className={navLinkStyle}
                    >
                        View Orders
                    </NavLink>

                    <NavLink 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md text-sm sm:text-base"
                    >
                        Logout 
                    </NavLink>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="lg:hidden ri-menu-line text-3xl text-zinc-700 hover:text-purple-500 transition-all duration-200"
                >
                </button>
            </nav>

            {menuOpen && (
                <div className="lg:hidden bg-white shadow-md flex flex-col items-center gap-4 py-5 px-4">

                    <NavLink
                        to="/admin/add"
                        className={navLinkStyle}
                        onClick={() => setMenuOpen(false)}
                    >
                        Add Books
                    </NavLink>

                    <NavLink
                        to="/admin/view"
                        className={navLinkStyle}
                        onClick={() => setMenuOpen(false)}
                    >
                        View Books
                    </NavLink>

                    <NavLink
                        to="/admin/create-coupon"
                        className={navLinkStyle}
                        onClick={() => setMenuOpen(false)}
                    >
                        Create Coupon
                    </NavLink>

                    <NavLink
                        to="/admin/view-coupon"
                        className={navLinkStyle}
                        onClick={() => setMenuOpen(false)}
                    >
                        View Coupon
                    </NavLink>

                    <NavLink
                        to="/admin/all-orders"
                        className={navLinkStyle}
                        onClick={() => setMenuOpen(false)}
                    >
                        View Orders
                    </NavLink>

                    <NavLink 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-200 shadow-md text-sm sm:text-base"
                    >
                        Logout 
                    </NavLink>

                </div>
                )
            }
        </div>
    );
}