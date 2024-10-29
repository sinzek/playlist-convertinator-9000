import { Link } from "react-router-dom";
import "../index.css";

export default function Home() {
    return(
        <>
            <div className="flex flex-col lg:flex-row">
                <div className="card card-bg lg:ml-5 lg:mr-2.5 mx-5 lg:mb-0 mb-5 rounded-box flex-grow p-5 items-center text-center justify-center lg:items-start lg:text-left shadow-lg">
                    <h1 className="text-5xl font-bold mb-2 text-primary">Playlist Convertinator 9000</h1>
                    <h2 className="text-3xl font-italic mb-5">Transfer your playlists</h2>
                    <h3 className="text-1xl font-italic mb-10">A reliable Apple Music to YouTube Music playlist converter</h3>
                    <button className="btn btn-primary w-[10rem] bg-repeat-shine-effect mt-auto">Convert Now</button>
                </div>
                <div className="card card-bg lg:mr-5 lg:ml-2.5 mx-5 lg:mb-0 mb-5 rounded-box grid flex-grow place-items-center p-5 shadow-lg">
                    <img src="/APPLE-YT-GRAPHIC.png" className="grow-shrink-effect png-shadow h-auto sm:w-[20rem] w-[10rem]"/>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="card card-bg rounded-box flex-grow mx-5 lg:mb-0 mb-5 lg:mt-5 p-5 items-center text-center justify-center lg:items-start lg:text-left shadow-lg">
                    <h2 className="text-3xl mb-5 text-primary font-bold">How it works</h2>
                        <h3 className="text-xl">1. Connect Your Accounts</h3><p className="mb-2">Start by linking your Apple Music and YouTube Music accounts for seamless integration</p>
                        <h3 className="text-xl">2. Select Your Playlist</h3><p className="mb-2">Choose the Apple Music playlist you want to convert or select songs to add</p>
                        <h3 className="text-xl">3. Convert and Enjoy</h3><p className="">With a single click, convert your playlist and view it in your YouTube Music library in seconds</p>
                </div>
            </div>
        </>
    )
}