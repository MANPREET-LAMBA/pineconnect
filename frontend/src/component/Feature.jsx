import Featurecard from "./Featurecard"
import market from "../assets/market.png"
import pending from "../assets/pending.png" 
import target from "../assets/target.svg" 
import pyramid from "../assets/pyramid.png" 
import reverse from "../assets/reverse.svg" 
import close from "../assets/close.svg" 
export default function Feature(){
     const data = [{urlimg:market,title:"Market Orders",dis:"Enter Positions at the makret with buys or sell orders",},
        {urlimg:pending,title:"Pending Orders",dis:"Create orders with buy limit and sell limit",},
        {urlimg:close,title:"Partial close",dis:"Close trade postion instantly",},
        {urlimg:target,title:"Target & volume Control",dis:"Set targets in pips",},
        {urlimg:pyramid,title:"pyramiding",dis:"manage multiple positions of the same symbol",},
        {urlimg:reverse,title:"Close on Reverse",dis:"Auto-close Positions on reverse signals, reducing risk efficiently",}
        
    ]
    return(
        
        <div>
            <div className="w-full flex justify-center">
                <h2 className="w-[55%] font-bold text-center text-5xl">
                    We've built the tools,<br/> so you can focus on what matters
                </h2>
            </div>
            <div className="w-full flex flex-wrap gap-10 pt-16 px-16 justify-center">
                {
                    data.map((e)=>(
                        <Featurecard urlimg={e.urlimg} title={e.title} dis={e.dis} />
                    ))
                }

            </div>
        </div>
    )
}