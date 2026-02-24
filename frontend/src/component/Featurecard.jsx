export default function Featurecard({urlimg,title,dis}){
    console.log(urlimg)
    return(
        <div className="p-4 relative border rounded-xl w-96">
            <div className=" ">
                <img className="w-[60%] " src={urlimg}/>
            </div>
            <div >
                <h1 className="text-3xl font-semibold">{title}</h1>
                <p>
                    {dis}
                </p>
            </div>
        </div>
    )
}