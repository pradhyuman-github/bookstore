import { useEffect, useState } from "react";

export default function ScrollTop() {

    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return(
        show && (
            <button onClick={scrollToTop}
            className="ri-arrow-up-s-line fixed bottom-6 right-6 z-9999 text-3xl px-3 py-2 rounded-full shadow-lg bg-white text-zinc-800 hover:bg-amber-400 transition-all duration-300">
            </button>
        )
    );
}