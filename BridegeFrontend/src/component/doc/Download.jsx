export default function Download() {
    return (
        <div className="w-full flex flex-col items-start">
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-8">
                
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Download the EA and DLL File
                    </h1>
                </div>

                <div className="text-base md:text-xl pt-6">
                    <h2 className="text-2xl md:text-3xl font-semibold italic">
                        Set Up the PineConnector EA on MetaTrader
                    </h2>

                    <div className="mt-6 w-full">
                        <div className="w-full rounded-2xl border border-white/20 p-4 md:p-6">
                            <p>
                                Download the required EA and DLL files, then place
                                them inside your MetaTrader folders.
                            </p>
                        </div>

                        <div className="mt-6 w-full rounded-2xl bg-amber-100/50 p-4 md:p-6 text-sm md:text-lg">
                            <strong>Note:</strong> Make sure MetaTrader is closed
                            before copying the files.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}