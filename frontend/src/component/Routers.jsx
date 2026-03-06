import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./Layout";
import Wrap from "./Wrap";
import Login from "./Login";
import Sign from "./Sign";
import Portal_layout from "../portal/Portal_layout";
import Auth_check from "../portal/Auth_check";
import Subscription from "./Subscription";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children : [
        {
            path :"/",
            element: <Wrap/>
        },
        {
            path :"/login",
            element: <Login/>
        },
        {
            path :"/sign",
            element: <Sign/>
        },
        {
            path :"/pricing",
            element: <Subscription/>
        },
        
    ]
  },
  {
    path: "/portal",
    element: (
        <Auth_check>
        <Portal_layout/>
        </Auth_check>
    ),
    // children:[
    //     {
    //         path :"/portal",
    //         element: <Portal_conn/>
    //     },
    // ]
  }
]);


export default router;