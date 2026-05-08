import { useState } from "react";
import API from "../config/api";

export default function AddBooks() {
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // filter only image files
        const validImages = files.filter(
            (file) => file.type.startsWith("image/")
        );

        if(validImages.length !== files.length) {
            alert("Only image files are allowed");
        }

        const combinedImages = [...images, ...validImages];

        // limit max 3 images
        const limitedImages = combinedImages.slice(0,3);

        if(combinedImages.length > 3) {
            alert("Maximum 3 images allowed");
        }

        setImages(limitedImages);

        // reset input to see new files
        e.target.value = "";
    }

    const handleSubmitBtn = async(e) => {
        e.preventDefault();

        const formData = new FormData();

        const form = e.target;

        formData.append("bookName", form.bookName.value);
        formData.append("authorName", form.authorName.value);
        formData.append("bookDesc", form.bookDesc.value);
        formData.append("bookPrice", form.bookPrice.value);
        formData.append("genre", form.genre.value);
        formData.append("bookStock", form.bookStock.value);
        formData.append("language", form.language.value);
        formData.append("publishYear", form.publishYear.value);
        
        const categoryData = [{
            name: selectedCategory,
            subCategory: selectedSubCategory || null
        }];

        formData.append("category", JSON.stringify(categoryData));
        
        // append img manually
        images.forEach((img) => {
            formData.append("bookImg", img);
        });

        try {
            const res = await fetch(`${API}/books/add-book`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            
            if(data.success) {
                setMessage("Book added"); 

                // clear textarea/img inputs
                setImages([]);
                setText("");
                // clear normal inputs
                form.reset();

                setTimeout(() => setMessage(""), 3000);
            }
            else {
                setMessage("Failed to add book");
            }

            console.log(data);
        }
        catch (err) {
            console.log(err);
            setMessage("Something went wrong");
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4">
            <form 
                className="w-full max-w-5xl bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg space-y-5"
                onSubmit={handleSubmitBtn}
            >
                
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Add Books</h1>

                {/* name, author */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="bookName" className="font-medium text-gray-700">
                            Book Name
                        </label>
                        <input
                            id="bookName"
                            name="bookName"
                            type="text"
                            placeholder="Enter book title"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="authorName" className="w-28 mb-1 font-medium text-gray-700">
                            Author name
                        </label>
                        <input
                            id="authorName"
                            name="authorName"
                            type="text"
                            placeholder="Enter author's name"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                {/* lang, yr */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="language" className="font-medium text-gray-700">
                            Language
                        </label>
                        <input
                            id="language"
                            name="language"
                            type="text"
                            placeholder="Enter language"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="publishYear" className="font-medium text-gray-700">
                            Published Year
                        </label>
                        <input
                            id="publishYear"
                            name="publishYear"
                            type="number"
                            min="1000"
                            max={new Date().getFullYear()}
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter year"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                {/* desc, price */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="bookDesc" className="font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="bookDesc"
                            name="bookDesc"
                            value={text}
                            onChange={(e) => {
                                const words = e.target.value.trim().split(/\s+/);

                                if(words.length <= 100) {
                                    setText(e.target.value);
                                }
                            }}
                            placeholder="Enter upto 100 words"
                            required
                            className="w-full h-32 resize-none bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        
                        <p className="text-sm text-gray-500 mt-1">
                          {text.trim().split(/\s+/).filter(Boolean).length}/100 words
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="bookPrice" className="font-medium text-gray-700">
                            Book MRP
                        </label>
                        <input
                            id="bookPrice"
                            name="bookPrice"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter book price"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                {/* genre, stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="genre" className="font-medium text-gray-700">
                            Genre
                        </label>
                        <input
                            id="genre"
                            name="genre"
                            type="text"
                            placeholder="Enter genre"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="bookStock" className="font-medium text-gray-700">
                            Book Stock
                        </label>
                        <input
                            id="bookStock"
                            name="bookStock"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter total books"
                            required
                            className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                {/* cate + sub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* category */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="category" className="font-medium text-gray-700">
                            Category
                        </label>
                        
                        <select
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedSubCategory(""); // reset subcategory
                            }}
                            required
                            className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">Select Category</option>
                            <option value="bestSeller">Best Seller</option>
                            <option value="recommended">Recommended</option>
                        </select>
                    </div>

                    {/* sub category */}
                    {selectedCategory === "bestSeller" && (
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-700">
                                Sub Category
                            </label>

                            <select
                                name="subCategory"
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="">Select Sub Category</option>
                                <option value="mostRead">Most Read</option>
                                <option value="mostPopular">Most Popular</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* img field */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="bookImg" className="w-28 mb-1 font-medium text-gray-700">
                        Upload Image
                    </label>
                    <input
                        id="bookImg"
                        name="bookImg"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full bg-gray-100 p-2 rounded-md hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    
                    {/* Image Count */}
                    <p className="text-sm text-gray-500 mt-1">
                        {images.length}/3 images selected
                    </p>

                    {/* Preview */}
                    <div className="flex flex-wrap gap-4">
                        {images.map((img, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md shadow"
                        />
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="px-8 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
                    >
                        Add book
                    </button>
                </div>
                
                {message && (
                    <div className={`text-center px-4 py-3 rounded-lg font-medium shadow-md
                        transform transition-all duration-300 ease-in-out
                        ${message === "Book added" 
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}