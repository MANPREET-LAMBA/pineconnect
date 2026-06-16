export default function Starting() {
    return (
        <div className="w-full flex flex-col items-start">
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-8">
                
                {/* Heading */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Getting Started
                    </h1>
                </div>

                {/* Section 1 */}
                <div className="text-base md:text-xl pt-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Your Step-by-Step Setup Guide
                    </h2>

                    <p className="pt-3">
                        Follow these steps to connect your TradingView alerts to
                        MetaTrader using PineConnector:
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold pt-8">
                        1. Verify System Compatibility
                    </h2>

                    <p className="py-4">
                        Ensure your system meets the following requirements:
                        <br />
                        Supported Operating Systems:
                    </p>

                    <ul className="list-disc ml-6 space-y-2">
                        <li>Windows 10</li>
                        <li>Windows 11</li>
                    </ul>
                </div>

                {/* Section 2 */}
                <div className="text-base md:text-xl pt-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        2. Confirm Your TradingView Plan
                    </h2>

                    <p className="pt-3">
                        To send webhook alerts from TradingView,{" "}
                        <span className="font-bold italic">
                            you need an Essential, Plus, Premium, Expert, Elite,
                            or Ultimate TradingView plan.
                        </span>
                    </p>

                    <div className="text-sm md:text-lg w-full md:w-[90%] bg-amber-100/50 mt-7 p-4 md:p-6 rounded-2xl">
                        <strong>Using a TradingView Trial?</strong>
                        <br />
                        If you are on a free trial of any paid TradingView plan
                        (Essential or higher), webhook alert functionality is
                        typically included, satisfying this requirement.
                    </div>
                </div>

            </div>
        </div>
    );
}