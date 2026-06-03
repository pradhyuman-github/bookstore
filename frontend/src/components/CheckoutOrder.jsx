import { useEffect } from "react";
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import API from "../config/api";

export default function CheckoutOrder({ form }) {
    const navigate = useNavigate();
    const location = useLocation();
    const items = useMemo(() => {
            const stored = JSON.parse(localStorage.getItem("checkoutItems"));
    
            return (
                location.state?.items ||
                (Array.isArray(stored) ? stored : [])
            );
        }, [location.state]);

    const [coupon, setCoupon] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponCode, setCouponCode] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const isCouponApplicable = (coupon, items) => {
        if (
            (!coupon.applicableCategories || coupon.applicableCategories.length === 0) &&
            !coupon.applicableGenre
        ) {
            return true;
        }

        return items.some(item => {

            // normalize category to array
            const bookCategories = Array.isArray(item.category)
                ? item.category
                : item.category
                ? [item.category]
                : [];

            // CATEGORY MATCH
            let categoryMatch = true;

            if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
                categoryMatch = coupon.applicableCategories.some(couponCat =>
                    bookCategories.some(bookCat => {
                        if ( couponCat.name?.toLowerCase() !== bookCat.name?.toLowerCase() ) return false;

                        // no subcategory restriction
                        if (!couponCat.subCategory) return true;

                        return ( couponCat.subCategory?.toLowerCase() === bookCat.subCategory?.toLowerCase() );
                    })
                );
            }

            // GENRE MATCH (IMPORTANT FIX BELOW 👇)
            let genreMatch = true;

            if (coupon.applicableGenre) {
                const bookGenres = item.genre?.split(",").map(g => g.trim().toLowerCase());
                genreMatch = bookGenres?.includes(coupon.applicableGenre.toLowerCase());
            }

            console.log("ITEM:", item.category);
            console.log("FULL ITEM:", item);
            console.log("COUPON:", coupon.applicableCategories);

            return categoryMatch && genreMatch;
        });
    };

    const applyCoupon = () => {
        setCouponError("");
        setAppliedCoupon(null);

        const found = couponCode.find(
            c => c.code === coupon && c.isActive
        );

        // invalid
        if (!found) {
            setCouponError("Invalid coupon");
            return;
        }

        // expired
        if (new Date(found.expiryDate) < new Date()) {
            setCouponError("Coupon expired");
            return;
        }

        // min order
        if (subtotal < found.minOrderAmount) {
            setCouponError(`Minimum order ₹${found.minOrderAmount} required`);
            return;
        }

        // not applicable
        if (!isCouponApplicable(found, items)) {
            setCouponError("Coupon not valid for selected items");
            return;
        }

        // SUCCESS
        setAppliedCoupon(found);
    };

    const subtotal = items.reduce(
        (acc, item) =>
            acc + (item.bookPrice || item.price) * (item.quantity || 1),
        0
    );

    let discountAmount = 0;
    const calculateCoupon = appliedCoupon;

    if(calculateCoupon) {
        // percentage
        if (calculateCoupon.discountType === "percentage") {
            discountAmount = (subtotal * Number(calculateCoupon.discountValue)) / 100;

            if (calculateCoupon.maxDiscount) {
                discountAmount = Math.min(
                    discountAmount,
                    calculateCoupon.maxDiscount
                );
            }
        }

        // fixed
        else if ( calculateCoupon.discountType === "fixed" ) {
            discountAmount = Number(calculateCoupon.discountValue);
        }

        // bxgy
        else if (calculateCoupon.discountType === "bxgy") {
            let freeItemsValue = 0;

            const applicableItems = items.filter(item => {
                const itemCategories = Array.isArray(item.category)
                    ? item.category
                    : item.category
                        ? [item.category]
                        : [];

                return calculateCoupon.applicableCategories.length === 0
                    ? true
                    : calculateCoupon.applicableCategories.some(couponCat => {
                        return itemCategories.some(bookCat => {

                            if (
                                couponCat.name?.toLowerCase() !==
                                bookCat.name?.toLowerCase()
                            ) return false;

                            if (!couponCat.subCategory) return true;

                            const bookSubs = Array.isArray(bookCat.subCategory)
                                ? bookCat.subCategory
                                : bookCat.subCategory
                                    ? [bookCat.subCategory]
                                    : [];

                            return bookSubs.some(sub =>
                                sub?.toLowerCase() === couponCat.subCategory.toLowerCase()
                            );
                        });
                    });
            });

            applicableItems.forEach(item => {
                const qty = item.quantity || 1;
                const price = item.bookPrice || item.price;

                const buy = calculateCoupon.buyQuantity;
                const get = calculateCoupon.getQuantity;

                if (qty >= buy) {
                    const freeQty = Math.floor(qty / buy) * get;

                    freeItemsValue += freeQty * price;
                }
            });
            
            // optional maxFreeItems cap
            if (calculateCoupon.maxFreeItems) {
                freeItemsValue = Math.min(
                    freeItemsValue,
                    calculateCoupon.maxFreeItems * (applicableItems[0]?.price || 0)
                );
            }

            discountAmount = freeItemsValue;
        }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    const user = JSON.parse(localStorage.getItem("user"));
    
    const handlePlaceOrder = async() => {
        if(items.length === 0) return;

        if (!form.name || !form.address1 || !form.city) {
            setCouponError("Please fill shipping details");
            return;
        }

        if(!user || !user.id) {
            setCouponError("User not logged in");
            return;
        }

        const orderData = {
            userId: user?.id,

            customer: {
                name: form.name,
                email: form.email,
                contact: form.contact
            },
            shippingAddress: {
                address1: form.address1,
                address2: form.address2,
                city: form.city,
                state: form.state,
                country: form.country,
                pincode: form.pincode
            },
            items: items.map(item => ({
                bookName: item.bookName,
                price: item.bookPrice || item.price,
                quantity: item.quantity || 1
            })),
            coupon: appliedCoupon ? {
                code: appliedCoupon.code,
                discountType: appliedCoupon.discountType,
                discountValue: appliedCoupon.discountValue
            } : null,
            pricing: {
                subtotal,
                discount: discountAmount,
                total: finalTotal
            }
        };

        try {
            const res = await fetch(`${API}/checkout`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if(!res.ok) {
                console.log(data.message);
            }

            console.log("Saved to db: ", data);

            localStorage.setItem("latestOrder", JSON.stringify(data.order));

            localStorage.removeItem("checkoutItems");

            navigate("/invoice", { state: {order: data.order} });
        }
        catch(err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        const fetchCouponCode = async() => {
            try {
                const res = await fetch(`${API}/coupon/view-coupon`);
                const data = await res.json();

                setCouponCode(data.data || []);
            }
            catch(err) {
                console.log("Coupon fetch error: ", err);
            }
        };

        fetchCouponCode();
    }, []);

    return(
        <div>
            {/* RIGHT → ITEMS */}
                <div className="bg-white border-2 border-stone-300 p-6 rounded-xl shadow-xl">
                    <h2 className="text-xl text-zinc-800 font-bold mb-4">Order Summary</h2>

                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <div key={index} className="bg-zinc-200 rounded-md border-2 border-stone-400 mb-2 p-2">
                                <p className="font-semibold">{item.bookName}</p>
                                <p>Price: ₹{item.bookPrice || item.price}</p>
                                <p>Qty: {item.quantity || 1}</p>
                            </div>
                        ))
                    ) : (
                        <p>No items</p>
                    )}

                    {/* COUPON SECTION */}
                    <div className="mt-4">
                        <h3 className="text-zinc-800 font-semibold mb-2">Apply Coupon</h3>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded"
                            />
                            <button
                                onClick={applyCoupon}
                                className="bg-zinc-700 hover:bg-black text-amber-400 px-4 py-2 rounded"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-zinc-800 font-semibold mb-2">Available Coupons</h4>

                            <div className="flex flex-wrap gap-2">
                                {couponCode
                                    .filter(c => c.isActive && new Date(c.expiryDate) > new Date())
                                    .map(c => (
                                        <div
                                            key={c._id}
                                            onClick={() => setCoupon(c.code)}
                                            className="cursor-pointer border-2 border-stone-400 px-6 py-2 rounded bg-zinc-200 hover:bg-zinc-300"
                                        >
                                            <p className="font-bold text-sm">{c.code}</p>
                                            
                                            <p className="text-xs text-gray-600">
                                                {c.discountType === "percentage"
                                                    ? `${c.discountValue}% OFF`
                                                    : c.discountType === "bxgy"
                                                    ? `Buy ${c.buyQuantity} Get ${c.getQuantity} Free`
                                                    : `₹${c.discountValue} OFF`
                                                }
                                            </p>

                                            {c.applicableCategories?.length > 0 && (
                                                <p className="text-[10px] text-gray-500 mt-1"> Applies to: {" "}
                                                    {c.applicableCategories.map(sec => 
                                                        sec.subCategory ? `${sec.name} → ${sec.subCategory}` : sec.name
                                                        ).join(", ")
                                                    } </p>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {couponError && (
                            <p className="text-red-500 text-sm mt-1">{couponError}</p>
                        )}

                        {appliedCoupon && (
                            <p className="text-green-600 text-sm">
                                {appliedCoupon.discountType === "percentage"
                                    ? `${appliedCoupon.discountValue}% OFF applied`
                                    : appliedCoupon.discountType === "bxgy"
                                    ? `Buy ${appliedCoupon.buyQuantity} Get ${appliedCoupon.getQuantity} applied`
                                    : `₹${appliedCoupon.discountValue} OFF applied`}
                            </p>
                        )}
                    </div>

                    {/* Total */}
                    <div className="mt-4 font-bold space-y-1">
                        <p className="text-zinc-800">Subtotal: ₹{subtotal}</p>

                        {appliedCoupon && discountAmount > 0 && (
                            <p className="text-emerald-600">
                                Discount: -₹{discountAmount}
                            </p>
                        )}

                        <p className="text-lg text-zinc-800">
                            Total: ₹{finalTotal}
                        </p>
                    </div>

                    <button 
                        onClick={handlePlaceOrder}
                        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded">
                        Place Order
                    </button>
                </div>
        </div>
    );
}