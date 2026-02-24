import { useState, useEffect } from "react";
import logo from "../assets/pine.svg";
import { Link } from "react-router";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

   useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const themehandler = ()=>{
    const currenttheme = document.documentElement.classList.contains("dark")?"light":"dark";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", currenttheme)
  }

  return (
    <div className="w-full text-white  px-14 flex justify-center  sticky top-0 pt-3 z-50   "  >
      <div className={` h-20  flex flex-row justify-between items-center px-3  ${scrolled ? "w-[70%] bg flex justify-between transition-all duration-500 bg-white/35 dark:bg-black/35 dark:text-white backdrop-blur-xl  shadow-lg rounded-2xl ":" transition-all dark:text-black duration-500 w-full"} `}>
        <div>
          <img className="w-14" src={logo} />
        </div>
        <div className="w-fit px-3  ">
          <ul className="flex gap-5 text-2xl">
            <Link to="/"><li>Home</li></Link>
            <li>About us</li>
            <li>Document</li>
            <Link to="/pricing"><li>Pricing</li></Link>
           
          </ul>
        </div>
        <div className="flex gap-3">
          
          <Link to="/login"> <button  className={` text-4xl font-bold bg-white rounded-xl`}>
            login
          </button> </Link>
          <button className={` text-4xl font-bold bg-white rounded-xl`}>
            contact
          </button>
        </div>
      </div>
    </div>
  );
}
