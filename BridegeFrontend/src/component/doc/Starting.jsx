export default function Starting() {
    return (
        <div className="flex flex-col items-start">
            <div className=" m-16">
                <div>
                    <h1 className=" text-4xl font-bold">Getting Started</h1>

                </div>
                <div className=" text-xl pt-5 ">
                    <h2 className="text-3xl font-bold">Your Step-by-Step Setup Guide</h2>
                    <p className="pt-2">Follow these steps to connect your TradingView alerts to MetaTrader using PineConnector:</p>
                    <h2 className="text-3xl font-bold pt-7">
                        1.  Verify System Compatibility

                    </h2>
                    <p className="py-4">
                        Ensure your system meets the following requirements:<br></br>
                          Supported Operating Systems:
                    </p>
                    
                        <li className="list-disc ml-6 ">Windows: 10 and 11</li>
                    
                </div>

                <div className=" text-xl pt-5 ">
                    <h2 className="text-3xl font-bold">2. Confirm Your TradingView Plan</h2>
                    <p className="pt-2">To send webhook alerts from TradingView, <span className="font-bold italic ">To send webhook alerts from TradingView, you need an Essential, Plus, Premium, Expert, Elite, or Ultimate TradingView plan.</span></p>
                    <div className="text-lg w-[90%] bg-amber-100/50 mt-7 p-4 rounded-2xl">
                        Using a TradingView Trial?
If you are on a free trial of any paid TradingView plan (Essential or higher), webhook alert functionality is typically included, satisfying this requirement.

                    </div>
                    
                    
                </div>
            </div>
        </div>
    )
}