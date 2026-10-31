import { useState } from "react";
import { NavLink, Link } from "react-router";
import { motion } from "motion/react";

export default function Header({ openCart, user }) {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="bg-black/75 backdrop-blur-xl w-full fixed top-0 left-0 z-50 shadow-md"
            >
                {/* desktop */}
                <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
                    <div className="p-2 flex items-start">
                        <img src="/icon.png" alt="icon" className="w-15 h-10 rounded-full object-cover"/>
                        <p className="text-headingColor font-bold text-2xl sm:text-3xl"> Book<span className="text-primaryColor">Verse</span> </p>
                    </div>

                    <div className="hidden md:flex items-center gap-7 lg:gap-8">
                        <Link to="/"
                            className="text-headingColor font-semibold text-lg border-b-2 border-transparent hover:border-b-primaryColor"
                        >
                            Home
                        </Link>

                        <NavLink to="/about"
                            className="text-headingColor font-semibold text-lg border-b-2 border-transparent hover:border-b-primaryColor"
                        >
                            About
                        </NavLink>

                        <Link to="/books"
                            className="text-headingColor font-semibold text-lg border-b-2 border-transparent hover:border-b-primaryColor"
                        >
                            Books
                        </Link>

                        <NavLink to="/contact"
                            className="text-headingColor font-semibold text-lg border-b-2 border-transparent hover:border-b-primaryColor"
                        >
                            Contact
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-5">
                        <Link to={user ? "/profile" : "/login"}
                            className="ri-user-3-fill text-headingColor md:text-primaryColor text-xl sm:text-2xl transition-all duration-200"
                        >
                        </Link>

                        <button onClick={openCart}
                            className="ri-shopping-cart-fill text-headingColor md:text-primaryColor text-xl sm:text-2xl transition-all duration-200"
                        >
                        </button>

                        {/* menu btn */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden ri-menu-line text-headingColor md:text-primaryColor text-2xl hover:text-amber-400 transition-all duration-200"
                        >
                        </button>
                    </div>
                </nav>
            </motion.div>

            {/* mobile sidebar + overlay */}
            <div className={`fixed inset-0 z-100 md:hidden transition-all duration-300 
                    ${menuOpen ? "visible bg-black/60" : "invisible bg-black/0"}
                `}
            >
                {/* click overlay to close */}
                <div
                    className="absolute inset-0"
                    onClick={() => setMenuOpen(false)}
                >
                </div>

                {/* sidebar */}
                <div
                    className={`absolute top-0 right-0 z-10 h-full w-[75%] max-w-75 bg-zinc-900 border-l border-zinc-800 px-6 py-5 flex flex-col gap-6 transition-transform duration-300 
                        ${menuOpen ? "translate-x-0" : "translate-x-full"}
                    `}
                >
                    {/* close button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="ri-close-line text-3xl text-starColor hover:text-amber-400"
                        >
                        </button>
                    </div>

                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="text-headingColor font-semibold text-lg border-b border-zinc-700 pb-2"
                    >
                        Home
                    </Link>

                    <NavLink
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="text-headingColor font-semibold text-lg border-b border-zinc-700 pb-2"
                    >
                        About
                    </NavLink>

                    <Link
                        to="/books"
                        onClick={() => setMenuOpen(false)}
                        className="text-headingColor font-semibold text-lg border-b border-zinc-700 pb-2"
                    >
                        Books
                    </Link>

                    <NavLink
                        to="/contact"
                        onClick={() => setMenuOpen(false)}
                        className="text-headingColor font-semibold text-lg border-b border-zinc-700 pb-2"
                    >
                        Contact
                    </NavLink>
                </div>

            </div>
        </>

    );
}