import { useLocation, useNavigate } from "react-router";
import { useEffect, useMemo } from "react";
import { Country, State, City } from "country-state-city";

export default function CheckoutForm({ form, setForm }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const items = useMemo(() => {
        const stored = JSON.parse(localStorage.getItem("checkoutItems"));

        return (
            location.state?.items ||
            (Array.isArray(stored) ? stored : [])
        );
    }, [location.state]);

    const countries = Country.getAllCountries();
    const states = State.getStatesOfCountry(form.country);
    const cities = form.country && form.state ? City.getCitiesOfState(form.country, form.state) : [];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (!items || items.length === 0) {
            navigate("/", { replace: true });
        }
    }, [items, navigate]);

    return(
        <div>
            {/* LEFT → FORM */}
            <form
                onClick={ (e) => e.preventDefault() } 
                className="bg-white border-2 border-stone-300 p-6 rounded-xl shadow-xl space-y-4" >
                <h2 className="text-xl text-zinc-800 font-bold">Shipping Details</h2>

                <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Name" className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded" />

                <input name="email" value={form.email} onChange={handleChange}
                    placeholder="Email" className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded" />

                <input name="contact" value={form.contact} onChange={handleChange}
                    placeholder="Contact Number" className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded" />

                <input name="address1" value={form.address1} onChange={handleChange}
                    placeholder="Address Line 1" className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded" />

                <input name="address2" value={form.address2} onChange={handleChange}
                    placeholder="Address Line 2" className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded" />

                <input name="pincode" value={form.pincode} onChange={handleChange}
                    placeholder="Pin Code" className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded" />


                <select name="country" 
                    value={form.country}
                    onChange={(e) => {
                        setForm({
                            ...form,
                            country: e.target.value,
                            state: "",
                            city: ""
                        });
                    }}
                    className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded"
                    >
                        <option value=""> Select Country </option>
                        {countries.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}> 
                                {c.name} 
                            </option>
                        ))}
                </select>

                <select
                    name="state"
                    value={form.state}
                    onChange={(e) => {
                        setForm({
                            ...form,
                            state: e.target.value,
                            city: ""
                        });
                    }}
                    disabled={!form.country}
                    className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded"
                >
                    <option value=""> Select State </option>
                    {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    disabled={!form.state}
                    className="w-full p-2 border border-amber-300 outline-none focus:ring-1 focus:ring-amber-400 rounded"
                >
                    <option value=""> Select City </option>
                    {cities.length > 0  ? ( cities.map((c) => (
                        <option key={c.name} value={c.name}>
                            {c.name}
                        </option>
                    )) ) : (
                        <option disabled>No cities available</option>
                    )}
                </select>

            </form>

        </div>
    );
}