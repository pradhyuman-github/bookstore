import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../config/api";

export default function BestSeller({addToCart}) {

    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState("grouped");
    const [mostRead, setMostRead] = useState([]);
    const [mostPopular, setMostPopular] = useState([]);

    const BookCard = ({book, navigate, addToCart}) => (

        <div className="w-full max-w-70 sm:max-w-75 h-80 sm:h-110 p-4 m-0.5 sm:m-2 mb-8 bg-white rounded-xl flex flex-col items-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300" >
            <img 
                src={`${API}/${book.images[0]}`} 
                alt={book.bookName}
                className="w-24 h-32 sm:w-40 sm:h-60 object-cover rounded-lg shadow-md" 
            />

            <p className="text-zinc-900 font-semibold text-center text-sm sm:text-lg py-4 wrap-break-word"> {book.bookName} </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
                <p className="text-emerald-600 font-bold">₹{book.bookPrice}/-</p>
            </div>

            <div className="mt-auto pt-5 flex gap-1.5 sm:gap-3 justify-center">
                <button 
                    className="px-1 py-1 sm:px-3 sm:py-2 text-sm sm:text-base rounded-lg bg-amber-400 hover:bg-amber-500 cursor-pointer transition-all duration-200"
                    onClick={() => navigate(`/product/${book._id}`)}>
                    Buy
                </button>

                <button 
                    className="px-1 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-zinc-700 hover:bg-black text-white rounded-lg cursor-pointer transition-all duration-200"
                    onClick={() => addToCart({
                        _id: book._id,
                        bookName: book.bookName,
                        price: book.bookPrice,
                        image: book.images[0],
                        category: book.category,
                        genre: book.genre
                    })}>
                    Add to Cart
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        const fetchBestSellers = async() => {
            try {
                if(viewMode === "mostRead") {
                    const res = await fetch(`${API}/books?category=bestSeller&sub=mostRead`);
                    const data = await res.json();

                    if(data.success) {
                        setMostRead(data.data);
                    }
                }
                else if(viewMode === "mostPopular") {
                    const res = await fetch(`${API}/books?category=bestSeller&sub=mostPopular`);
                    const data = await res.json();

                    if(data.success) {
                        setMostPopular(data.data);
                    }
                }
                else {
                    const readRes = await fetch(`${API}/books?category=bestSeller&sub=mostRead`);
                    const readData = await readRes.json();

                    const popularRes = await fetch(`${API}/books?category=bestSeller&sub=mostPopular`);
                    const popularData = await popularRes.json();
                    
                    if(readData.success) setMostRead(readData.data);
                    if(popularData.success) setMostPopular(popularData.data);
                }
            }
            catch(err) {
                console.log(err);
            }
        };

        fetchBestSellers();
    }, [viewMode]);

    return(
        <div className="w-full min-h-screen pb-6 bg-zinc-100 flex flex-col overflow-hidden">
            
            <h2 className="text-zinc-900 font-bold text-2xl sm:text-3xl text-center px-4 py-8 mt-4">Best Seller</h2>

            {/* back button */}
            {viewMode !== "grouped" && (
                <button 
                    onClick={() => setViewMode("grouped")}
                    className="ml-4 sm:ml-6 lg:ml-10 mb-4 bg-gray-300 hover:bg-gray-400 transition-all duration-200 px-4 py-2 rounded-lg w-fit"> 
                Back 
                </button>
            )}

            {/* GROUPED VIEW */}
            {viewMode === "grouped" && (
                <>
                    {/* most popular */}
                    <div className="flex items-baseline justify-between px-4 sm:px-6 lg:px-10 py-2 gap-4">
                        <p className="text-zinc-900 text-xl sm:text-2xl font-medium"> Most Popular </p>
                        <button 
                            onClick={() => {
                                window.scrollTo(0,0);
                                navigate("/books?category=bestSeller&sub=mostPopular")
                            }}
                            className="bg-zinc-700 hover:bg-black text-white text-sm sm:text-base px-4 py-1 rounded-2xl cursor-pointer"
                        >
                            See all
                        </button>
                    </div>
                    
                    <div>
                        <motion.div 
                            className="px-2 sm:px-4 lg:px-8"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{once: true}}
                            transition={{ duration: 1.5 }}
                        >
                            <Swiper 
                                modules={[Navigation, Pagination]}
                                spaceBetween={16}
                                slidesPerView={2}
                                navigation
                                pagination={{ clickable: true }}
                                breakpoints={{
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 5 },
                                }}  
                                className="bookSwiper pb-14"  
                            >
                                {/* BOOKS */}
                                {mostPopular.slice(0,10).map(book => (
                                    <SwiperSlide key={book._id} >
                                        <div className="flex justify-center pb-6">
                                            <BookCard 
                                                book={book} 
                                                navigate={navigate}
                                                addToCart={addToCart} 
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>

                    </div>

                    {/* Most Read */} 
                    <div className="flex items-baseline justify-between px-4 sm:px-6 lg:px-10 py-2 mt-8 gap-4">
                        <p className="text-zinc-900 text-xl sm:text-2xl font-medium"> Most Read </p>
                        <button 
                            onClick={() => {
                                window.scrollTo(0,0);
                                navigate("/books?category=bestSeller&sub=mostRead")
                            }}
                            className="bg-zinc-700 hover:bg-black text-white text-sm sm:text-base px-4 py-1 rounded-2xl cursor-pointer"
                        >
                            See all
                        </button>
                    </div>
                    
                    <div>
                        <motion.div 
                            className="px-2 sm:px-4 lg:px-8"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{once: true}}
                            transition={{ duration: 1.5 }}
                        > 
                            <Swiper 
                                modules={[Navigation, Pagination]}
                                spaceBetween={10}
                                slidesPerView={2}
                                navigation
                                pagination={{ clickable: true }}
                                breakpoints={{
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 5 },
                                }}  
                                className="bookSwiper pb-14"  
                            >

                                {mostRead.slice(0,10).map(book => (
                                    <SwiperSlide
                                        key={book._id}
                                        className="shrink-0 w-[48%] sm:w-64 flex justify-center snap-center"
                                    >
                                        <div className="flex justify-center pb-6">
                                            <BookCard
                                                book={book} 
                                                navigate={navigate}
                                                addToCart={addToCart} 
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>

                    </div>
                </>
            )}

            {/* MOST POPULAR VIEW */}
            {viewMode === "mostPopular" && (
                <>
                    <p className="text-xl sm:text-2xl text-zinc-900 font-medium px-4 sm:px-6 lg:px-10 py-4"> Most Popular </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10 justify-items-center">
                        {mostPopular.map((book) => (
                            <BookCard 
                                key={book._id} 
                                book={book} 
                                navigate={navigate}
                                addToCart={addToCart} 
                            />
                        ))}
                    </div>
                </>
            )}

            {/* MOST READ VIEW */}
            {viewMode === "mostRead" && (
                <>
                    <p className="text-xl sm:text-2xl text-zinc-900 font-medium px-4 sm:px-6 lg:px-10 py-4"> Most Read </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10 justify-items-center">
                        {mostRead.map((book) => (
                            <BookCard 
                                key={book._id} 
                                book={book} 
                                navigate={navigate}
                                addToCart={addToCart} 
                            />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}