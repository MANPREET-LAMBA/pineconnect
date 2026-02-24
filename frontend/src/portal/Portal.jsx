import { Link } from "react-router";
import logo from "../assets/pine.svg"
export default function Portal() {
  return (
    <div className=" relative w-full h-fit">
        <div className=" h-screen absolute  w-[18%] bg-purple-600/15 blur-3xl "/>
                <div className=" h-screen absolute  w-[18%] border-r-4 border-r-purple-600/55 "/>

      <div className=" h-screen absolute  w-[18%]   ">
        <div className="w-full h-[20%] flex justify-center">
            <img className="w-20" src={logo}/>
        </div>
        <div className="w-full flex justify-center ">
            <ul className="w-fit text-2xl font-semibold tracking-wider flex flex-col gap-2  ">
                <Link > <li>Connection</li></Link>
                <Link><li>Algo</li></Link>
                <Link><li>Mannual Handle</li></Link>
                
            </ul>
        </div>
      </div>
      <div></div>
    </div>
  );
}
