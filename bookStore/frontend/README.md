# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





<!-- display order jsx -->
import { useEffect, useState, useMemo } from "react";

export default function DisplayOrder() {
    const [viewOrder, setViewOrder] = useState([]);

    // fetching order details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch("http://localhost:5000/checkout/all-orders");
                const data = await res.json();

                if (data.success) {
                    setViewOrder(data.orders || []);
                }
            } catch (err) {
                console.log("Display order fetch error:", err);
            }
        };

        fetchOrder();
    }, []);

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

    const [filters, setFilters] = useState({
        status: "",
        deliverySort: "",
        sales: ""
    });
    
    const [selectedUserId, setSelectedUserId] = useState("");
    const [showProducts, setShowProducts] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [activeFilter, setActiveFilter] = useState("user");
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserList, setShowUserList] = useState(false);
    const [books, setBooks] = useState([]);
    const [openProduct, setOpenProduct] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        orderId: null,
        newStatus: ""
    });

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
    const statusOrders = viewOrder.filter(o => {
        if (!filters.status) return true;
        return o.orderStatus?.toLowerCase() === filters.status.toLowerCase();
    });

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
    const latestOrder = filteredOrders.length > 0 
        ? [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        : null;

    // delivery date
    const getDeliveryDate = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 3);
        return d;
    }

    // sales filter
    // const filterBySales = (orders) => {
    //     const now = new Date();
        
    //     return orders.filter(o => {
    //         const orderDate = new Date(o.createdAt);

    //         if(filters.sales === "today") {
    //             return orderDate.toDateString() === now.toDateString();
    //         } 
    //         if(filters.sales === "weekly") {
    //             const weekAgo = new Date();
    //             weekAgo.setDate(now.getDate() - 7);
    //             return orderDate >= weekAgo;
    //         }
    //         if(filters.sales === "monthly") {
    //             return( orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear() );
    //         }

    //         return true;
    //     });
    // };

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
            sales: ""
        });

        setShowAllOrders(false);
        setActiveFilter("");
    };

    useEffect(() => {
        setShowAllOrders(false);
    }, [selectedUserId]);

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

    // close view order btn
    useEffect(() => {
        if(activeFilter !== "user") {
            setShowAllOrders(false);
        }
    },[activeFilter]);

    return(
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">All Orders</h2>

            <div className="flex items-center justify-center gap-8 mb-4">
                {/* User */}
                <div className="relative w-80">
                    <label htmlFor="name-filter">User Name</label>
                    <input id="name-filter"
                        type="text"
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowUserList(true);
                        }}
                        className="w-full px-3 py-1 border rounded-lg"
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
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
                

                {/* Status */}
                <div className="flex flex-col">
                    <label htmlFor="order-status">Order Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => {
                            setFilters({ ...filters, status: e.target.value });
                            setActiveFilter("status");
                        }}
                        className="border rounded w-28 py-1"
                    >
                        <option value="">All</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>

                {/* Delivery sort */}
                <div className="flex flex-col">
                    <label htmlFor="delivery-date">Sort Delivery</label>
                    <select 
                        value={filters.deliverySort}
                        onChange={(e) => {
                            setFilters({...filters, deliverySort: e.target.value});
                            setActiveFilter("delivery");
                        }}
                        className="border rounded py-1 w-28"
                    >
                        <option value="">Select </option>
                        <option value="asc">Closest</option>
                        <option value="desc">Latest</option>
                    </select>
                </div>

                {/* Sales */}
                <div className="flex flex-col">
                    <label htmlFor="sales-filter">Sales</label>
                    <select 
                        value={filters.sales}
                        onChange={(e) => {
                            setFilters({...filters, sales: e.target.value});
                            setActiveFilter("sales");
                        }}
                        className="border rounded py-1 w-28"
                    >
                        <option value="">Sales</option>
                        <option value="today">Today</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                
                <div className="flex flex-col items-center">
                    <p> <br /> </p>
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-1 bg-red-500 text-white rounded-lg cursor-pointer"
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
                <div className="bg-white p-4 rounded-xl shadow grid grid-cols-6 grid-rows-1 gap-2">

                        <div className="mx-2 py-2">
                            <p className="py-2"><b>Order No:</b> <br />{latestOrder.orderId}</p>
                            <p className="py-2"><b>Invoice No:</b> <br /> INV-{latestOrder.orderId}</p>
                        </div>
                        
                    
                        {/* View Products */} 
                        <div className="mx-2 py-2">
                            <button 
                                onClick={() => setShowProducts(!showProducts) }
                                className="bg-blue-400 text-white px-4 py-2 rounded-xl cursor-pointer"
                            >
                                View Products 
                            </button>
                        
                            {showProducts && latestOrder.purchasedItems.map((item, i) => (
                                <div 
                                    key={i}
                                    className="bg-blue-200 p-4 m-2"
                                >
                                        <p><span className="font-semibold"> Book name: </span> {item.bookName}</p>
                                        <p><span className="font-semibold"> Quantity: </span> {item.quantity}</p>
                                        <p><span className="font-semibold"> Price: </span> ₹{item.price}</p>
                                </div>
                            ))}
                        </div>                     

                        {/* Amount */}
                        <div className="mx-2 py-2">
                            <p className="py-1"><b>Subtotal:</b> ₹{latestOrder.pricing.subtotal}</p>
                            <p className="py-1"><b>Coupon:</b> {latestOrder.pricing.coupon || "N/A"}</p>
                            <p className="py-1"><b>Discount:</b> ₹{latestOrder.pricing.discount}</p>
                            <p className="py-1"><b>Total:</b> ₹{latestOrder.pricing.total}</p>                    
                        </div>

                        {/* Address */}
                        <div className="mx-2 py-2">
                            <button
                                onClick={() => setShowAddress(!showAddress)}
                                className="bg-blue-400 text-white px-4 py-2 rounded-xl cursor-pointer"
                            >
                                View Address
                            </button>

                            {showAddress && (
                                <div className="bg-blue-200 p-2 my-2">
                                    <p> <span className="font-semibold"> Address: </span> {latestOrder.shippingAddress.address1}, {latestOrder.shippingAddress.address2}</p>
                                    <p> <span className="font-semibold"> City: </span> {latestOrder.shippingAddress.city}</p>
                                    <p> <span className="font-semibold"> Pincode: </span> {latestOrder.shippingAddress.pincode}</p>
                                    <p> <span className="font-semibold"> State: </span> {latestOrder.shippingAddress.state}</p>
                                    <p> <span className="font-semibold"> Country: </span> {latestOrder.shippingAddress.country}</p>
                                </div>
                            )}
                        </div>

                    
                        {/* Dates */}
                        <div className="mx-2 py-2">
                            <p className="py-1">
                                <b>Order Date:</b> {new Date(latestOrder.createdAt).toLocaleDateString("en-GB")}
                            </p>

                            <p className="py-1">
                                <b>Delivery Date:</b> {getDeliveryDate(latestOrder.createdAt).toLocaleDateString("en-GB")}
                            </p>
                        </div>
                    
                        {/* Status */}
                        <div className="mx-2 py-2">
                            <label htmlFor="set-status"> <b> Order Status: </b> </label>
                            <select
                                id="set-status"
                                value={latestOrder.orderStatus}
                                onChange={(e) => handleStatusChange(latestOrder._id, e.target.value.toLowerCase() )}
                                className="border rounded m-2"
                            >
                                <option value="placed">Placed</option>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    
                        {/* view order btn */}
                        <div className="mx-2 py-2">
                            <button
                                onClick={() => setShowAllOrders(prev => !prev)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                            >
                                {showAllOrders ? "Hide Orders" : "View All Orders"}
                            </button>
                        </div>
                </div>
            )}


            {/* all orders btn */}
            {showAllOrders && selectedUserOrders.length > 0 && (
                <div className="mt-6 grid grid-cols-2">
                    <h3 className="text-xl font-semibold underline m-4">Total Orders</h3> <br />

                    {filteredOrders.map(order => (
                        <div key={order._id} 
                            className="bg-indigo-200 max-w-2xl p-3 mb-2 rounded-xl">
                            
                            <p><b>Order ID:</b> {order.orderId}</p>
                            <p><b>Status:</b> {order.orderStatus}</p>
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
            )}

            {/* status update confirm message */}
            {confirmModal.open && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50">
                    
                    <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
                        <h3 className="text-lg font-semibold mb-4">
                            Confirm Status Change
                        </h3>

                        <p className="mb-6">
                            Change status to <b>{confirmModal.newStatus}</b>?
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
            {activeFilter === "status" && (
                <div className="mt-6">

                    <h3 className="text-lg font-semibold mb-2">
                        Orders ({filters.status || "All"})
                    </h3>

                    {statusOrders.length > 0 ? (
                        statusOrders.map(order => (
                            <div key={order._id} className="bg-white shadow-md p-3 mb-3 rounded-xl">
                                <p><b>Order ID:</b> {order.orderId}</p>
                                <p><b>Status:</b> {order.orderStatus}</p>

                                {/* PRODUCTS */}
                                <div className="mt-2">
                                    <b>Products:</b>

                                    {order.purchasedItems?.filter(Boolean).map((item, i) => {
                                        const book = getBookDetails(item);

                                        if (!book) return <p key={i}>Book not found</p>;

                                        const isOpen = openProduct === `${order._id}-${i}`;

                                        return (
                                            <div key={i} className="bg-gray-200 max-w-2xl p-3 mt-2 rounded-lg shadow">

                                                <div className="flex justify-between items-center">
                                                    <p><b>{book.bookName}</b> (x{item.quantity})</p>

                                                    <button
                                                        onClick={() =>
                                                            setOpenProduct(isOpen ? null : `${order._id}-${i}`)
                                                        }
                                                        className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                                                    >
                                                        {isOpen ? "Hide Details" : "View Details"}
                                                    </button>
                                                </div>

                                                {/* EXPAND DETAILS */}
                                                {isOpen && (
                                                    <div className="mt-3 border-t pt-3 flex gap-4">
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

                                <p className="mt-2">
                                    <b>Total:</b> ₹{order.pricing.total}
                                </p>

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
                            <div key={order._id} className="bg-blue-100 p-3 mb-2 rounded-xl">

                                <p><b>Order ID:</b> {order.orderId}</p>
                                <p><b>Status:</b> {order.orderStatus}</p>

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
                    <div className="bg-green-200 p-4 rounded-xl mb-4 shadow">
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
                            <div key={order._id} className="bg-green-100 p-3 mb-2 rounded-xl">

                                <p><b>Order ID:</b> {order.orderId}</p>

                                <p><b>User:</b> {order.customer?.username}</p>

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