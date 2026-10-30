import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../config/api";
import Header from "./Header";

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

    const handleCancelRequest = async (orderId) => {
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

            if (data.success) {
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
                } : o)
                );

                setCancelReason("");
            }
        }
        catch (err) {
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

    const handleReturnRequest = async (orderId) => {
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

            if (data.success) {
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
        catch (err) {
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
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchProfile = async () => {
            try {
                const userRes = await fetch(`${API}/users/user-profile`, {
                    method: "GET",
                    credentials: "include"
                });
                const userData = await userRes.json();

                if (!userData.success) {
                    localStorage.removeItem("user");
                    navigate("/login", { replace: true })
                    return;
                }

                setUser(userData.user);

                const orderRes = await fetch(
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
            catch (err) {
                console.log("Profile fetch error:", err);
                setLoading(false);
            }
        };

        fetchProfile();

    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch(`${API}/users/logout`, {
                method: "POST",
                credentials: "include"
            });

            localStorage.removeItem("admin");
            localStorage.removeItem("user");

            setUser(null);
            setOrders([]);

            navigate("/", { replace: true });
        }
        catch (err) {
            console.log("Logout error: ", err);
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
        <div className="min-h-screen bg-mainBg px-2 sm:px-6 py-28">
            <Header />

            {/* USER INFO */}
            <div
                className="max-w-6xl mx-auto h-36 sm:h-44 md:h-48 bg-surfaceColor border border-borderColor p-6 rounded-xl shadow-md bg-cover bg-center md:bg-right"
                style={{ backgroundImage: "url('bgProfile.png')" }}
            >
                <div className="flex items-start justify-between">
                    <h2 className="text-primaryColor text-base sm:text-2xl font-bold mb-3 sm:mb-6">
                        My Account
                    </h2>

                    {/* Logout */}
                    <div>
                        <button
                            onClick={handleLogout}
                            className="px-1 sm:px-3 sm:py-0.5 text-sm sm:text-base text-textColor bg-red-500/20 backdrop-blur-md border border-red-600 rounded sm:rounded-lg cursor-pointer hover:border-red-500"
                        >
                            <span className="ri-logout-box-r-line"></span> Logout
                        </button>
                    </div>
                </div>

                <div>
                    <div className="flex items-center">
                        <p className="w-10 h-10 sm:w-15 sm:h-15 bg-primaryDarkColor border border-starColor rounded-full">
                            <i className="ri-user-fill text-starColor text-2xl sm:text-4xl flex items-center justify-center p-1 sm:p-2"></i>
                        </p>

                        <div className="px-2 sm:px-4">
                            <p className="font-semibold text-primaryDarkColor text-base sm:text-lg"> {user.username} </p>
                            <p className="text-textSecondaryColor text-xs sm:text-sm"> {user.email} </p>
                            <p className="text-textSecondaryColor text-xs sm:text-sm"> {user.contact} </p>
                        </div>
                    </div>

                    {message.text && (
                        <div
                            className={`mb-4 px-4 py-3 rounded-lg border ${message.type === "success"
                                ? "bg-green-100 border-green-400 text-green-700"
                                : "bg-red-100 border-red-400 text-red-700"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                </div>

            </div>


            {/* ORDER */}
            <div className="w-full flex flex-col items-center justify-center mt-10">
                {/* Current Orders */}
                <div className="w-full sm:w-[75vw] mb-6 px-2">
                    <h3 className="text-xl sm:text-2xl text-primaryColor font-semibold mb-2"> Current Orders </h3>

                    {orders.filter(o => o.orderStatus !== "delivered").length > 0 ? (
                        orders.filter(o => o.orderStatus !== "delivered").map((order) => (
                            <div
                                key={order._id}
                                className="bg-cardColor border border-borderColor p-2 sm:p-4 mb-8 rounded sm:rounded-xl">

                                {/* ORDER CARD HEADER */}
                                <div className="flex items-center justify-between">
                                    <div className="w-1/2 flex items-center gap-2">
                                        <i className="ri-todo-line text-primaryDarkColor text-2xl"></i>

                                        <h1 className="text-sm sm:text-base text-headingColor tracking-wide font-mono">Order {order.orderId} </h1>
                                    </div>

                                    {/* CANCEL BTN */}
                                    <div>
                                        {order.orderStatus !== "delivered" && (
                                            <div>
                                                {!order.cancelRequest ? (
                                                    <button
                                                        onClick={() => {
                                                            setShowCancelModal(true);
                                                            setSelectedOrderId(order._id);
                                                        }}
                                                        className="text-xs sm:text-sm px-3 py-1 bg-red-500/10 backdrop-blur-md text-red-500 border rounded-full cursor-pointer"
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
                                    </div>
                                </div>

                                <div className="p-1 flex flex-col items-end gap-3">
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
                                    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 px-3 sm:px-0">
                                        <div className="bg-cardHoverColor border-2 border-borderColor p-4 sm:p-6 rounded-2xl w-full max-w-md">
                                            <h2 className="text-headingColor text-lg sm:text-xl font-bold mb-4">
                                                Cancel Order
                                            </h2>

                                            <textarea
                                                placeholder="Write reason for cancellation..."
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                className="w-full border border-borderColor rounded-lg p-3 min-h-30 text-textColor outline-none focus:ring-1 focus:ring-red-500"
                                            />

                                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setShowCancelModal(false);
                                                        setCancelReason("");
                                                    }}
                                                    className="px-4 py-2 bg-cardColor text-white rounded-lg"
                                                >
                                                    Close
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleCancelRequest(selectedOrderId);
                                                        setShowCancelModal(false);
                                                    }}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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

                                {/* ORDER DETAIL */}
                                <div className="rounded-xl flex flex-col lg:flex-row items-center justify-center gap-1 sm:gap-4 px-1">
                                    <div className="w-full sm:w-1/2 bg-surfaceColor border border-borderColor p-2 sm:p-6 m-2 rounded-xl">
                                        {order.purchasedItems.map((i, index) => (
                                            <div key={index} className="mb-1 sm:mb-3 p-2 border-b border-b-borderColor shadow-md rounded-lg">

                                                <p>
                                                    <span className="text-headingColor font-semibold wrap-break-word text-sm sm:text-base">
                                                        {i.bookName}
                                                    </span>
                                                </p>

                                                <p className="text-textMutedColor text-sm sm:text-base">
                                                    <span className="font-semibold"> Quantity: </span> {" "}
                                                    <span> {i.quantity} </span>
                                                </p>
                                            </div>
                                        ))}

                                        <p className="text-base sm:text-lg">
                                            <span className="font-semibold text-textSecondaryColor text-base"> Total: </span>
                                            <span className="text-primaryColor font-bold"> ₹{order.pricing.total} </span>
                                        </p>
                                    </div>

                                    <div
                                        key={order._id}
                                        className="w-full sm:w-1/2 flex flex-col gap-2 sm:gap-4 bg-surfaceColor border border-borderColor p-2 sm:p-6 m-2 rounded-xl"
                                    >
                                        <div className="flex items-start gap-4">
                                            <i className="ri-calendar-event-line text-primaryDarkColor text-2xl sm:text-3xl"></i>

                                            <div>
                                                <p className="text-textMutedColor text-sm sm:text-base"> Placed On </p>
                                                <p className="text-textColor font-semibold text-sm sm:text-base">
                                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <i className="ri-truck-line text-primaryDarkColor text-2xl sm:text-3xl"></i>

                                            <div>
                                                <p className="text-textMutedColor text-sm sm:text-base"> Expected delivery </p>
                                                <p className="text-textColor font-semibold text-sm sm:text-base">
                                                    {getDeliveryDate(order.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <i className="ri-donut-chart-line text-primaryDarkColor text-2xl sm:text-3xl"></i>

                                            <div>
                                                <p className="text-textMutedColor text-sm sm:text-base"> Status </p>
                                                <p className={`font-semibold text-sm sm:text-base
                                                    ${["placed", "pending", "shipped"].includes(order.orderStatus)
                                                        ? "text-amber-400"
                                                        : order.orderStatus === "delivered"
                                                            ? "text-green-500"
                                                            : order.orderStatus === "returned"
                                                                ? "text-blue-400"
                                                                : order.orderStatus === "cancelled"
                                                                    ? "text-red-500"
                                                                    : "text-textSecondaryColor"
                                                    } `}
                                                >
                                                    {order.orderStatus
                                                        ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                                                        : "Unknown"
                                                    }
                                                </p>
                                            </div>

                                            {/* INVOICE BTN */}
                                            <div className="w-full flex justify-end pt-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate("/invoice", { state: { order } })
                                                    }}
                                                    className="text-xs sm:text-sm px-2 py-0 sm:py-0.5 bg-amber-500/10 text-starColor border rounded-md flex items-center gap-2 cursor-pointer"
                                                >
                                                    <span className="ri-receipt-line text-base sm:text-lg"></span>
                                                    View Invoice
                                                </button>
                                            </div>
                                        </div>

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

                            </div>
                        ))
                    ) : (
                        <p className="text-textMutedColor font-semibold">No current orders</p>
                    )}
                </div>

                {/* Order History */}
                <div className="w-full sm:w-[75vw] mb-6 px-2">
                    <h3 className="text-xl sm:text-2xl text-primaryColor font-semibold mb-2">Order History</h3>

                    {orders.filter(o => o.orderStatus === "delivered").length > 0 ? (
                        orders.filter(o => o.orderStatus === "delivered").map((order) => (
                            <div
                                key={order._id}
                                className="bg-cardColor border border-borderColor p-2 sm:p-4 mb-8 rounded sm:rounded-xl"
                            >
                                <div className="bg-surfaceColor border border-borderColor rounded-xl p-2">
                                    <p className="text-headingColor">
                                        <span className="font-semibold"> Order ID: </span>
                                        {order.orderId}
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row items-start gap-0 sm:gap-5">
                                        {/* item, qty, price */}
                                        <div className="py-2 pl-2 pr-2 sm:pr-6 sm:border-r-2 border-borderColor">
                                            {order.purchasedItems.map((i, index) => (
                                                <div key={index} className="max-w-fit">
                                                    <p className="text-textSecondaryColor border-b border-borderColor pb-1"> 
                                                        <span className="font-semibold"> Item name: </span> {" "}
                                                        {i.bookName}
                                                    </p>
                                                    <p className="text-textSecondaryColor border-b border-borderColor pb-1"> 
                                                        <span className="font-semibold"> Quantity: </span> {" "}
                                                        {i.quantity}
                                                    </p>
                                                </div>
                                            ))}

                                            <p className="text-textSecondaryColor border-b border-borderColor pb-1 sm:border-none"> 
                                                <span className="font-semibold"> Total: </span> 
                                                ₹{order.pricing.total}
                                            </p>
                                        </div>                                        
                                        
                                        {/* date */}
                                        <div className="p-2">
                                            <p className="text-textSecondaryColor border-b border-borderColor pb-1"> 
                                                <span className="font-semibold"> Ordered Date: </span>
                                                {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                            <p className="text-textSecondaryColor pb-1"> 
                                                <span className="font-semibold"> Delivered on: </span>
                                                {getDeliveryDate(order.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-textMutedColor font-semibold">No past orders</p>
                    )}
                </div>

            </div>
        </div>
    );
}