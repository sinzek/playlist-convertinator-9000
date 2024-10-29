import { Link } from "react-router-dom";
import "../index.css";

export default function Home() {
    return(
        <>
            <div className="flex flex-col lg:flex-row">
                <div className="card card-bg lg:ml-5 lg:mr-2.5 mx-5 lg:mb-0 mb-5 rounded-box flex flex-grow p-5 items-center text-center lg:items-start lg:text-left shadow-lg lg:w-3/5">
                    <h1 className="text-5xl font-bold mb-2 text-primary">Playlist Convertinator 9000</h1>
                    <h3 className="text-xl font-italic mb-5">A reliable Apple Music to YouTube Music playlist converter</h3>
                    <p className="text-center lg:text-left">
                        Are you tired of the hassle of switching music streaming platforms?
                        With Playlist Convertinator 9000, it's easy for you to seamlessly transfer your
                        favorite playlists from Apple Music to YouTube Music. Whether you’re switching services
                        or just want to share your playlists with friends, this tool is here to help.
                    </p>
                    <div className="flex items-center justify-center w-full m-auto">
                        <button className="flex btn btn-primary w-[15rem] h-[4rem] bg-repeat-shine-effect text-center justify-center hover:shadow-xl  font-bold text-2xl mt-5 lg:mt-0">Convert Now</button>
                    </div>
                </div>
                <div className="card card-bg lg:mr-5 lg:ml-2.5 mx-5 lg:mb-0 mb-5 rounded-box grid flex-grow justify-center items-center p-5 shadow-lg">
                    <img src="/APPLE-YT-GRAPHIC.png" className="grow-shrink-effect png-shadow h-auto sm:w-[20rem] w-[10rem]"/>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="card card-bg rounded-box flex-grow mx-5 lg:mb-0 mb-5 lg:mt-5 p-5 justify-center items-start text-left shadow-lg">
                    <h2 className="text-3xl mb-5 text-primary font-bold">How it works</h2>
                        <h3 className="text-xl font-bold">1. Connect Your Accounts</h3><p className="mb-2">Start by linking your Apple Music and YouTube Music accounts for seamless integration</p>
                        <h3 className="text-xl font-bold">2. Select Your Playlist</h3><p className="mb-2">Choose the Apple Music playlist you want to convert or select songs to add</p>
                        <h3 className="text-xl font-bold">3. Convert and Enjoy</h3><p className="">With a single click, convert your playlist and view it in your YouTube Music library in seconds</p>
                </div>
            </div>
        </>
    )
}