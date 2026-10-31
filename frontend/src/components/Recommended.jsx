import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API from "../config/api";

export default function Recommended({ addToCart }) {

    const navigate = useNavigate();

    const [editorBook, setEditorBook] = useState([]);
    const [viewMode, setViewMode] = useState("slider");

    // BOOK CARD
    const BookCard = ({ book }) => (
        <div className="w-full max-w-70 sm:max-w-75 h-80 sm:h-110 p-4 m-0.5 sm:m-2 mb-8 bg-cardColor border border-borderColor rounded-xl shadow-md flex flex-col hover:bg-cardHoverColor hover:border-primaryDarkColor hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
            <div className="place-items-center">
                <img
                    src={`${API}/${book.images[0]}`}
                    alt={book.bookName}
                    className="w-24 h-32 sm:w-40 sm:h-60 object-cover rounded-md shrink-0"
                />
            </div>

            <div>
                <p className="text-textColor font-semibold text-sm sm:text-[1rem] pt-4 wrap-break-word"> {book.bookName} </p>
                <p className="text-textMutedColor text-xs sm:text-base wrap-break-word mb-2 sm:mb-1"> {book.authorName} </p>
                <p className="text-emerald-600 font-bold text-xs sm:text-base">₹{book.bookPrice}/-</p>
            </div>

            <div className="mt-auto pt-4 flex gap-1.5 sm:gap-3 justify-center">
                <button
                    className="px-1 py-1 sm:px-3 sm:py-2 text-sm sm:text-base rounded-lg font-semibold bg-primaryColor hover:bg-primaryHoverColor cursor-pointer transition-all duration-200"
                    onClick={() => navigate(`/product/${book._id}`)}
                >
                    Buy
                </button>

                <button
                    className="px-1 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-primaryDarkColor hover:bg-primaryHoverColor font-medium rounded-lg cursor-pointer transition-all duration-200"
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
                    `${API}/books?category=recommended`
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
        <div className="w-full min-h-fit sm:min-h-screen pb-6 bg-surfaceColor flex flex-col border-t border-t-borderColor border-b border-b-borderColor overflow-x-hidden">

            <h2 className="px-4 py-2 mt-4"> </h2>

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
                <div className="flex items-baseline justify-between px-4 sm:px-6 lg:px-10 py-2 gap-4">
                    <div>
                        <p className="text-primaryColor text-lg sm:text-xl font-medium tracking-widest uppercase"> Handpicked for you </p>
                        <p className="text-headingColor text-xl sm:text-2xl font-bold"> A collection worth exploring </p>
                    </div>

                    <button
                        onClick={() => {
                            window.scrollTo(0, 0);
                            navigate("/books?category=recommended");
                        }}
                        className="text-primaryColor text-sm sm:text-base p-1 cursor-pointer hover:underline"
                    >
                        See all →
                    </button>
                </div>
            )}

            {/* SLIDER VIEW */}
            {viewMode === "slider" && editorBook.length > 0 && (
                <motion.div
                    className="px-2 sm:px-4 lg:px-8"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
                        className="bookSwiper pb-16"
                    >
                        {editorBook.slice(0, 10).map((book) => (
                            <SwiperSlide key={book._id}>
                                <div className="flex justify-center py-8">
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