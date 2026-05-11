export default function Loader() {
    return (
        <div className="fixed inset-0 z-9999 bg-zinc-950 flex flex-col items-center justify-center gap-6">

            {/* spinner */}
            <div className="w-16 h-16 border-4 border-zinc-700 border-t-amber-400 rounded-full animate-spin">
            </div>

            {/* text */}
            <div className="text-center">
                <h2 className="text-zinc-200 text-2xl font-bold">
                    Loading...
                </h2>

                <p className="text-zinc-400 mt-2">
                    Please wait while content loads
                </p>
            </div>

            {/* loading bar */}
            <div className="w-55 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-amber-400 animate-[loading_1.5s_linear_infinite]">
                </div>
            </div>

        </div>
    );
}