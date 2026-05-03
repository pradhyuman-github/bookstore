import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../config/api";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [cancelReason, setCancelReason] = useState("");
    const [returnReason, setReturnReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedReturnOrderId, setSelectedReturnOrderId] = useState(null);
    const [message, setMessage] = useState({
        text: "",
        type: ""
    });

    const handleCancelRequest = async(orderId) => {
        try {
            const res = await fetch(`${API}/checkout/cancel-request/${orderId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reason: cancelReason })
                }
            );

            const data = await res.json();

            if(data.success) {
                setMessage({
                    text: "Cancel request sent successfully",
                    type: "success"
                });

                setTimeout(() => {
                    setMessage({ text: "", type: "" });
                }, 3000);

                setOrders(prev => prev.map(o => o._id === orderId ? {
                    ...o,
                    cancelRequest: true,
                    cancelRequestStatus: "pending",
                    cancelReason: cancelReason,
                    } : o )
                );

                setCancelReason("");
            }
        }
        catch(err) {
            console.log("Cancel request error:", err);
            setMessage({
                text: "Failed to send cancel request",
                type: "error"
            });

            setTimeout(() => {
                setMessage({ text: "", type: "" });
            }, 3000);
        }
    };

    const handleReturnRequest = async(orderId) => {
        try {
            const res = await fetch(`${API}/checkout/return-request/${orderId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reason: returnReason })
                }
            );

            const data = await res.json();

            if(data.success) {
                setMessage({
                    text: "Return request sent successfully",
                    type: "success"
                });

                setTimeout(() => {
                    setMessage({ text: "", type: "" });
                }, 3000);

                setOrders(prev => prev.map(o => o._id === orderId ? {
                    ...o,
                    returnRequest: true,
                    returnRequestStatus: "pending",
                    returnReason: returnReason
                    } : o)
                );

                setReturnReason("");
            }
        }
        catch(err) {
            console.log("Return request error:", err);
            setMessage({
                text: "Failed to send cancel request",
                type: "error"
            });

            setTimeout(() => {
                setMessage({ text: "", type: "" });
            }, 3000);
        }
    };

    // setting delivery date same as admin dashboard
    const getDeliveryDate = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 3);
        return d;
    };

    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const userRes = await fetch(`${API}/users/user-profile`, { credentials: "include" });
                const userData = await userRes.json();

                if(!userData.success) {
                    navigate("/login", { replace: true })
                    return;
                }

                setUser(userData.user);

                const orderRes  = await fetch(
                `${API}/checkout/user/${userData.user._id}`,
                {
                    credentials: "include"
                }
            );

            const orderData = await orderRes.json();
            
            if (orderData.success) {
                setOrders(orderData.orders);
            }

            setLoading(false);
            }
            catch(err) {
                console.log("Profile fetch error:",err);

                setLoading(false);

                navigate("/login", {
                    replace: true
                });
            }
        };

        fetchProfile();

    }, [navigate]);

    const handleLogout = async() => {
        try {
            await fetch(`${API}/users/logout`, {
                method: "POST",
                credentials: "include"
            });

            setUser(null);
            setOrders([]);

            navigate("/", { replace: true });
        }
        catch(err) {
            console.log("Logout error: ",err);
        }
    };

    // loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-stone-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">

                <h2 className="text-2xl font-bold mb-4">
                    User Details
                </h2>

                {message.text && (
                    <div
                        className={`mb-4 px-4 py-3 rounded-lg border ${
                            message.type === "success"
                                ? "bg-green-100 border-green-400 text-green-700"
                                : "bg-red-100 border-red-400 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* User Info */}
                <div className="bg-amber-50 border border-amber-200 text-zinc-800 space-y-2 mb-6 p-4 rounded-xl shadow-md">
                    <p><strong>Name:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                {/* Current Orders */}
                <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl text-zinc-800 font-semibold mb-2">Current Orders</h3>

                    {orders.filter(o => o.orderStatus !== "delivered").length > 0 ? (
                        orders.filter(o => o.orderStatus !== "delivered").map((order) => (
                            <div 
                                key={order._id}
                                className="bg-stone-300 p-2 sm:p-4 mb-8 rounded-xl">
                                                                
                                <div className="p-1 flex flex-col items-end gap-3">
                                    {/* CANCEL */}
                                    {order.orderStatus !== "delivered" && (
                                        <div>
                                            {!order.cancelRequest ? (
                                                <button
                                                    onClick={() => {
                                                        setShowCancelModal(true);
                                                        setSelectedOrderId(order._id);
                                                    }}
                                                    className="text-xs sm:text-sm px-3 py-1 bg-red-500 text-white rounded-full cursor-pointer"
                                                >
                                                    Cancel Order
                                                </button>
                                            ) : (
                                                <p className={`text-sm font-semibold  
                                                    ${order.cancelRequestStatus === "approved" 
                                                        ? "text-xs text-green-600 bg-green-100 border border-green-500 rounded p-1"
                                                        : order.cancelRequestStatus === "rejected"
                                                        ? "text-xs text-red-600 bg-red-100 border border-red-500 rounded p-1"
                                                        : "text-xs text-orange-600 bg-orange-100 border border-orange-500 rounded p-1" 
                                                    }`}
                                                >
                                                    Cancel Request: {order.cancelRequestStatus}
                                                </p>
                                            )}

                                        </div>
                                    )}

                                    {/* RETURN */}
                                    {order.orderStatus === "delivered" && (
                                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                            {!order.returnRequest ? (
                                                <>
                                                    <textarea
                                                        placeholder="Reason for return"
                                                        value={returnReason}
                                                        onChange={(e) => setReturnReason(e.target.value)}
                                                        className="w-full sm:w-72 border p-2 rounded-lg text-sm bg-white"
                                                    />

                                                    <button
                                                        onClick={() => {
                                                            setShowReturnModal(true);
                                                            setSelectedReturnOrderId(order._id);
                                                        }}
                                                        className="text-sm px-3 py-1 bg-indigo-500 text-white rounded-full cursor-pointer"
                                                    >
                                                        Return Order
                                                    </button>
                                                </>
                                            ) : (
                                                <p className="text-sm text-orange-600 font-semibold">
                                                    Return Request: {order.returnRequestStatus}
                                                </p>
                                            )}

                                        </div>
                                    )}

                                </div>
                                
                                {/* CANCEL modal */}
                                {showCancelModal && (
                                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md">
                                            <h2 className="text-lg sm:text-xl font-bold mb-4">
                                                Cancel Order
                                            </h2>

                                            <textarea
                                                placeholder="Write reason for cancellation..."
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                className="w-full border rounded-lg p-3 min-h-30 outline-none focus:ring-2 focus:ring-red-400"
                                            />

                                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setShowCancelModal(false);
                                                        setCancelReason("");
                                                    }}
                                                    className="px-4 py-2 bg-gray-300 rounded-lg"
                                                >
                                                    Close
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleCancelRequest(selectedOrderId);
                                                        setShowCancelModal(false);
                                                    }}
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                >
                                                    Submit Request
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* RETURN modal */}
                                {showReturnModal && (
                                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md">
                                            <h2 className="text-lg sm:text-xl font-bold mb-4">
                                                Return Order
                                            </h2>

                                            <textarea
                                                placeholder="Write reason for return..."
                                                value={returnReason}
                                                onChange={(e) => setReturnReason(e.target.value)}
                                                className="w-full border rounded-lg p-3 min-h-30 outline-none focus:ring-2 focus:ring-indigo-400"
                                            />

                                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setShowReturnModal(false);
                                                        setReturnReason("");
                                                    }}
                                                    className="px-4 py-2 bg-gray-300 rounded-lg"
                                                >
                                                    Close
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleReturnRequest(selectedReturnOrderId);
                                                        setShowReturnModal(false);
                                                    }}
                                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                                                >
                                                    Submit Request
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 rounded-xl flex flex-col lg:flex-row items-center justify-center gap-4">
                                    <div className="bg-zinc-100 border-2 border-amber-300 p-4 sm:p-6 m-2 w-full lg:w-xs rounded-xl">
                                        {order.purchasedItems.map((i, index) => (
                                            <div key={index} className="mb-3 pb-2 p-2 bg-zinc-200 shadow-md rounded-lg">

                                                <p> <span className="font-semibold wrap-break-word"> Item name: </span> {" "} 
                                                    {i.bookName} 
                                                </p>
                                                <p> <span className="font-semibold"> Quantity: </span> {" "} 
                                                    {i.quantity}
                                                </p>
                                            </div>
                                        ))}
                                        <p> <span className="font-semibold"> Total: </span> ₹{order.pricing.total}</p>
                                    </div>

                                    <div
                                        key={order._id} 
                                        className="bg-zinc-100 border-2 border-amber-300 p-4 sm:p-6 m-2 w-full lg:w-xs rounded-xl">
                                        <p> <span className="font-semibold"> Order ID: </span> {order.orderId}</p>
                                        <p> <span className="font-semibold"> Status: </span> <span className="italic"> {order.orderStatus} </span> </p>                                
                                        <p> <span className="font-semibold"> Placed On: </span>
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", 
                                            {
                                                day: "numeric", 
                                                month: "short", 
                                                year: "numeric"
                                            })}
                                        </p>
                                        <p> <span className="font-semibold"> Expected delivery: </span>
                                            {getDeliveryDate(order.createdAt).toLocaleDateString("en-IN", 
                                            {
                                                day: "numeric", 
                                                month: "short", 
                                                year: "numeric"
                                            })}
                                        </p>

                                        {/* CANCEL RESPONSE */}
                                        {order.cancelRequest && (
                                            <div className="mt-2 bg-orange-100 border border-orange-200 p-2 rounded-lg">
                                                <p className="text-sm">
                                                    <b>Cancel Request:</b> {order.cancelRequestStatus}
                                                </p>

                                                <p className="text-sm wrap-break-word">
                                                    <b>Reason:</b> {order.cancelReason}
                                                </p>
                                            </div>
                                        )}

                                        {/* RETURN RESPONSE */}
                                        {order.returnRequest && (
                                            <div className="mt-2 bg-yellow-50 border border-yellow-200 p-2 rounded-lg">
                                                <p className="text-sm">
                                                    <b>Return Request:</b> {order.returnRequestStatus}
                                                </p>

                                                <p className="text-sm wrap-break-word">
                                                    <b>Reason:</b> {order.returnReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center bg-stone-300">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate( "/invoice", { state: {order} } )}
                                        }
                                        className="text-sm px-4 py-2 bg-zinc-700 hover:bg-black text-amber-400 rounded-lg"> View Invoice </button>
                                </div>

                            </div> 
                        ))
                    ) : (
                        <p className="text-gray-500">No current orders</p>
                    )}
                </div>

                {/* Order History */}
                <div className="mb-6">
                    <h3 className="text-xl text-zinc-800 font-semibold mb-2">Order History</h3>

                    {orders.filter(o => o.orderStatus === "delivered").length > 0 ? (
                        orders.filter(o => o.orderStatus === "delivered").map((order) => (
                            <div key={order._id} className="p-3 mb-2 bg-stone-200 rounded-xl">
                                <p> <span className="font-semibold"> Order ID: </span> {order.orderId}</p>
                                
                                {order.purchasedItems.map((i, index) => (
                                    <div key={index} className="max-w-fit">
                                        <p> <span className="font-semibold"> Item name: </span> {" "} 
                                            {i.bookName} 
                                        </p>
                                        <p> <span className="font-semibold"> Quantity: </span> {" "} 
                                            {i.quantity}
                                        </p>
                                    </div>
                                ))}

                                <p> <span className="font-semibold"> Total: </span> ₹{order.pricing.total}</p>
                                <p> <span className="font-semibold"> Ordered Date: </span> 
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </p>
                                <p> <span className="font-semibold"> Delivered on: </span>
                                    {getDeliveryDate(order.createdAt).toLocaleDateString("en-IN")}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No past orders</p>
                    )}
                </div>

                {/* Logout */}
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
}