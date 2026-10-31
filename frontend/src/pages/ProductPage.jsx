import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import API from "../config/api";

export default function ProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [productBook, setProductBook] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetchProductBook = async () => {
            try {
                const res = await fetch(`${API}/books/${productId}`);
                const data = await res.json();

                if (data.success) {
                    setProductBook(data.data);
                }
                else {
                    setProductBook(null);
                }
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setloading(false);
            }
        };

        fetchProductBook();
    }, [productId]);

    if (loading) {
        return <h2 className="text-center text-textMutedColor mt-10">Loading...</h2>
    }
    if (!productBook) {
        return <h2 className="text-center text-textMutedColor mt-10">Product not found</h2>;
    }

    return (
        <div className="w-full min-h-screen bg-mainBg flex flex-col md:flex-row justify-evenly overflow-hidden">

            <div className="w-full lg:w-1/2 py-6 flex items-center justify-center overflow-hidden">
                <img
                    src={`${API}/${productBook.images[0]}`}
                    alt="image"
                    className="w-52 sm:w-72 md:w-80 lg:w-105 lg:h-[93vh] object-cover rounded-lg shadow-md" />
            </div>

            <div className="w-full lg:w-1/3 grid items-center justify-center p-2 my-0 sm:my-5 rounded-lg bg-cardColor border border-borderColor shadow-lg">
                <p className="text-primaryColor text-2xl sm:text-5xl font-semibold text-center"> {productBook.bookName} </p>

                <div className="flex flex-col items-baseline justify-center gap-6 p-2 m-2">
                    <div className="pb-2">
                        <p className="text-textSecondaryColor pb-1 wrap-break-word"> <span className="font-semibold text-textColor"> Author: </span> {productBook.authorName} </p>

                        <p className="text-textSecondaryColor wrap-break-word text-justify"> <span className="font-semibold text-textColor"> About book: </span> {productBook.bookDesc} </p>
                    </div>

                    <div className="w-full flex items-start justify-between gap-2">
                        <p className="w-1/2 text-textSecondaryColor py-2 wrap-break-word text-start"> <span className="font-semibold text-textColor"> Genre: </span> {productBook.genre} </p>

                        <p className="w-1/2 text-textSecondaryColor py-2 wrap-break-word text-end"> <span className="font-semibold text-textColor"> Language: </span> {productBook.language} </p>
                    </div>

                    <p className="bg-emerald-500/10 border border-emerald-500/40 backdrop-blur-md rounded-lg text-textSecondaryColor px-4 py-1">
                        <span className="font-semibold text-textColor"> MRP: </span>
                        <span className="text-textSecondaryColor font-semibold"> ₹{productBook.bookPrice} </span>
                    </p>

                    <p className="inline-flex items-center gap-2 bg-surfaceBg border border-borderColor rounded-full font-semibold text-textSecondaryColor px-4 py-0.5">
                        <span className={`h-2 w-2 rounded-full 
                            ${productBook.bookStock > 0 ? "bg-green-500" : "bg-red-500" } `}
                        />
                        {productBook.bookStock > 0 ? "In Stock" : "Out of Stock"}                        
                    </p>
                </div>
                
                <div className="flex items-center justify-center pb-4 sm:pb-0">
                    <button className="w-75 sm:w-[30vw] bg-primaryColor hover:bg-primaryHoverColor text-black font-semibold py-1 sm:py-2 rounded cursor-pointer"
                        onClick={() => {
                            localStorage.setItem("checkoutItems", JSON.stringify([productBook]));
                            navigate("/checkout");
                        }}
                    >
                        Buy now
                    </button>                    
                </div>
            </div>

        </div>
    );
}