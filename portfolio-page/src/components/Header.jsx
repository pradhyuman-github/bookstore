import { motion } from "motion/react";

export default function Header() {
    return (
        <>
            <motion.header 
                className="hidden sm:block fixed top-0 w-full bg-white/5 backdrop-blur-lg border-b border-white/10 z-50"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-end px-6 py-4">
                <nav className="space-x-12 text-gray-300 font-medium">
                    <a href="#about" className="hover:text-white transition">About</a>
                    <a href="#project" className="hover:text-white transition">Projects</a>
                    <a href="#contact" className="hover:text-white transition">Contact</a>
                </nav>
                </div>
            </motion.header>
        </>
    )
}