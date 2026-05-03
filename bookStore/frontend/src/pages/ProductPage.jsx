import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function ProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [productBook, setProductBook] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetchProductBook = async() => {
            try {
                const res = await fetch(`http://localhost:5000/books/${productId}`);
                const data = await res.json();

                if(data.success) {
                    setProductBook(data.data);
                }
                else {
                    setProductBook(null);
                }
            }
            catch(err) {
                console.log(err);
            }
            finally {
                setloading(false);
            }
        };

        fetchProductBook();
    }, [productId]);

    if (loading) {
        return <h2 className="text-center mt-10">Loading...</h2>
    }
    if(!productBook) {
        return <h2 className="text-center mt-10">Product not found</h2>;
    }

    return(
        <div className="w-full min-h-screen bg-linear-to-br from-stone-100 to-amber-50 flex flex-col md:flex-row justify-evenly overflow-hidden">

            <div className="w-full lg:w-1/2 py-6 flex items-center justify-center overflow-hidden">
                <img 
                src={`http://localhost:5000/${productBook.images[0]}`} 
                alt="image"
                className="w-52 sm:w-72 md:w-80 lg:w-105 h-auto object-cover rounded-lg shadow-md" />
            </div>

            <div className="w-full lg:w-1/3 grid items-center justify-center p-2 my-2 rounded-lg bg-white border border-stone-200 shadow-lg">
                <p className="text-zinc-800 text-2xl sm:text-5xl font-semibold text-center"> {productBook.bookName} </p>

                <div className="flex flex-col items-baseline gap-4 justify-center p-2 m-2">
                    <p className="text-zinc-600 py-2 wrap-break-word"> <span className="font-semibold text-zinc-800"> Author: </span> {productBook.authorName} </p>
                    
                    <p className="text-zinc-600 py-2 wrap-break-word text-justify"> <span className="font-semibold text-zinc-800"> About book: </span> {productBook.bookDesc} </p>
                    
                    <p className="text-zinc-600 py-2 wrap-break-word text-justify"> <span className="font-semibold text-zinc-800"> Genre: </span> {productBook.genre} </p>

                    <p className="text-zinc-600 py-2 wrap-break-word text-justify"> <span className="font-semibold text-zinc-800"> Language: </span> {productBook.language} </p>
                
                    <p className="text-zinc-600 py-2"> <span className="font-semibold text-zinc-800"> MRP: </span> <span className="text-emerald-600 font-semibold"> ₹{productBook.bookPrice} </span> </p>

                    <p className="text-zinc-600 py-2"> <span className="font-semibold text-zinc-800"> {productBook.bookStock > 0 ? "In Stock" : "Out of Stock"} </span> </p>
                </div>

                <button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold p-2 mx-8 rounded cursor-pointer "
                onClick={ () => {
                    localStorage.setItem( "checkoutItems", JSON.stringify([productBook]) );
                    navigate("/checkout");
                }}
                >
                    Buy now
                </button>
            </div>

        </div>
    );
}