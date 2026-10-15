import Header from "../components/Header";
import Footer from "../components/Footer";
import BestSeller from "../components/BestSeller";
import BookSlider from "../components/BookSlider";
import Recommended from "../components/Recommended";
import ViewMore from "../components/ViewMore";
import ScrollTop from "../components/ScrollTop";
import Subscribe from "../components/Subscribe";
import { motion } from "motion/react";


export default function Home({ openCart, addToCart, user }) {

    return (
        <div className="relative z-0 w-full mx-auto bg-mainBg pt-18 overflow-x-hidden">
            <Header openCart={openCart} user={user} />

            <BookSlider />


            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="flex flex-col items-center justify-center p-6 m-4 px-4 py-8 sm:px-6 md:px-10 lg:px-16 text-center">
                    <p className="text-headingColor font-semibold italic text-3xl sm:text-4xl md:text-5xl py-6 wrap-break-word">
                        Discover Your Next <span className="text-primaryColor"> Great Read </span>
                    </p>

                    <p className="text-textColor text-base sm:text-lg md:text-xl max-w-4xl py-6 wrap-break-word">
                        From timeless classics to modern bestsellers  <br />
                        - a curated collection of books that inspire, educate, and entertain.
                    </p>

                    <div className="sm:min-w-lg flex items-center justify-between mt-2">
                        <p className="text-starColor">
                            <span className="ri-star-s-fill text-sm sm:text-xl"></span>
                            <span className="ri-star-s-fill text-sm sm:text-xl"></span>
                            <span className="ri-star-s-fill text-sm sm:text-xl"></span>
                            <span className="ri-star-s-fill text-sm sm:text-xl"></span>
                            <span className="ri-star-s-fill text-sm sm:text-xl"> </span>
                            <span className="text-textMutedColor text-xs sm:text-base">from 12,200 readers</span>
                        </p>

                        <p className="text-textMutedColor text-xs sm:text-base">Free shipping over ₹499</p>
                    </div>
                </div>
            </motion.div>

            <BestSeller addToCart={addToCart} />

            <Subscribe />            

            <Recommended addToCart={addToCart} />

            <ViewMore />

            <ScrollTop />

            <Footer />
        </div>
    );
}