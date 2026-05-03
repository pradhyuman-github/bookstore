import { useEffect, useState } from "react";
import API from "../config/api";

export default function CreateCoupon() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [genres, setGenres] = useState([]);

    const initialForm = {
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscount: "",
        minOrderAmount: "",

        buyQuantity: "",
        getQuantity: "",
        maxFreeItems: "",

        applicableCategories: "",
        categoryName: "",
        subCategory: "",
        genre: "",

        startDate: "",
        expiryDate: "",

        usageLimit: "",
        perUserLimit: "",

        description: "",
    };

    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try {
            if(!form.code) {
                setMessage("Coupon code is required");
                setMessageType("error");
                return;
            }

            const start = new Date(form.startDate);
            const end = new Date(form.expiryDate);
            const today = new Date();

            if(!form.startDate || !form.expiryDate) {
                setMessage("Start and Expiry Date required");
                setMessageType("error");
                return;
            }

            if(start >= end) {
                setMessage("Start date must be before Expiry date");
                setMessageType("error");
                return;
            }

            if(end < today) {
                setMessage("Expiry date cannot be in past");
                setMessageType("errror");
                return;
            }

            if(form.discountType === "bxgy") {
                if(!form.buyQuantity || !form.getQuantity) {
                    setMessage("Buy/Get quantity is required for BXGY");
                    setMessageType("error");
                    return;
                }
            }
 
            const payload = {
                ...form,
                
                applicableCategories: form.categoryName 
                ? [
                    {
                        name: form.categoryName,
                        subCategory: form.subCategory || null
                    }
                ] 
                : [] ,

                applicableGenre: form.genre || null,
                discountValue: Number(form.discountValue) || 0,
                maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
                minOrderAmount: Number(form.minOrderAmount) || 0,

                buyQuantity: form.buyQuantity ? Number(form.buyQuantity) : null,
                getQuantity: form.getQuantity ? Number(form.getQuantity) : null,
                maxFreeItems: form.maxFreeItems ? Number(form.maxFreeItems) : null,

                usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
                perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : null,
            }

            const res = await fetch(`${API}/coupon/create-coupon`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type" : "application/json", },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log(data);

            if(res.ok) {
                setMessage("Coupon created successfully");
                setMessageType("success");

                setForm(initialForm);

                setTimeout(() => setMessage(""), 3000);
            }
            else {
                setMessage("Failed to create coupon");
                setMessageType("error");
                
                setTimeout(() => setMessage(""), 3000);
            }
        }  
        catch(err) {
            console.log("Error: ", err.message);
            setMessage("Something went wrong");
            setMessageType("error");
            
            setTimeout(() => setMessage(""), 3000);
        }
    };

    useEffect(() => {
        const fetchCouponData = async () => {
            try {
                const res = await fetch(`${API}/books/view-book`);
                const data = await res.json();
                const books = data.data || [];

                // extract unique categories
                const categoryMap = {};
                books.forEach(book => {
                    book.category?.forEach(cat => {
                        if (!categoryMap[cat.name]) {
                            categoryMap[cat.name] = new Set();
                        }
                        if (Array.isArray(cat.subCategory)) {
                            cat.subCategory?.forEach(sub => {
                                categoryMap[cat.name].add(sub);
                            });
                        }
                        else if (typeof cat.subCategory === "string") {
                            categoryMap[cat.name].add(cat.subCategory);
                        }
                    });
                });

                // convert to array
                const formatted = Object.keys(categoryMap).map(name => ({
                    name,
                    subCategory: Array.from(categoryMap[name])
                }));

                setCategories(formatted);

                // genre
                const uniqueGenres = [ ...new Set(books.map(b => b.genre).filter(Boolean)) ];

                setGenres(uniqueGenres);
            }
            catch(err) {
                console.log("Category fetch error:", err);
            }
        };

        fetchCouponData();
    }, []);

    return(
        <div className="min-h-screen flex  items-center justify-center bg-gray-100 px-4 py-4">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md m-4">
                <h2 className="text-2xl font-bold mb-4 text-center"> Create Coupon </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

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

                    {/* CODE */}
                    <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="Coupon Code"
                        className="w-full p-2 border rounded"
                    />

                    {/* TYPE */}
                    <select
                        name="discountType"
                        value={form.discountType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                        <option value="bxgy">Buy X Get Y</option>
                    </select>

                    {/* PERCENTAGE / FIXED */}
                    {form.discountType !== "bxgy" && (
                    <>
                        <input
                            name="discountValue"
                            value={form.discountValue}
                            onChange={handleChange}
                            placeholder="Discount Value"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            className="w-full p-2 border rounded"
                        />

                        {form.discountType === "percentage" && (
                            <input
                                name="maxDiscount"
                                value={form.maxDiscount}
                                onChange={handleChange}
                                placeholder="Max Discount (optional)"
                                type="number"
                                min="0"
                                onKeyDown={(e) => {
                                    if(e.key === "-" || e.key === "e") {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full p-2 border rounded"
                            />
                        )}
                    </>
                    )}

                    {/* BXGY */}
                    {form.discountType === "bxgy" && (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            name="buyQuantity"
                            value={form.buyQuantity}
                            onChange={handleChange}
                            placeholder="Buy Quantity"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            className="p-2 border rounded"
                        />

                        <input
                            name="getQuantity"
                            value={form.getQuantity}
                            onChange={handleChange}
                            placeholder="Get Quantity"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            className="p-2 border rounded"
                        />

                        <input
                            name="maxFreeItems"
                            value={form.maxFreeItems}
                            onChange={handleChange}
                            placeholder="Max Free Items"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            className="p-2 border rounded col-span-2"
                        />
                    </div>
                    )}

                    {/* COMMON FIELDS */}
                    <input
                        name="minOrderAmount"
                        value={form.minOrderAmount}
                        onChange={handleChange}
                        placeholder="Minimum Order Amount"
                        type="number"
                        min="0"
                        onKeyDown={(e) => {
                            if(e.key === "-" || e.key === "e") {
                                e.preventDefault();
                            }
                        }}
                        className="w-full p-2 border rounded"
                    />
                    
                    {/* category */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedCategory(value);

                            const found = categories.find(c => c.name === value);
                            setSubCategories(found?.subCategory || []);

                            setForm(prev => ({
                                ...prev,
                                categoryName: value,
                                subCategory: ""
                            }));
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* subcategory */}
                    {subCategories.length > 0 && (
                        <select
                            value={form.subCategory}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    subCategory: e.target.value
                                }))
                            }
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Subcategory</option>
                            {subCategories.map(sub => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* genre */}
                    <select
                        value={form.genre || ""}
                        onChange={(e) =>
                            setForm(prev => ({
                                ...prev,
                                genre: e.target.value
                            }))
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Genre</option>

                        {genres.map(g => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            name="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            max={form.expiryDate || ""}
                            className="p-2 border rounded"
                        />

                        <input
                            name="expiryDate"
                            type="date"
                            value={form.expiryDate}
                            onChange={handleChange}
                            min={form.startDate || ""}
                            className="p-2 border rounded"
                        />
                    </div>

                    {/* LIMITS */}
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            name="usageLimit"
                            value={form.usageLimit}
                            onChange={handleChange}
                            placeholder="Total Usage Limit"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            className="p-2 border rounded"
                        />

                        <input
                            name="perUserLimit"
                            value={form.perUserLimit}
                            onChange={handleChange}
                            placeholder="Per User Limit"
                            type="number"
                            min="0"
                            onKeyDown={(e) => {
                                if(e.key === "-" || e.key === "e") {
                                    e.preventDefault();
                                }
                            }}
                            className="p-2 border rounded"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                    />

                    {/* SUBMIT */}
                    <button className="w-full bg-purple-500 text-white py-2 rounded">
                        Create Coupon
                    </button>
                </form>
            </div>
        </div>
    );
}