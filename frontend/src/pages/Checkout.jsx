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
        <div className="min-h-screen bg-mainBg p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 border border-borderColor bg-cardColor text-textColor hover:bg-cardHoverColor px-3 py-1 rounded"
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