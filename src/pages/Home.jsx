export default function Home() {
    return(
        <>
            <div className="flex w-full flex-col lg:flex-row">
                <div className="card bg-base-200 lg:ml-5 rounded-box grid flex-grow w-1/2 p-5">
                    <div>
                        <h1 className="text-5xl font-bold mb-2 text-primary">Transfer your playlists</h1>
                        <h2 className="text-2xl font-italic mb-10">Chase's reliable Apple Music to YouTube Music playlist converter</h2>
                        <button className="btn btn-primary">Get Started</button>
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