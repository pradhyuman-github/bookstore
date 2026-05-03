import { useState } from "react";
import { useNavigate } from "react-router";
import CheckoutForm from "../components/CheckoutForm";
import CheckoutOrder from "../components/CheckoutOrder";

export default function Checkout() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    });

    return (
        <div className="min-h-screen bg-stone-100 p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 bg-zinc-700 text-white hover:bg-zinc-800 px-3 py-1 rounded"
                >
                    ← Back
                </button>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <CheckoutForm form={form} setForm={setForm} />
                <CheckoutOrder form={form} />

            </div>
            
        </div>
    );
}