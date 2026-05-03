import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

export default function AllBooks({ openCart }) {
    const [allbook, setAllBook] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");
    const sub = searchParams.get("sub");

    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        genre: searchParams.get("genre") || "",
        author: searchParams.get("author") || "",
        price: searchParams.get("price") || "",
        lang: searchParams.get("lang") || ""
    }), [searchParams]);
    
    const handleChange = (e) => {
        const {name, value} = e.target;

        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        navigate(`?${params.toString()}`);
    };

    const categoryMap = {
        bestSeller: "Best Sellers",
        recommended: "Recommended"
    };

    const subCategoryMap = {
        mostRead: "Most Read",
        mostPopular: "Most Popular"
    };

    let heading = "All Books";

    if (category && sub) {
        heading = `${categoryMap[category] || category} - ${subCategoryMap[sub] || sub}`;
    } 
    else if (category) {
        heading = categoryMap[category] || category;
    }
    
    useEffect(() => {
        const fetchAllBooks = async() => {
            try {
                let url = "http://localhost:5000/books";

                const params = new URLSearchParams();
                if(category) params.append("category", category);
                if(sub) params.append("sub", sub);

                // filter params
                Object.entries(filters).forEach(([key, value]) => {
                    if(value && !value.startsWith("select")) {
                        params.append(key, value);
                    }
                });

                if(params.toString()) {
                    url += `?${params.toString()}`;
                }

                const res = await fetch(url);
                const data = await res.json();

                if(data.success) {
                    setAllBook(data.data);
                }
            }
            catch(err) {
                console.log(err);
            }
        };

        fetchAllBooks();
    }, [category, sub, filters]);

    return (
        <div className="w-full min-h-screen bg-zinc-100">
            <Header openCart={openCart} />

            {/* title */}
            <p className="text-2xl sm:text-3xl text-zinc-800 font-bold text-center mt-8 mb-6">
                {heading}
            </p>

            {/* top filter bar */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-zinc-800 text-xl sm:text-2xl font-semibold p-4">
                    Filters
                </p>
                <button
                    onClick={() => setShowFilters(true)}
                    className="ri-menu-line lg:hidden bg-amber-400 p-2 rounded-lg"
                >
                </button>
            </div>
            
            {/* mobile search filter */}
            <div className="block lg:hidden w-full mb-4">
                <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search by name"
                    className="w-full bg-white text-zinc-800 border border-stone-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
            </div>

            {/* mobile filters */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto
                ${showFilters ? "translate-x-0" : "translate-x-full"}
                lg:hidden`}
            >
                {/* sidebar header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Filters</h2>

                    <button 
                        onClick={() => setShowFilters(false)}
                        className="ri-close-line text-2xl font-bold"> 
                    </button>
                </div>
                    
                {/* Sidebar Filters */}
                <div className="flex flex-col gap-4 p-4">

                    {/* Category */}
                    <div className="flex flex-col">
                        <label htmlFor="mobile-category" className="px-1"> Category </label>
                        <select
                            id="mobile-category"
                            name="category"
                            value={filters.category}
                            onChange={handleChange}
                            className="bg-white text-zinc-800 border border-stone-300 px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="">Select Category</option>
                            <option value="bestSeller">Best Seller books</option>
                            <option value="recommended">Recommended books</option>
                        </select>
                    </div>

                    {/* Genre */}
                    <div className="flex flex-col">
                        <label htmlFor="bookGenre" className="px-1"> Genre </label>
                        <select
                            id="bookGenre"
                            name="genre"
                            value={filters.genre}
                            onChange={handleChange}
                            className="bg-white text-zinc-800 border border-stone-300 px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="">Select genre</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Children's Fiction">Children's Fiction</option>
                            <option value="Romance">Romance</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Magic realism">Magic realism</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Quest">Quest</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Crime">Crime</option>
                            <option value="Detective fiction">Detective fiction</option>
                            <option value="Conspiracy fiction">Conspiracy fiction</option>
                            <option value="Self help">Self Help</option>
                            <option value="Cosmology">Cosmology</option>
                            <option value="Astrophysics">Astrophysics</option>
                            <option value="Popular Science">Popular Science</option>
                            <option value="History">History</option>
                            <option value="Historical novel">Historical novel</option>
                            <option value="Autobiography">Autobiography</option>
                            <option value="Personal Finance">Personal Finance</option>
                            <option value="Money">Money</option>
                            <option value="Business">Business</option>
                            <option value="Psychology">Psychology</option>
                        </select>
                    </div>

                    {/* Author */}
                    <div className="flex flex-col">
                        <label htmlFor="author" className="px-1"> Author </label>
                        <select
                            id="author"
                            name="author"
                            value={filters.author}
                            onChange={handleChange}
                            className="bg-white text-zinc-800 border border-stone-300 px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="">Select Author</option>
                            <option value="James Clear">James Clear</option>
                            <option value="J. K. Rowling">J. K. Rowling</option>
                            <option value="Dan Brown">Dan Brown</option>
                            <option value="Dale Carnegie">Dale Carnegie</option>
                            <option value="Morgan Housel">Morgan Housel</option>
                            <option value="Héctor García">Héctor García</option>
                            <option value="Francesc Miralles">Francesc Miralles</option>
                            <option value="Joseph Murphy">Joseph Murphy</option>
                            <option value="Paulo Coelho">Paulo Coelho</option>
                            <option value="Charles Dickens">Charles Dickens</option>
                            <option value="Victor E. Frankl">Victor E. Frankl</option>
                            <option value="Mario Puzo">Mario Puzo</option>
                            <option value="Carl Sagan">Carl Sagan</option>
                            <option value="Robert James Waller">Robert James Waller</option>
                            <option value="Agatha Christie">Agatha Christie</option>
                            <option value="Gabriel García Márquez">Gabriel García Márquez</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col">
                        <label htmlFor="price-range" className="px-1"> Price </label>

                        <select
                            id="price-range"
                            name="price"
                            value={filters.price}
                            onChange={handleChange}
                            className="bg-white text-zinc-800 border border-stone-300 px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value=""> Select Price</option>
                            <option value="range1">₹100 - ₹200</option>
                            <option value="range2">₹200 - ₹500</option>
                            <option value="range3">₹500 - ₹1000</option>
                            <option value="range4">₹1000 - ₹2000</option>
                            <option value="range5">more than ₹2000</option>
                        </select>
                    </div>

                    {/* Language */}
                    <div className="flex flex-col">
                        <label htmlFor="lang" className="px-1"> Language </label>

                        <select
                            id="lang"
                            name="lang"
                            value={filters.lang}
                            onChange={handleChange}
                            className="bg-white text-zinc-800 border border-stone-300 px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="">Select Language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="German">German</option>
                            <option value="Portuguese">Portuguese</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                        onClick={() => { navigate("/books"); }}
                        className="bg-red-500 text-white py-2 rounded-lg mt-2"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {showFilters && (
            <div
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            )}


            {/* desktop filters */}
            <div className="hidden lg:flex flex-col lg:flex-row items-center gap-4 justify-center bg-stone-200 shadow-sm rounded-xl m-4 py-4 mb-8">
                
                <div className="flex flex-col w-full sm:w-64 px-2">
                    <label htmlFor="search" className="px-2">Search</label>
                    <input type="text"
                        id="search"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search by name"
                        className="w-full bg-white text-zinc-800 border border-stone-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    />
                </div>

                <div className="flex flex-col w-full sm:w-55 px-2">
                    <label htmlFor="category"className="px-2">Category</label>
                    <select id="category"
                        name="category" 
                        value={filters.category}
                        onChange={handleChange} 
                        className="w-full bg-white text-zinc-800 border border-stone-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        <option value="">Select Category</option>
                        <option value="bestSeller">Best Seller books</option>
                        <option value="recommended">Recommended books</option>
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-55 px-2">
                    <label htmlFor="bookGenre" className="px-2">Genre</label>
                    <select id="bookGenre" 
                        name="genre" 
                        value={filters.genre}
                        onChange={handleChange}
                        className="bg-white text-zinc-800 border border-stone-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        <option value="">Select genre</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Children's Fiction">Children's Fiction</option>
                        <option value="Romance">Romance</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Magic realism">Magic realism</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Quest">Quest</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Crime">Crime</option>
                        <option value="Detective fiction">Detective fiction</option>
                        <option value="Conspiracy fiction">Conspiracy fiction</option>
                        <option value="Self help">Self Help</option>
                        <option value="Cosmology">Cosmology</option>
                        <option value="Astrophysics">Astrophysics</option>
                        <option value="Popular Science">Popular Science</option>
                        <option value="History">History</option>
                        <option value="Historical novel">Historical novel</option>
                        <option value="Autobiography">Autobiography</option>
                        <option value="Personal Finance">Personal Finance</option>
                        <option value="Money">Money</option>
                        <option value="Business">Business</option>
                        <option value="Psychology">Psychology</option>
                    </select>
                </div>

                <div className="flex flex-col w-full sm:w-55 px-2">
                <label htmlFor="author" className="px-2">Author</label>
                    <select id="author" 
                    name="author"
                    value={filters.author} 
                    onChange={handleChange}
                    className="bg-white text-zinc-800 border border-stone-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400">
                        <option value="">Select Author</option>
                        <option value="James Clear">James Clear</option>
                        <option value="J. K. Rowling">J. K. Rowling</option>
                        <option value="Dan Brown">Dan Brown</option>
                        <option value="Dale Carnegie">Dale Carnegie</option>
                        <option value="Morgan Housel">Morgan Housel</option>
                        <option value="Héctor García">Héctor García</option>
                        <option value="Francesc Miralles">Francesc Miralles</option>
                        <option value="Joseph Murphy">Joseph Murphy</option>
                        <option value="Paulo Coelho">Paulo Coelho</option>
                        <option value="Charles Dickens">Charles Dickens</option>
                        <option value="Victor E. Frankl">Victor E. Frankl</option>
                        <option value="Mario Puzo">Mario Puzo</option>
                        <option value="Carl Sagan">Carl Sagan</option>
                        <option value="Robert James Waller">Robert James Waller</option>
                        <option value="Agatha Christie">Agatha Christie</option>
                        <option value="Gabriel García Márquez">Gabriel García Márquez</option>
                    </select>
                </div>
                
                <div className="flex flex-col w-full sm:w-55 px-2">
                <label htmlFor="price-range" className="px-2">Price</label>
                <select id="price-range" 
                name="price" 
                value={filters.price}
                onChange={handleChange}
                className="bg-white text-zinc-800 border border-stone-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"> 
                    <option value=""> Select Price</option>
                    <option value="range1">₹100 - ₹200</option>
                    <option value="range2">₹200 - ₹500</option>
                    <option value="range3">₹500 - ₹1000</option>
                    <option value="range4">₹1000 - ₹2000</option>
                    <option value="range5">more than ₹2000</option>
                </select>
                </div>

                <div className="flex flex-col w-full sm:w-55 px-2">
                <label htmlFor="lang" className="px-2">Language</label>
                <select id="lang" 
                name="lang" 
                value={filters.lang}
                onChange={handleChange}
                className="bg-white text-zinc-800 border border-stone-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                    <option value="Portuguese">Portuguese</option>
                </select>
                </div>
            </div>


            {allbook.length === 0 ? (
                <div className="min-h-screen text-center mt-10">
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-700">No books found</h2>
                    <button
                        onClick={() => {
                            navigate("/books"); // reset URL
                        }}
                        className="mt-4 mb-2 px-4 py-2 bg-violet-400 hover:bg-violet-500 text-white rounded"
                    >
                        Clear Filters
                    </button>
                </div>
                ) : (
                <div className="grid grid-cols-2 gap-3 sm:flex flex-wrap justify-center mb-8">
                    {allbook.map((book) => (
                    <div
                        key={book._id}
                        className="w-full max-w-60 p-6 sm:p-4 sm:m-4 bg-white rounded-xl hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                        <img
                        src={`http://localhost:5000/${book.images?.[0]}`}
                        alt={book.bookName}
                        className="w-24 h-32 sm:w-full sm:h-80 object-cover mx-auto"
                        />

                        <p className="text-zinc-800 font-semibold text-sm sm:text-base text-center mt-2">{book.bookName}</p>

                        <div className="flex items-center justify-center mt-auto pt-4">
                            <button 
                                onClick={ () => navigate(`/product/${book._id}`) }
                                className="bg-amber-400 hover:bg-amber-500 px-2 py-1 text-xs sm:text-base rounded cursor-pointer">
                                Buy now
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
                )
            }

            <ScrollTop />

            <Footer />
        </div>
    );
}