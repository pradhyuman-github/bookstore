import { Link } from "react-router";
import { motion } from "motion/react";

export default function ViewMore() {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center p-4 mt-8 mb-20"
            initial={{scale:0}} 
            whileInView={{scale:1}} 
            transition={{duration: 1}}
            viewport={{once: true}}
        >
            <p className="py-6 m-2 text-center text-xl sm:text-2xl wrap-break-word">
                Browse top picks, trending titles, and hidden gems — all in one place.
            </p>

            <Link to="/books" onClick={ () => window.scrollTo(0,0) }>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-3xl bg-zinc-800 text-amber-400 hover:bg-black cursor-pointer transition-all duration-300 shadow-lg hover:scale-110"
                >View more books</button>
            </Link>

        </motion.div>
    );
}