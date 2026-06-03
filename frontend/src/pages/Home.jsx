import Header from "../components/Header";
import Footer from "../components/Footer";
import BestSeller from "../components/BestSeller";
import BookSlider from "../components/BookSlider";
import Recommended from "../components/Recommended";
import ViewMore from "../components/ViewMore";
import ScrollTop from "../components/ScrollTop";
import Offer from "../components/Offer";
import { motion } from "motion/react";


export default function Home({ openCart, addToCart, user }) {
    
    return (
        <div className="relative z-0 w-full mx-auto pt-18 overflow-x-hidden">
            <Header openCart={openCart} user={user} />

            <BookSlider />
            

            <motion.div 
                initial={{scale:0}} 
                animate={{scale:1}} 
                transition={{duration: 1}}
            >
                <div className="flex flex-col items-center justify-center p-6 m-4 px-4 py-8 sm:px-6 md:px-10 lg:px-16 text-center">
                    <p className="font-semibold italic text-3xl sm:text-4xl md:text-5xl py-6 wrap-break-word"> 
                        Discover Your Next Great Read
                    </p>
                    <p className="text-base sm:text-lg md:text-xl max-w-4xl py-6 wrap-break-word">
                        From timeless classics to modern bestsellers - a curated collection of books that inspire, educate, and entertain.
                    </p>
                </div>
            </motion.div>


            <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <Offer />
            </motion.div>

            <BestSeller addToCart={addToCart} />

            <Recommended addToCart={addToCart} />

            <ViewMore />

            <ScrollTop />

            <Footer />
        </div>
    );
}