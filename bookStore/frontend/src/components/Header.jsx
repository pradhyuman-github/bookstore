import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router";

export default function Header({ openCart }) {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user"));
    });

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem("user")));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return(
        <div className="bg-zinc-800 w-full relative">
            <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
                <div className="p-2">
                    <p className="ri-book-shelf-line text-2xl sm:text-3xl text-zinc-200"></p>
                </div>

                <div className="hidden md:flex items-center gap-7 lg:gap-8">
                    <Link to="/"
                    className="hover:text-amber-400 text-zinc-300 font-semibold text-lg transition-all duration-200"
                    > 
                        Home 
                    </Link>
                    
                    <NavLink to="/about"
                    className="hover:text-amber-500 text-zinc-300 font-semibold text-lg transition-all duration-200"
                    > 
                        About 
                    </NavLink>
                    
                    <Link to="/books"
                    className="hover:text-amber-400 text-zinc-300 font-semibold text-lg transition-all duration-200"
                    > 
                        Products 
                    </Link>
                    
                    <NavLink to="/contact"
                    className="hover:text-amber-400 text-zinc-300 font-semibold text-lg transition-all duration-200"
                    > 
                        Contact 
                    </NavLink>
                </div>
                    
                <div className="flex items-center gap-4 sm:gap-5"> 
                    <Link to={user ? "/profile" : "/login"} 
                    className="ri-user-3-fill hover:text-amber-400 text-zinc-300 text-xl sm:text-2xl transition-all duration-200"
                    >
                    </Link>

                    <button onClick={openCart}
                    className="ri-shopping-cart-fill hover:text-amber-400 text-zinc-300 text-xl sm:text-2xl transition-all duration-200"
                    >
                    </button>

                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden ri-menu-line text-zinc-300 text-2xl hover:text-amber-400 transition-all duration-200"
                    >
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="md:hidden flex flex-col gap-5 px-6 py-5 bg-zinc-800 border-t border-zinc-700">
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg"
                    >
                        Home
                    </Link>

                    <NavLink
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg"
                    >
                        About
                    </NavLink>

                    <Link
                        to="/books"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg"
                    >
                        Products
                    </Link>

                    <NavLink
                        to="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg"
                    >
                        Contact
                    </NavLink>
                </div>
            )}

        </div>
    );
}