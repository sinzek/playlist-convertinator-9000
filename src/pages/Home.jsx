import { Link } from "react-router-dom";
import "../index.css";

export default function Home() {
    return(
        <>
            <div className="flex w-full flex-col lg:flex-row">
                <div className="card bg-base-200 lg:ml-5 rounded-box grid flex-grow p-5">
                    <div>
                        <h1 className="text-5xl font-bold mb-2 text-primary">Playlist Convertinator 9000</h1>
                        <h2 className="text-3xl font-italic mb-5">Transfer your playlists</h2>
                        <h3 className="text-1xl font-italic mb-10">A reliable Apple Music to YouTube Music playlist converter</h3>
                        <button className="btn btn-primary bg-repeat-shine-effect">Convert Now</button>
                    </div>
                </div>
                <div className="divider lg:divider-horizontal" />
                <div className="card bg-base-200 lg:mr-5 rounded-box grid h-32 flex-grow place-items-center p-5">
                    content
                </div>
            </div>
        </>
    )
}