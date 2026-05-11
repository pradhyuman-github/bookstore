import { useState } from "react";
import { NavLink, Link } from "react-router";
import { motion } from "motion/react";

export default function Header({ openCart, user }) {

    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="bg-zinc-800 w-full fixed top-0 left-0 z-50 shadow-md"
        >
            {/* desktop */}
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
                    
                    {/* menu btn */}
                    <button 
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden ri-menu-line text-zinc-300 text-2xl hover:text-amber-400 transition-all duration-200"
                    >
                    </button>
                </div>
            </nav>

            {/* mobile sidebar + overlay */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 
                ${ menuOpen ? "visible bg-black/50" : "invisible bg-black/0" }`}
            >
                {/* sidebar */}
                <div
                    className={`absolute top-0 right-0 h-full w-[75%] max-w-75 bg-zinc-800 border-l border-zinc-700 px-6 py-5 flex flex-col gap-6 transition-transform duration-300 
                        ${ menuOpen ? "translate-x-0" : "translate-x-full" }`}
                >
                    {/* close button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="ri-close-line text-3xl text-zinc-300 hover:text-amber-400"
                        >
                        </button>
                    </div>

                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg border-b border-amber-400"
                    >
                        Home
                    </Link>

                    <NavLink
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg border-b border-amber-400"
                    >
                        About
                    </NavLink>

                    <Link
                        to="/books"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg border-b border-amber-400"
                    >
                        Products
                    </Link>

                    <NavLink
                        to="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-amber-400 text-zinc-300 font-semibold text-lg border-b border-amber-400"
                    >
                        Contact
                    </NavLink>
                </div>

                {/* click overlay to close */}
                <div
                    className="w-full h-full"
                    onClick={() => setMenuOpen(false)}
                >
                </div>
            </div>

        </motion.div>
    );
}