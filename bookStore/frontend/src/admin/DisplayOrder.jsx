import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";

export default function DisplayOrder() {
    const [viewOrder, setViewOrder] = useState([]);
    const [filters, setFilters] = useState({
        status: "",
        deliverySort: "",
        sales: "",
        date: ""
    });
    const [selectedUserId, setSelectedUserId] = useState("");
    const [showProducts, setShowProducts] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [activeFilter, setActiveFilter] = useState("status");
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserList, setShowUserList] = useState(false);
    const [books, setBooks] = useState([]);
    const [openProduct, setOpenProduct] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        orderId: null,
        newStatus: ""
    });
    const [searchParams, setSearchParams] = useSearchParams();

    // delivery date
    const getDeliveryDate = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 3);
        return d;
    }

    const getDisplayStatus = (order) => {
        return order.orderStatus;
    };

    const groupedOrders = useMemo(() => {
        if (!Array.isArray(viewOrder)) return [];

        return Object.values(
            viewOrder.reduce((acc, order) => {
                if (!acc[order.userId]) {
                    acc[order.userId] = {
                        user: order.customer || order.user || {},
                        orders: []
                    };
                }
                acc[order.userId].orders.push(order);
                return acc;
            }, {})
        );
    }, [viewOrder]);


    // delivery variable
    const deliveryOrders = [...viewOrder];
    if (filters.deliverySort === "asc") {
        deliveryOrders.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
    }

    if (filters.deliverySort === "desc") {
        deliveryOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    // sales variable
    const salesOrders = viewOrder.filter(o => {
        const now = new Date();
        const orderDate = new Date(o.createdAt);

        if (filters.sales === "today") {
            return orderDate.toDateString() === now.toDateString();
        }
        if (filters.sales === "weekly") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return orderDate >= weekAgo;
        }
        if (filters.sales === "monthly") {
            return (
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
            );
        }

        return true;
    });

    // unique users
    const users = groupedOrders.map(g => ({
        id: g.orders[0].userId,
        name: g.user?.username || g.user?.name || "Unknown user"
    }));

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // status filter
    const selectedUserOrders = groupedOrders.find(g => g.orders[0].userId  === selectedUserId)?.orders || [];

    // Status-based orders
    const statusOrders = [...viewOrder].filter(o => {
        const status = (o.orderStatus || "").toLowerCase();

        // date filter
        if (filters.date) {
            const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
            if (orderDate !== filters.date) return false;
        }

        // default view
        if (!filters.status) {
            return status === "placed";
        }

        // ALL → everything
        if (filters.status === "all") {
            return true;
        }

        if (filters.status === "cancelled") {
            return (
                o.orderStatus === "cancelled" ||
                o.cancelRequestStatus === "pending"
            );
        }

        if (filters.status === "returned") {
            return (
                o.orderStatus === "returned" ||
                o.returnRequestStatus === "pending"
            );
        }
        return status === filters.status;
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); 

    // filtered status & delivery
    let filteredOrders = [...selectedUserOrders];

    if(filters.status) {
        filteredOrders = filteredOrders.filter(o => o.orderStatus?.trim().toLowerCase() === filters.status.trim().toLowerCase() );
    }

    // sort by delivery
    if(filters.deliverySort === "asc") {
        filteredOrders.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if(filters.deliverySort === "desc") {
        filteredOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // latest order
    const latestOrder = filteredOrders.length > 0 ? [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;


    // status handler
    const handleStatusChange = async(orderId, newStatus) => {
        setConfirmModal({
            open: true,
            orderId,
            newStatus
        });
    };

    const confirmStatusUpdate = async() => {
        const { orderId, newStatus } = confirmModal;

        try {
            const res = await fetch(`http://localhost:5000/checkout/update-status/${orderId}` , {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            }); 

            const data = await res.json();

            if (data.success) {
                setViewOrder(prev => prev.map( o => o._id === orderId ? { ...o, orderStatus: newStatus } : o ));
            }
        }
        catch(err) {
            console.log("Status update error: ", err);
        }

        // close modal
        setConfirmModal({ open: false, orderId: null, newStatus: "" });
    }

    const cancelStatusUpdate = () => {
        setConfirmModal({ open: false, orderId: null, newStatus: "" });
    };

    const getBookDetails = (item) => {
        if (!item) return null;

        return books.find(
            b =>
                (item.bookId && b._id.toString() === item.bookId.toString()) ||
                (item.bookName && b.bookName === item.bookName)
        );
    };

    // clear filters
    const handleClearFilters = () => {
        setSelectedUserId("");
        setSearchTerm("");
        setShowUserList(false);

        setFilters({
            status: "",
            deliverySort: "",
            sales: "",
            date: ""
        });

        setShowAllOrders(false);
        setActiveFilter("status");
        setSearchParams({});
    };

    const handleCancelDecision = async(orderId, decision) => {
        try {
            const res = await fetch(`http://localhost:5000/checkout/cancel-decision/${orderId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({decision})
                }
            );

            const data = await res.json();

            if(data.success) {
                setViewOrder(prev => prev.map( o => o._id === orderId ? data.updatedOrder : o ));
            }
        }
        catch(err) {
            console.log("Cancel decision error: ",err);
        }
    };

    const handleReturnDecision = async(orderId, decision) => {
        try {
            const res = await fetch(`http://localhost:5000/checkout/return-decision/${orderId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ decision })
                }
            );

            const data = await res.json();

            if(data.success) {
                setViewOrder(prev => prev.map( o => o._id === orderId ? data.updatedOrder : o ));
            }

        } catch(err) {
            console.log("Return decision error: ",err);
        }
    };

    // for url
    useEffect(() => {
        const user = searchParams.get("user") || "";
        const status = searchParams.get("status") || "";
        const delivery = searchParams.get("delivery") || "";
        const sales = searchParams.get("sales") || "";

        if ( user !== selectedUserId || status !== filters.status || delivery !== filters.deliverySort || sales !== filters.sales) {
            setSelectedUserId(user);

            setFilters(prev => ({
                ...prev,
                status,
                deliverySort: delivery,
                sales
            }));

            if (user) setActiveFilter("user");
            else if (status) setActiveFilter("status");
            else if (delivery) setActiveFilter("delivery");
            else if (sales) setActiveFilter("sales");
            else setActiveFilter("");

            setShowAllOrders(false);
            setShowProducts(false);
            setShowAddress(false);
        }
    }, [searchParams]);

    // fetching order details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch("http://localhost:5000/checkout/all-orders", { credentials: "include" });
                const data = await res.json();

                if (!res.ok) {
                    console.log(data.message);
                    return;
                }
                
                
                console.log("ALL ORDERS:", data.orders);
                
                setViewOrder(data.orders || []);
            } 
            catch (err) {
                console.log("Display order fetch error:", err);
            }
        };

        fetchOrder();
    }, []);

    // fetching product details
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch("http://localhost:5000/books/view-book");
                const data = await res.json();

                if (data.success) {
                    setBooks(data.data || []);
                }
            } catch (err) {
                console.log("Book fetch error:", err);
            }
        };

        fetchBooks();
    }, []);

    // closing search dropdown
    useEffect(() => {
        const handleClickOutside = () => {
            setShowUserList(false);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setShowAllOrders(false);
    }, [selectedUserId]);

    // close view order btn
    useEffect(() => {
        if(activeFilter !== "user") {
            setShowAllOrders(false);
        }
    },[activeFilter]);

    // default active filter
    useEffect(() => {
        if (!activeFilter) {
            setActiveFilter("status");
        }
    }, [activeFilter]);

    return(
        <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 tracking-wide text-center sm:text-left"> Order Dashboard</h2>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end justify-center gap-4 sm:gap-6 mb-6 bg-white p-4 rounded-xl shadow-md border">
                {/* User */}
                <div className="relative w-full sm:w-72 md:w-80">
                    <label htmlFor="name-filter" className="text-sm sm:text-base">User Name</label>
                    <input id="name-filter"
                        type="text"
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowUserList(true);
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm sm:text-base"
                    />

                    {/* Dropdown list */}
                    {showUserList && searchTerm && (
                        <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">

                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(u => (
                                    <div
                                        key={u.id}
                                        onClick={() => {
                                            setSelectedUserId(u.id);
                                            setSearchTerm(u.name);
                                            setShowUserList(false);
                                            setActiveFilter("user"); 
                                            setSearchParams({ user: u.id });
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {u.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-gray-500">
                                    No users found
                                </div>
                            )}

                        </div>
                    )}

                </div>

                {/* Date */}
                <div className="flex flex-col">
                    <label>Select Date</label>
                    <input
                        type="date"
                        value={filters.date || ""}
                        onChange={(e) => {
                            setFilters({ 
                                ...filters, 
                                date: e.target.value
                            });

                            setActiveFilter("status");  
                        }}
                        className="w-full px-3 py-2 border rounded-lg outline-none focus-within:ring-2 focus-within:ring-indigo-400"
                    />
                </div>
                
                {/* Status */}
                <div className="flex flex-col  w-full sm:w-52"> 
                    <label htmlFor="order-status">Order Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilters({ ...filters, status: value });
                            setActiveFilter("status");
                            setSearchParams({ status: value });
                        }}
                        className="border rounded px-2 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Select</option>
                        <option value="all">All</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                    </select>
                </div>

                {/* Delivery sort */}
                <div className="flex flex-col  w-full sm:w-52">
                    <label htmlFor="delivery-date">Sort Delivery</label>
                    <select 
                        value={filters.deliverySort}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilters({...filters, deliverySort: value});
                            setActiveFilter("delivery");
                            setSearchParams({ delivery: value });
                        }}
                        className="border rounded px-2 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Select </option>
                        <option value="asc">Closest</option>
                        <option value="desc">Latest</option>
                    </select>
                </div>

                {/* Sales */}
                <div className="flex flex-col  w-full sm:w-52">
                    <label htmlFor="sales-filter">Sales</label>
                    <select 
                        value={filters.sales}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilters({...filters, sales: value});
                            setActiveFilter("sales");
                            setSearchParams({ sales: value });
                        }}
                        className="border rounded px-2 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Sales</option>
                        <option value="today">Today</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                
                {/* cleat btn */}
                <div className="flex flex-col items-stretch sm:items-center w-full sm:w-auto">
                    <p> <br /> </p>
                    <button
                        onClick={handleClearFilters}
                        className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
                    >
                        Clear Filters
                    </button>

                </div>
            </div>


            {selectedUserId && filteredOrders.length === 0 && (
                <p className="text-gray-500 mt-4">No orders found</p>
            )}

            {/* user filter  */}
            {activeFilter === "user" && latestOrder && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 border hover:shadow-xl transition">

                    <div>
                        <p className="py-2 wrap-break-word"><b>Order No:</b> <br />{latestOrder.orderId}</p>
                        <p className="py-2 wrap-break-word"><b>Invoice No:</b> <br /> INV-{latestOrder.orderId}</p>
                    </div>
                    
                
                    {/* View Products */} 
                    <div>
                        <button 
                            onClick={() => setShowProducts(!showProducts) }
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow transition w-full sm:w-auto"
                        >
                            View Products 
                        </button>
                    
                        {showProducts && latestOrder.purchasedItems.map((item, i) => (
                            <div 
                                key={i}
                                className="bg-indigo-50 border border-indigo-200 p-4 m-2 rounded-lg shadow-sm text-sm"
                            >
                                    <p><span className="font-semibold"> Book name: </span> {item.bookName}</p>
                                    <p><span className="font-semibold"> Quantity: </span> {item.quantity}</p>
                                    <p><span className="font-semibold"> Price: </span> ₹{item.price}</p>
                            </div>
                        ))}
                    </div>                     

                    {/* Amount */}
                    <div className="text-sm sm:text-base">
                        <p className="py-1"><b>Subtotal:</b> ₹{latestOrder.pricing.subtotal}</p>
                        <p className="py-1"><b>Coupon:</b> {latestOrder.pricing.coupon || "N/A"}</p>
                        <p className="py-1"><b>Discount:</b> ₹{latestOrder.pricing.discount}</p>
                        <p className="py-1"><b>Total:</b> ₹{latestOrder.pricing.total}</p>                    
                    </div>

                    {/* Address */}
                    <div>
                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow transition w-full sm:w-auto"
                        >
                            View Address
                        </button>

                        {showAddress && (
                            <div className="bg-indigo-50 border border-indigo-200 p-4 m-2 rounded-lg shadow-sm text-sm wrap-break-word">
                                <p> <span className="font-semibold"> Address: </span> {latestOrder.shippingAddress.address1}, {latestOrder.shippingAddress.address2}</p>
                                <p> <span className="font-semibold"> City: </span> {latestOrder.shippingAddress.city}</p>
                                <p> <span className="font-semibold"> Pincode: </span> {latestOrder.shippingAddress.pincode}</p>
                                <p> <span className="font-semibold"> State: </span> {latestOrder.shippingAddress.state}</p>
                                <p> <span className="font-semibold"> Country: </span> {latestOrder.shippingAddress.country}</p>
                            </div>
                        )}
                    </div>

                
                    {/* Dates */}
                    <div className="text-sm sm:text-base">
                        <p className="py-1">
                            <b>Order Date:</b> {new Date(latestOrder.createdAt).toLocaleDateString("en-GB")}
                        </p>

                        <p className="py-1">
                            <b>Delivery Date:</b> {getDeliveryDate(latestOrder.createdAt).toLocaleDateString("en-GB")}
                        </p>
                    </div>
                
                    {/* Status */}
                    <div>
                        <label htmlFor="set-status"> <b> Order Status: </b> </label>
                        <select
                            id="set-status"
                            value={latestOrder.orderStatus}
                            onChange={(e) => handleStatusChange(latestOrder._id, e.target.value.toLowerCase() )}
                            className="border rounded mt-2 w-full px-2 py-1"
                        >
                            <option value="placed">Placed</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        
                        {/* view order btn */}
                        <button
                            onClick={() => setShowAllOrders(prev => !prev)}
                            className="mt-4 w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition"
                        >
                            {showAllOrders ? "Hide Orders" : "View All Orders"}
                        </button>
                    </div>    
                </div>
            )}


            {/* all orders btn */}
            {showAllOrders && selectedUserOrders.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold underline m-4">Total Orders</h3> <br />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredOrders.map(order => (
                            <div key={order._id} 
                                className="bg-white border border-indigo-200 max-w-2xl p-4 mb-3 rounded-xl shadow hover:shadow-md transition">
                                
                                <p><b>Order ID:</b> {order.orderId}</p>
                                <p><b>Status:</b> {getDisplayStatus(order)}</p>
                                <p><b>Total:</b> ₹{order.pricing.total}</p>

                                <p> <b>Date:</b> {
                                        new Date(order.createdAt).toLocaleDateString("en-IN")
                                    }
                                </p>

                                <p> <b>Delivery:</b> {
                                        getDeliveryDate(order.createdAt).toLocaleDateString("en-IN")
                                    }
                                </p>

                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* status update confirm message */}
            {confirmModal.open && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50">
                    
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center border">
                        <h3 className="text-lg font-semibold mb-4">
                            Confirm Status Change
                        </h3>

                        <p className="mb-6">
                            Change status to <b className="capitalize">{confirmModal.newStatus}</b>?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmStatusUpdate}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                            >
                                Confirm
                            </button>

                            <button
                                onClick={cancelStatusUpdate}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* status filter */}
            {activeFilter !== "user" && activeFilter !== "delivery" && activeFilter !== "sales" && (
                <div className="mt-6">

                    <h3 className="text-lg font-semibold mb-2">
                        Orders ({filters.status || "All"})
                    </h3>

                    {statusOrders.length > 0 ? (
                        statusOrders.map(order => (
                            <div key={order._id} className="bg-white border border-gray-200 shadow-md p-4 mb-4 rounded-xl hover:shadow-lg transition">
                                <p><b>Order ID:</b> {order.orderId}</p>
                                <p><b>Customer:</b> {order.customer?.name}</p>
                                <p><b>Current Status:</b> {getDisplayStatus(order)}</p>
                                <p><b>Placed on:</b> { new Date(order.createdAt).toLocaleDateString("en-GB") } </p>
                                <p className="mt-2"> <b>Total:</b> ₹{order.pricing.total} </p>


                                {/* PRODUCTS */}
                                <div className="mt-2">
                                    <b>Products:</b>

                                    {order.purchasedItems?.filter(Boolean).map((item, i) => {
                                        const book = getBookDetails(item);

                                        if (!book) return <p key={i}>Book not found</p>;

                                        const isOpen = openProduct === `${order._id}-${i}`;

                                        return (
                                            <div key={i} className="bg-gray-50 border p-3 mt-3 rounded-lg shadow-sm">

                                                <div className="flex justify-between items-center">
                                                    <p><b>{book.bookName}</b> (x{item.quantity})</p>

                                                    <button
                                                        onClick={() =>
                                                            setOpenProduct(isOpen ? null : `${order._id}-${i}`)
                                                        }
                                                        className="text-sm px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow"
                                                    >
                                                        {isOpen ? "Hide Details" : "View Details"}
                                                    </button>
                                                </div>

                                                {/* EXPAND DETAILS */}
                                                {isOpen && (
                                                    <div className="mt-3 border-t pt-3 flex flex-col sm:flex-row gap-4">
                                                        <div className="p-2">
                                                            <img
                                                                src={`http://localhost:5000/${book.images[0]}`}
                                                                alt={book.bookName}
                                                                className="w-32 h-48 object-cover mb-2"
                                                            />
                                                        </div>

                                                        <div className="p-4">
                                                            <p><b>Name:</b> {book.bookName} </p>
                                                            <p><b>Author:</b> {book.authorName}</p>
                                                            <p><b>Language:</b> {book.language}</p>
                                                            <p><b>Year:</b> {book.publishYear}</p>
                                                            <p><b>Genre:</b> {book.genre}</p>
                                                            <p>
                                                                <b>Category:</b> {book.category?.[0]?.name} / {book.category?.[0]?.subCategory}
                                                            </p>
                                                            <p><b>Price:</b> ₹{book.bookPrice}</p>
                                                        </div>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Status toggle */}
                                <div className="mt-3">
                                    <label><b>Update Status:</b></label>
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) =>
                                            handleStatusChange(order._id, e.target.value.toLowerCase())
                                        }
                                        className="border ml-2"
                                    >
                                        <option value="placed">Placed</option>
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                                
                                {/* CANCEL Request */}
                                {order.cancelRequest && (
                                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl mt-4">
                                         <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-red-700">
                                                Cancel Request
                                            </h3>

                                            <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                                                {order.cancelRequestStatus}
                                            </span>
                                        </div>
                                        
                                        <p> <b>Reason:</b> {order.cancelReason} </p>

                                        <p>
                                            <b>Requested On:</b>{" "}
                                            {new Date(order.cancelRequestedAt)
                                                .toLocaleDateString("en-IN")}
                                        </p>

                                        {order.cancelRequestStatus === "pending" && (
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() =>
                                                        handleCancelDecision(order._id, "approved")
                                                    }
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleCancelDecision(order._id, "rejected")
                                                    }
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* RETURN Request */}
                                {order.returnRequest && ( 
                                    <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-indigo-700">
                                                Return Request
                                            </h3>

                                            <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                                                {order.returnRequestStatus}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-2">
                                            <p> <b>Reason:</b> {order.returnReason} </p>

                                            <p>
                                                <b>Requested On:</b>{" "}
                                                {new Date(order.returnRequestedAt)
                                                    .toLocaleDateString("en-IN")}
                                            </p>
                                        </div>

                                        {order.returnRequestStatus === "pending" && (
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() =>
                                                        handleReturnDecision(order._id, "approved")
                                                    }
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleReturnDecision(order._id, "rejected")
                                                    }
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No orders found</p>
                    )}
                </div>
            )}


            {/* delivery filter */}
            {activeFilter === "delivery" && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Delivery Orders
                    </h3>

                    {deliveryOrders.length > 0 ? (
                        deliveryOrders.map(order => (
                            <div key={order._id} className="bg-cyan-50 border border-cyan-200 p-4 mb-3 rounded-xl shadow-sm">

                                <p><b>Order ID:</b> {order.orderId}</p>
                                <p><b>Status:</b> {getDisplayStatus(order)}</p>

                                <p>
                                    <b>Order Date:</b>{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </p>

                                <p>
                                    <b>Delivery Date:</b>{" "}
                                    {getDeliveryDate(order.createdAt).toLocaleDateString("en-IN")}
                                </p>

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No orders found</p>
                    )}
                </div>
            )}


            {/* sales filter */}
            {activeFilter === "sales" && (
                <div className="mt-6">

                    <h3 className="text-lg font-semibold mb-4">
                        Sales ({filters.sales || "All"})
                    </h3>

                    {/* SUMMARY SECTION */}
                    <div className="bg-green-50 border border-green-300 p-5 rounded-xl mb-4 shadow-md">
                        <p>
                            <b>Total Orders:</b> {salesOrders.length}
                        </p>

                        <p>
                            <b>Total Revenue:</b> ₹{
                                salesOrders.reduce(
                                    (sum, o) => sum + (o.pricing?.total || 0),
                                    0
                                )
                            }
                        </p>
                    </div>

                    {/* ORDER LIST */}
                    {salesOrders.length > 0 ? (
                        salesOrders.map(order => (
                            <div key={order._id} className="bg-white border border-green-200 p-4 mb-3 rounded-xl shadow-sm">

                                <p><b>Order ID:</b> {order.orderId}</p>

                                <p><b>User:</b> {order.customer?.name}</p>

                                <p><b>Total:</b> ₹{order.pricing.total}</p>

                                <p>
                                    <b>Date:</b>{" "}
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </p>

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No sales data</p>
                    )}
                </div>
            )}

        </div>

    );
}