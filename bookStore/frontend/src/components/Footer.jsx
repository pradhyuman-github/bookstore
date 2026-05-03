export default function Footer() {
    return (
        <div>
            <footer >
                <div className="bg-zinc-800 text-zinc-300 px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* social media */}
                        <div className="flex flex-col items-center">
                            <p className="text-center text-2xl font-semibold p-2">Connect with Us</p>

                            <div className="flex items-center justify-center gap-4 mt-2">
                                <a href="#" className="ri-instagram-line px-2 inline-block text-3xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:text-amber-400"></a>
                                <a href="#" className="ri-twitter-x-line px-2 inline-block text-3xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:text-amber-400"></a>
                                <a href="#" className="ri-whatsapp-line px-2 inline-block text-3xl transition-all duration-300 ease-out transform hover:-translate-y-1 hover:text-amber-400"></a>
                            </div> 
                        </div>

                        {/* genre link */}
                        <div className="flex flex-col items-center">
                            <p className="text-center text-xl sm:text-2xl font-semibold p-2">Genre</p>
                            <div className="grid gap-2 text-center">
                                <a href="#" className="hover:underline hover:text-amber-400">Fiction</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Mystery</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Business</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Adventure</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Self Help</a>
                            </div>
                        </div>

                        {/* quick link */}
                        <div className="flex flex-col items-center">
                            <p className="text-center text-xl sm:text-2xl font-semibold p-2">Quick links</p>
                            <div className="grid gap-2 text-center">
                                <a href="#" className="hover:underline hover:text-amber-400">Home</a>
                                <a href="#" className="hover:underline hover:text-amber-400">About</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Product</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Contact</a>
                            </div>
                        </div>

                        {/* useful link */}
                        <div className="flex flex-col items-center">
                            <p className="text-center text-xl sm:text-2xl font-semibold p-2">Useful links</p>
                            <div className="grid gap-2 text-center">
                                <a href="#" className="hover:underline hover:text-amber-400">Privacy Policy</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Terms & Conditions</a>
                                <a href="#" className="hover:underline hover:text-amber-400">Refund Policy</a>
                                <a href="#" className="hover:underline hover:text-amber-400">FAQ</a>
                            </div>
                        </div>

                        {/* newsletter */}
                        <div className="flex flex-col items-center">
                            <p className="text-center text-xl sm:text-2xl font-semibold p-2">Get latest offers</p>
                            <div className="flex flex-col items-center gap-3 mt-2 w-full">
                                <input 
                                    type="text"
                                    placeholder="Name" 
                                    className="w-full max-w-xs bg-white text-black outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded-xl"
                                />
                                <input 
                                    type="email"
                                    placeholder="Email" 
                                    className="w-full max-w-xs bg-white text-black outline-none focus:ring-2 focus:ring-amber-400 px-2 py-1 rounded-xl"
                                />
                                <button 
                                    type="submit"
                                    className="bg-amber-500 hover:bg-amber-600 transition-all duration-200 text-white px-6 py-2 rounded-md cursor-pointer"
                                > Subscribe
                                </button>                                            
                            </div>                        
                        </div>

                    </div>
                </div>

                <div className="bg-zinc-800 text-zinc-300 p-4">
                    <p className="text-center text-sm sm:text-base">@Books Store 2026 | All rights reserved</p>
                </div>

            </footer>
        </div>
    );
}