import { useState, useEffect } from "react";
import API from "../config/api";

export default function DisplayCoupon() {
    const [viewCoupon, setViewCoupon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const [editingCoupon, setEditingCoupon] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [deleteId, setDeleteId] = useState(null);

    const [message, setMessage] = useState({
        message: "",
        type: "",
        show: false
    });

    const showMessage = (msg, type="success") => {
        setMessage({
            message: msg,
            type,
            show: true
        });

        setTimeout(() => {
            setMessage( prev => ({...prev, show: false}) );
        }, 3000);
    };

    const fetchCouponData = async () => {
        try {
            const res = await fetch(`${API}/coupon/view-coupon`);

            const data = await res.json();
            setViewCoupon(data.data || []);
        } 
        catch (err) {
            console.log("Error:", err);
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouponData();
    }, []);

    if (loading) 
        return <p className="text-center mt-10"> Loading... </p>;

    const handleDelete = async() => {
        try {
            await fetch(`${API}/coupon/delete-coupon/${deleteId}`, {
                method: "DELETE",
                credentials: "include"
            });

            setViewCoupon( prev => prev.filter(c => c._id !== deleteId) );
            setDeleteId(null);

            showMessage("Coupon deleted", "success");
        }
        catch(err) {
            console.log("Delete error: ", err);
            showMessage("Failed to delete coupon", "error");
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setEditFormData( {...coupon} );
    } 

    const handleChange = (e) => {
        let { name, value } = e.target;

        if(name === "isActive") {
            value = value === "true";
        }

        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }) );
    };

    const handleUpdate = async() => {
        try {
            const start = new Date(editFormData.startDate);
            const end = new Date(editFormData.expiryDate);
            
            if(start >= end) {
                showMessage("Start date must be before expiry date", "error");
                return;
            }

            const res = await fetch(`${API}/coupon/update-coupon/${editingCoupon._id}`, 
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editFormData),
                }
            );

            const data = await res.json();
            console.log(data);

            if(!res.ok) {
                showMessage(data.message || "Update failed", "error");
                setEditingCoupon(null);
                return;
            }

            setViewCoupon(prev => 
                prev.map(c => 
                    c._id === editingCoupon._id ? data.data : c
                ) 
            );

            setEditingCoupon(null);

            showMessage("Coupon updated", "success");
        }
        catch(err) {
            console.log("Update error: ", err);
            showMessage("Failed to update coupon", "error");
        }
    };

    const filteredCoupons = viewCoupon.filter(c => {
        const isExpired = new Date(c.expiryDate) < new Date();

        if(filter === "active") {
            return !isExpired && c.isActive;
        }
        if(filter === "inactive") {
            return !isExpired && !c.isActive;
        }
        if(filter === "expired") {
            return isExpired;
        }

        return true;
    })

    return (
        <div className="p-3 sm:p-4 lg:p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center"> All Coupons </h2>

            {/* filter by */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1 rounded text-sm sm:text-base ${
                        filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-1 rounded text-sm sm:text-base ${
                        filter === "active" ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Active
                </button>

                 <button
                    onClick={() => setFilter("inactive")}
                    className={`px-4 py-1 rounded text-sm sm:text-base ${
                        filter === "inactive" ? "bg-yellow-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Inactive
                </button>

                <button
                    onClick={() => setFilter("expired")}
                    className={`px-4 py-1 rounded text-sm sm:text-base ${
                        filter === "expired" ? "bg-red-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Expired
                </button>
            </div>

            {message.show && (
                <div className={`relative z-50 max-w-md mx-auto mb-6 px-6 py-2 rounded shadow-lg text-white text-center
                    ${message.type === "success" ? "bg-green-500" : "bg-red-500" }`}>
                    {message.message}
                </div>
            )}

            {/* coupon details */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredCoupons.map((c) => {
                    if(!c) return null;

                    const isExpired = new Date(c.expiryDate) < new Date();

                    return(
                        <div
                            key={c._id}
                            className={`p-4 sm:p-5 rounded-xl shadow-md space-y-2 transition-all 
                                ${isExpired ? "bg-gray-300 text-gray-400 opacity-70" : "bg-white"}
                            `}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-blue-600 break-all"> {c.code} </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={ () => handleEdit(c) }
                                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                                    > 
                                        Edit 
                                    </button>
                                    
                                    <button 
                                        onClick={ () => setDeleteId(c._id) }
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    > 
                                        Delete 
                                    </button>
                                </div>
                            </div>

                            <p> <b> Type: </b> {c.discountType} </p>

                            {c.discountType !== "bxgy" && (
                                <p>
                                    <b> Discount: </b> {c.discountValue}
                                    {c.discountType === "percentage" ? "%" : "₹"}
                                </p>
                            )}

                            {c.discountType === "bxgy" && (
                                <p>
                                    <b> Offer: </b> Buy {c.buyQuantity} Get {c.getQuantity}
                                </p>
                            )}

                            <p> <b> Min Order: </b> ₹{c.minOrderAmount} </p>

                            {c.maxDiscount && (
                                <p> <b> Max Discount: </b> ₹{c.maxDiscount} </p>
                            )}

                            {/* Categories */}
                            {(c.applicableCategories?.length > 0 || c.applicableGenre) && (
                                <p className="wrap-break-word">
                                   <b> Applies to: </b> {" "}
                                    {[
                                        ...(c.applicableCategories || []).map(sec =>
                                            sec.subCategory
                                                ? `${sec.name} → ${sec.subCategory}`
                                                : sec.name
                                        ),
                                        c.applicableGenre ? `Genre: ${c.applicableGenre}` : null
                                    ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                            )}

                            {/* Dates */}
                            <p className="wrap-break-word">
                                <b> Valid: </b>{" "}
                                {new Date(c.startDate).toLocaleDateString()} →{" "}
                                {new Date(c.expiryDate).toLocaleDateString()}
                            </p>

                            {/* Usage */}
                            <p>
                                <b> Usage: </b>{" "}
                                {c.usedCount || 0} / {c.usageLimit || "no limit"}
                            </p>

                            <p>
                                <b> Per User: </b> {c.perUserLimit || "no limit"}
                            </p>

                            {/* Status */}
                            <span
                                className={`inline-block px-2 py-1 text-sm rounded ${
                                new Date(c.expiryDate) < new Date() 
                                ? "bg-gray-200 text-gray-700" 
                                : c.isActive 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                                }`}
                            >
                                {new Date(c.expiryDate) < new Date() ? "Expired" : c.isActive ? "Active" : "Inactive"}
                            </span>

                            {/* Description */}
                            {c.description && (
                                <p className="text-sm text-gray-600 wrap-break-word mt-2">
                                    {c.description}
                                </p>
                            )}
                        </div>
                    );
                
                } )}
            </div>
            
            
            {/* EDIT FORM */}
            {editingCoupon && (
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-screen flex items-start justify-center py-10 px-4">
                        <div className="bg-white p-4 sm:p-6 rounded-xl w-125 space-y-3">

                            <h2 className="text-xl font-bold">Edit Coupon</h2>

                            {/* code */}
                            <input 
                                type="text"
                                name="code"
                                value={editFormData.code || ""}
                                onChange={handleChange} 
                                className="w-full border p-2 rounded"
                                placeholder="Coupon Code" 
                            />

                            {/* Discount Type */}
                            <select
                                name="discountType"
                                value={editFormData.discountType || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                                <option value="bxgy">BXGY</option>
                            </select>

                            {/* Discount Value */}
                            {editFormData.discountType !== "bxgy" && (
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={editFormData.discountValue || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Discount Value"
                                />
                            )}

                            {/* BXGY */}
                            {editFormData.discountType === "bxgy" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        name="buyQuantity"
                                        value={editFormData.buyQuantity || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Buy Quantity"
                                    />
                                    <input
                                        type="number"
                                        name="getQuantity"
                                        value={editFormData.getQuantity || ""}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="Get Quantity"
                                    />
                                </div>
                            )}

                            {/* Min Order */}
                            <input
                                type="number"
                                name="minOrderAmount"
                                value={editFormData.minOrderAmount || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Min Order Amount"
                            />

                            {/* Max Discount */}
                            <input
                                type="number"
                                name="maxDiscount"
                                value={editFormData.maxDiscount || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="Max Discount"
                            />

                            {/* Dates */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={editFormData.startDate?.substring(0, 10) || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                />

                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={editFormData.expiryDate?.substring(0, 10) || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            {/* Limits */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Usage Limit */}
                                <input
                                    type="number"
                                    name="usageLimit"
                                    value={editFormData.usageLimit || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Usage Limit"
                                />

                                {/* Per User Limit */}
                                <input
                                    type="number"
                                    name="perUserLimit"
                                    value={editFormData.perUserLimit || ""}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Per User Limit"
                                />
                            </div>

                            {/* Active */}
                            <select
                                name="isActive"
                                value={editFormData.isActive}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>

                            {/* Description */}
                            <textarea
                                name="description"
                                value={editFormData.description || ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded resize-none"
                                placeholder="Description"
                            />

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                                <button
                                    onClick={() => setEditingCoupon(null)}
                                    className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingCoupon(null);
                                        handleUpdate();
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Update
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}


            {/* DELETE CONFIRM */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white shadow-md p-6 rounded-xl w-87.5 text-center space-y-4">

                        <h2 className="text-lg font-bold text-red-600">
                            Delete Coupon
                        </h2>

                        <p className="text-gray-600">
                            Are you sure you want to delete this coupon?
                            This action cannot be undone.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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