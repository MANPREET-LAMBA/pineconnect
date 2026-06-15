import Nav from "./Nav";
import Hero from "./Hero"
import Second from "./Second";
import Working from "./Working";
import Feature from "./Feature";
import Subscription from "./Subscription";

export default function Wrap(){
    return(
        <div>
            
            <Hero/>
            <Second/>
            <Working/>
            <Feature/>
            <Subscription/>
        </div>
    )
}