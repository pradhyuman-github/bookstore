import { useState, useEffect } from "react";

export default function DisplayBooks() {
    const [books, setBooks] = useState([]);
    const [editBooks, setEditBooks] = useState(null);
    const [images, setImages] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState(""); 

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);

        setTimeout(() => setMessage(""), 3000);
    };

    const fetchBooks = async() => {
        try {
            const res = await fetch("http://localhost:5000/books/view-book");
            const data = await res.json();
            setBooks(data.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    // display book
    useEffect(() => {
        const load = async() => {
            await fetchBooks();
        };
        load();
    }, []);

    // Delete book
    const confirmDelete = async() => {
        try {
            const res = await fetch(`http://localhost:5000/books/delete-book/${deleteId}`, 
                { method: "DELETE" }
            );

            const data = await res.json();

            if(data.success) {
                setBooks( prev => prev.filter(book => book._id !== deleteId) );
                showMessage("Book deleted", "success");
            }
            else {
                showMessage("Delete failed", "error");
            }
        }
        catch (err) {
            console.log(err);
            showMessage("Something went wrong", "error");
        }

        // close model
        setDeleteId(null);
    };

    // edit model
    const handleEditClick = (book) => {
        setEditBooks(book);
        setImages([]);

        if (book.category && book.category.length > 0) {
            const mainCategory = book.category?.[0]?.name || "";
            setSelectedCategory(mainCategory);

            if (mainCategory === "bestSeller") {
                setSelectedSubCategory(book.category[0]?.subCategory?.[0] || "");
            } else {
                setSelectedSubCategory("");
            }
        }
    };

    // input change
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditBooks( (prev) => ({
            ...prev,
            [name]: value,
        }) );
    };

    // img change
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    // Edit book
    const handleUpdate = async(e) => {
        e.preventDefault();

        const formData = new FormData();

        // append text fields
        formData.append("bookName", editBooks.bookName);
        formData.append("authorName", editBooks.authorName);
        formData.append("language", editBooks.language);
        formData.append("publishYear", editBooks.publishYear);
        formData.append("bookDesc", editBooks.bookDesc);
        formData.append("bookPrice", editBooks.bookPrice);
        formData.append("genre", editBooks.genre);
        formData.append("bookStock", editBooks.bookStock);  

        // append section
        const sectionData = [{
            name: selectedCategory,
            subCategory: selectedSubCategory ? [selectedSubCategory] : []
        }];

        formData.append("section", JSON.stringify(sectionData));

        // append img
        images.forEach( (img) => {
            formData.append("bookImg", img);
        } );

        try {
            const res = await fetch(`http://localhost:5000/books/update-book/${editBooks._id}`, 
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await res.json();
            if(data.success) {
                fetchBooks();
                setEditBooks(null);

                setSelectedCategory("");
                setSelectedSubCategory("");

                showMessage("Details updated", "success");
            }
            else {
                showMessage("Update failed", "error");
            }
        }
        catch(err) {
            console.log(err);
            showMessage("Something went wrong", "error");
        }
    };

    const filteredBooks = books.filter( (book) => {
        // search
        const matchesSearch = (book.bookName || "").toLowerCase().includes(search.toLowerCase());

        // filter
        let matchesFilter = true;

        if (filter === "available") {
            matchesFilter = Number(book.bookStock) > 0;
        }
        else if (filter === "outStock") {
            matchesFilter = Number(book.bookStock) === 0;
        }

        return matchesSearch && matchesFilter;
    });


    return (
        <div className="w-full min-h-screen p-3 sm:p-4 lg:p-6 bg-gray-100">

            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Book List</h1>

            {/* filters */}
            <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 bg-white p-4 rounded-xl shadow-sm mb-8">
                <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="font-medium whitespace-nowrap">Search</p>
                <input 
                    type="text"
                    placeholder="Search book" 
                    value={search}
                    onChange={ (e) => setSearch(e.target.value) }
                    className="bg-gray-200 w-full sm:w-80 px-3 py-1 rounded-md outline-none focus:ring-2 focus:ring-purple-400"
                />
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="font-medium whitespace-nowrap">Filter</p>
                <select 
                    value={filter}
                    onChange={ (e) => setFilter(e.target.value) }
                    className="bg-gray-200 w-full sm:w-60 px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-purple-400"
                > 
                    <option value=""> All Books </option>
                    <option value="available"> Available Books </option>
                    <option value="outStock"> Out of Stock </option>
                </select>
                </div>
            </div>

            {/* message shown at top */}
            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg font-medium shadow-md text-center
                    transform transition-all duration-300 ease-in-out
                    ${messageType === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"}
                `}>
                    {message}
                </div>
            )}

            {/* book table */}
            <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="min-w-250 w-full bg-white">

                    {/* col titles */}
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">S.No</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Year</th>
                            <th className="p-3">Language</th>
                            <th className="p-3">Genre</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBooks?.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="p-4 text-gray-500 text-center">
                                    No books found
                                </td>
                            </tr>
                        ) : (
                        filteredBooks.map((book, index) => (
                            <tr key={book._id} className="text-center border-t hover:bg-gray-50">

                                {/* Serial number */}
                                <td className="p-3">{index + 1}</td>

                                {/* Image */}
                                <td className="p-3">
                                    <img
                                        src={`http://localhost:5000/${book.images[0]}`}
                                        alt="book"
                                        className="w-14 h-20 object-cover mx-auto rounded"
                                    />
                                </td>

                                {/* Title */}
                                <td className="p-3">{book.bookName}</td>

                                {/* year */}
                                <td className="p-3">{book.publishYear}</td>

                                {/* lang */}
                                <td className="p-3">{book.language}</td>

                                {/* Genre */}
                                <td className="p-3">{book.genre}</td>

                                {/* Description */}
                                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">
                                    {book.bookDesc}
                                </td>

                                {/* Price */}
                                <td className="p-3">₹{book.bookPrice}</td>

                                {/* Status Toggle */}
                                <td className="p-3">
                                    <button
                                        className={`px-3 py-1 rounded-md text-white text-sm ${
                                        book.bookStock > 0 ? "bg-green-500" : "bg-red-500"
                                        }`}
                                    >
                                        {book.bookStock > 0 ? "Available" : "Unavailable"}
                                    </button>
                                </td>

                                {/* Actions */}
                                <td className="p-3">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleEditClick(book)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => setDeleteId(book._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </td>

                            </tr>
                        )) )
                        }
                    </tbody>

                </table>
            </div>

            {/* edit form */}
            {editBooks && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center overflow-y-auto px-4 py-6">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-100 max-h-[90vh] overflow-y-auto space-y-3"
                    >
                        <h2 className="text-xl font-bold">Edit Book</h2>

                        <input name="bookName"
                            value={editBooks.bookName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input name="authorName" 
                            value={editBooks.authorName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input 
                            name="language"
                            value={editBooks.language || ""}
                            onChange={handleInputChange}
                            placeholder="Language"
                            className="w-full p-2 border rounded"
                        />
                        <input 
                            name="publishYear"
                            type="number"
                            min="1000"
                            max={new Date().getFullYear()}
                            value={editBooks.publishYear || ""}
                            onChange={handleInputChange}
                            placeholder="Publish Year"
                            className="w-full p-2 border rounded"
                        />
                        <input name="bookDesc" 
                            value={editBooks.bookDesc}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input name="bookPrice" 
                            value={editBooks.bookPrice}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input name="genre" 
                            value={editBooks.genre}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input name="bookStock" 
                            value={editBooks.bookStock}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />

                        {/*section  */}
                        <div className="flex flex-col gap-4">
                            {/* Category */}
                            <div>
                                <label className="block mb-1 font-medium">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedSubCategory("");
                                    }}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Category</option>
                                    <option value="bestSeller">Best Seller</option>
                                    <option value="recommended">Recommended</option>
                                </select>
                            </div>

                            {/* Sub Category */}
                            {selectedCategory === "bestSeller" && (
                                <div>
                                    <label className="block mb-1 font-medium">Sub Category</label>
                                    <select
                                        value={selectedSubCategory}
                                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Sub Category</option>
                                        <option value="mostRead">Most Read</option>
                                        <option value="mostPopular">Most Popular</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <input type="file" 
                            multiple
                            onChange={handleImageChange}
                            className="w-full p-2 border rounded"
                        />

                        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:shadow-md"> 
                                Update 
                            </button>

                            <button type="button" 
                                onClick={ () => setEditBooks(null) }
                                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:shadow-md"
                            > 
                                Cancel 
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* delete form */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800"> Are you sure? </h2>

                        <p className="text-sm text-gray-600"> This book will be permanently deleted. </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                            <button
                                onClick={ () => setDeleteId(null) }
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                            Cancel
                            </button>

                            <button
                                onClick={() => confirmDelete()}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                            Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}