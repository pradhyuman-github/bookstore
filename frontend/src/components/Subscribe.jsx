export default function Subscribe() {
    return(
        <div className="py-2 sm:py-10 lg:py-20">

            <div className="flex flex-col lg:flex-row items-center justify-between md:mx-20 px-4 sm:px-6 lg:px-10 py-6">
                <div className="">
                    <p className="text-primaryColor text-xs sm:text-base md:text-lg uppercase tracking-widest">The Thursday Letter</p>
                    <p className="text-headingColor text-2xl md:text-4xl font-bold"> One good book, <br /> every Thursday. </p>
                    
                    <p className="text-textColor text-xs sm:text-base wrap-break-word pt-2 sm:pt-5"> 
                        A short note from the shop floor with one pick and why <br /> we love it. No sales blasts. 
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 mt-5 lg:mt-0">
                    <input 
                        type="email" 
                        placeholder="you@example.com"
                        className="w-55 md:w-80 lg:w-md py-1 md:py-3 px-4 text-sm sm:text-base text-textColor bg-surfaceColor rounded-full border border-borderColor focus:border-primaryDarkColor focus:outline-none"
                    />

                    <button className="px-3 py-1 md:px-8 md:py-3 bg-primaryColor rounded-full text-sm font-medium hover:bg-primaryHoverColor">
                        Subscribe
                    </button>
                </div>
            </div>

        </div>
    );
}