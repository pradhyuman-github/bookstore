import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Recommended({ addToCart }) {

    const navigate = useNavigate();

    const [editorBook, setEditorBook] = useState([]);
    const [viewMode, setViewMode] = useState("slider");

    // BOOK CARD
    const BookCard = ({ book }) => (
        <div className="w-full max-w-70 h-80 sm:h-110 p-4 bg-stone-50 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">

            <img
                src={`http://localhost:5000/${book.images[0]}`}
                alt={book.bookName}
                className="w-24 h-32 sm:w-40 sm:h-60 object-cover rounded-md shrink-0"
            />

            <p className="text-center text-zinc-900 font-semibold text-sm sm:text-lg py-4 line-clamp-2 min-h-12 sm:min-h-16">
                {book.bookName}
            </p>

            <div className="flex items-center justify-center gap-3 text-sm sm:text-base">
                <p className="text-violet-600 font-bold">
                    ₹{book.bookPrice}
                </p>
            </div>

            <div className="mt-auto pt-5 flex gap-2 justify-center">
                <button
                    className="px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base bg-violet-400 hover:bg-violet-500 text-white rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/product/${book._id}`)}
                >
                    Buy
                </button>

                <button
                    className="px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-stone-700 hover:bg-stone-800 text-white rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() =>
                        addToCart({
                            _id: book._id,
                            bookName: book.bookName,
                            price: book.bookPrice,
                            image: book.images[0],
                            category: book.category,
                            genre: book.genre,
                        })
                    }
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );

    // FETCH DATA
    useEffect(() => {
        const fetchEditorBooks = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/books?category=recommended"
                );

                const data = await res.json();

                if (data.success) {
                    setEditorBook(data.data);
                }
            } 
            catch (err) {
                console.log(err);
            }
        };

        fetchEditorBooks();
    }, []);

    return (
        <div className="w-full min-h-fit sm:min-h-screen pb-6 bg-stone-200 flex flex-col mt-20 overflow-x-hidden">

            <p className="text-zinc-900 text-2xl sm:text-3xl text-center font-bold py-4 mt-8">
                Recommended Books
            </p>

            {/* BACK BUTTON */}
            {viewMode === "all" && (
                <button
                    onClick={() => setViewMode("slider")}
                    className="ml-4 sm:ml-6 lg:ml-10 mb-4 bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded-lg w-fit transition-all duration-200"
                >
                    Back
                </button>
            )}

            {/* SEE ALL BUTTON */}
            {viewMode === "slider" && (
                <div className="flex justify-end px-4 sm:px-6 lg:px-10">
                    <button
                        onClick={() => {
                            window.scrollTo(0, 0);
                            navigate("/books?category=recommended");
                        }}
                        className="bg-violet-400 hover:bg-violet-500 text-white text-sm sm:text-base px-4 py-1 rounded-2xl cursor-pointer transition-all duration-200"
                    >
                        See all
                    </button>
                </div>
            )}

            {/* SLIDER VIEW */}
            {viewMode === "slider" && editorBook.length > 0 && (
                <motion.div 
                    className="px-2 sm:px-4 lg:px-8 mt-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{once: true}}
                    transition={{ duration: 1.5 }}
                >
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation={true}
                        pagination={{ clickable: true }}
                        observer={true}
                        observeParents={true}
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="recommendSwiper pb-16"
                    >
                        {editorBook.slice(0, 10).map((book) => (
                            <SwiperSlide key={book._id}>
                                <div className="flex justify-center pb-8">
                                    <BookCard
                                        book={book}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </motion.div>
            )}

            {/* GRID VIEW */}
            {viewMode === "all" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10 justify-items-center">
                    {editorBook.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}