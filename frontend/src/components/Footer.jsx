export default function Footer() {
    return (
        <div>
            <footer
                className="relative bg-[#090D12] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('footerBg.png')" }}
            >

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-mainBg/20" />
                
                <div className="border-t border-t-borderColor text-zinc-300 px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* social media */}
                        <div className="flex flex-col items-center">
                            <p className="text-headingColor text-center text-2xl font-semibold p-2">Connect with Us</p>

                            <div className="flex items-center justify-center gap-4 mt-2">
                                <a href="#" className="ri-instagram-line px-2 inline-block text-3xl transition-all duration-300 ease-out transform hover:-translate-y-1 text-textSecondaryColor hover:text-primaryHoverColor"></a>
                                <a href="#" className="ri-twitter-x-line px-2 inline-block text-3xl transition-all duration-300 ease-out transform hover:-translate-y-1 text-textSecondaryColor hover:text-primaryHoverColor"></a>
                                <a href="#" className="ri-whatsapp-line px-2 inline-block text-3xl transition-all duration-300 ease-out transform hover:-translate-y-1 text-textSecondaryColor hover:text-primaryHoverColor"></a>
                            </div>
                        </div>

                        {/* genre link */}
                        <div className="flex flex-col items-center">
                            <p className="text-headingColor text-center text-xl sm:text-2xl font-semibold p-2">Genre</p>
                            <div className="grid gap-2 text-center">
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Fiction</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Mystery</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Business</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Adventure</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Self Help</a>
                            </div>
                        </div>

                        {/* quick link */}
                        <div className="flex flex-col items-center">
                            <p className="text-headingColor text-center text-xl sm:text-2xl font-semibold p-2">Quick links</p>
                            <div className="grid gap-2 text-center">
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Home</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">About</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Product</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Contact</a>
                            </div>
                        </div>

                        {/* useful link */}
                        <div className="flex flex-col items-center">
                            <p className="text-headingColor text-center text-xl sm:text-2xl font-semibold p-2">Useful links</p>
                            <div className="grid gap-2 text-center">
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Privacy Policy</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Terms & Conditions</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">Refund Policy</a>
                                <a href="#" className="hover:underline text-textSecondaryColor hover:text-primaryHoverColor">FAQ</a>
                            </div>
                        </div>

                        {/* newsletter */}
                        <div className="flex flex-col items-center">
                            <p className="text-headingColor text-center text-xl sm:text-2xl font-semibold p-2">Get latest offers</p>
                            <div className="flex flex-col items-center gap-3 mt-2 w-full">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full max-w-xs bg-zinc-800/60 text-textColor outline-none focus:ring-1 focus:ring-primaryColor px-3 py-1 rounded-lg"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full max-w-xs bg-zinc-800/70 text-textColor outline-none focus:ring-1 focus:ring-primaryColor px-3 py-1 rounded-lg"
                                />
                                <button
                                    type="submit"
                                    className="bg-primaryColor hover:bg-primaryHoverColor text-black font-medium transition-all duration-200 px-6 py-2 rounded-md cursor-pointer"
                                > Subscribe
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="text-textSecondaryColor p-4">
                    <p className="text-center text-sm sm:text-base">@BookVerse {new Date().getFullYear()} | All rights reserved</p>
                </div>

            </footer>
        </div>
    );
}
