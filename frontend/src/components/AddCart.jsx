import { useNavigate } from "react-router";
import API from "../config/api";

export default function AddCart({ isOpen, onClose, cart, setCart }) {
    const navigate = useNavigate();

    const increaseQty = (id) => {
        setCart(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCart(prev =>
            prev.map(item =>
                item._id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    const totalAmount = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-stone-100 shadow-lg z-50 overflow-x-hidden transform transition-transform duration-300 flex flex-col
                    ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="bg-zinc-800 p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl text-amber-400 font-bold">Your Cart</h2>
                    <button
                        className="ri-close-line text-amber-400 text-2xl font-bold"
                        onClick={onClose}>
                    </button>
                </div>

                <div className="bg-white shadow-sm p-2 sm:p-4 overflow-y-auto flex-1">
                    {cart.length === 0 ? (
                        <p className="font-lg text-center">No items in cart</p>
                    ) :
                        (cart.map(item => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row gap-3 mb-4 border-b pb-2 justify-between"
                            >
                                <div className="flex gap-3 min-w-0">
                                    <img
                                        src={`${API}/${item.image}`}
                                        className="w-20 h-24 sm:w-16 sm:h-20 object-cover rounded"
                                    />

                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <p
                                            className="font-semibold cursor-pointer hover:underline text-sm sm:text-base line-clamp-2 wrap-break-word"
                                            onClick={() => {
                                                navigate(`/product/${item._id}`);
                                                onClose();
                                            }}
                                        >
                                            {item.bookName}
                                        </p>
                                        <p>₹{item.price}</p>

                                        <div className="w-full flex flex-wrap items-center justify-between sm:gap-20 mt-1">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => decreaseQty(item._id)}
                                                    className="px-2 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded"
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    onClick={() => increaseQty(item._id)}
                                                    className="px-2 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div>
                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm sm:text-base rounded"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="font-bold mt-2 sm:mt-0 text-right shrink-0">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>
                        )
                        ))}
                </div>

                {/* Summary */}
                <div className="p-4 border-t bg-white sticky bottom-0">
                    <p>Total items: {totalQuantity}</p>
                    <h3 className="text-lg font-bold">Total: ₹{totalAmount}</h3>

                    <button
                        onClick={() => {
                            if (cart.length === 0) return;
                            localStorage.setItem("checkoutItems", JSON.stringify(cart));
                            navigate("/checkout");
                            onClose();
                        }}
                        className="w-full bg-zinc-800 hover:bg-black text-amber-400 font-semibold mt-3 py-2 rounded text-sm sm:text-base">
                        Checkout
                    </button>
                </div>

            </div>
        </>
    );
}