export default function Loader() {
    return (
        <div className="fixed inset-0 z-9999 bg-cover bg-no-repeat bg-position-[30%_center] md:bg-center"
            style={{ backgroundImage: "url('bgLoader.png')"}}
        >
            <div className="absolute inset-0 bg-[#020912]/50"></div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-6 pt-24 mt-16">
                <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-textColor mb-10">
                    Book<span className="text-primaryColor">Verse</span>
                </h1>

                {/* spinner */}
                <div className="relative flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#FF8A24]/15 blur-xl" />   

                    <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-[#39343A] border-t-[#FF9A27] border-r-[#FF9A27] shadow-[0_0_15px_rgba(255,138,36,0.35)]" />
                </div>

                {/* text */}
                <div className="text-center">
                    <h2 className="text-textColor mt-8 font-serif text-xl sm:text-3xl font-semibold">
                        Waking up the library...
                    </h2>

                    <p className="text-[#B9B6BA] mt-3 text-sm sm:text-lg">
                        Just a moment, we're getting things ready.
                    </p>
                </div>

                {/* progress bar */}
                <div className="mt-8 w-60 sm:w-70 h-2 bg-[#39343A] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 rounded-full bg-linear-to-r from-[#FFB13B] to-[#FF7A1A] shadow-[0_0_12px_rgba(255,138,36,0.65)]"> </div>
                </div>

            </div>

        </div>
    );
}