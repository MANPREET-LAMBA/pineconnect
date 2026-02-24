import SecondCard from "./SecondCard";
import logo from "../assets/pine.svg";

export default function Second(){
    const data = [
        {url:"#",title:"Instant Signal Alert",dis : "Real Time TradingView triggers to execute your order"},
        {url:"#",title:" Signal Alert",dis : "Real Time TradingView triggers to execute your order"},
        {url:"#",title:"opy Trading  ",dis : "Mirror leading props traders,cmanager multiple account with ease"}
        
    ]
    return(
        <div className="w-full h-fit pb-10 px-14">
            <div>
                <div className="w-full flex justify-center ">
                    <h1 className="text-6xl font-bold ">
                        Everything You Need in One Tool
                    </h1>
                </div>
                <div className=" flex justify-evenly pt-16">
                    {
                        data.map((e)=>(
                            <SecondCard url={logo} heading = {e.title} dis = {e.dis} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}