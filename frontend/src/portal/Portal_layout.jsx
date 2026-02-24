import { Outlet } from "react-router"
import Portal from "./Portal"

export default function Portal_layout(){
    return(
        <div>
            <Portal/>
            <Outlet/>
        </div>
    )
}