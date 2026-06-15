import { useState } from "react";
import Download from "./doc/Download";
import Starting from "./doc/Starting";
import Working from "./Working";

export default function Docs() {
    const [set , sethandler] = useState("start");
    return (
        <div className=" grid grid-cols-6 w-full h-screen md:pt-[7%]">
            <div className="row-span-1 border-r border-white  flex flex-col items-center gap-3 text-2xl">
                <a href="" onClick={()=>{sethandler("Start")}}>Getting Start</a>
                <a href="" onClick={()=>{sethandler("download")}}>download file</a>
                <a href="">EA Setting</a>
            </div>
            <div className=" col-span-5 items-center justify-center">
                  { set == "start" && <Starting/>}
                   { set == "download" && <Download/>}
            </div>
        </div>
    )
}