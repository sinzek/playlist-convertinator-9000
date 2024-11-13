import { Link } from "react-router-dom";
import "../index.css";
import Footer from "../components/Footer";

export default function Home() {
	return (
		<>
			<div className="flex flex-col animate-fade-down animate-once animate-ease-in-out">
                <h1 className="text-center mt-[5rem] lg:mt-[6rem] text-5xl lg:text-7xl xl:text-8xl font-black mb-5">
                    Playlist Convertinator
                </h1>
                <h3 className="text-center text-pretty text-2xl font-italic mb-10">
                    A reliable Spotify to YouTube Music playlist converter (and
                    eventually more!)
                </h3>
                
                <div className="flex justify-center w-full m-auto mb-[8rem] lg:mb-[14rem]">
                    <Link to="/convert">
                        <button className="btn btn-primary bg-repeat-shine-effect hover:shadow-xl text-2xl px-20 lg:px-10 lg:h-[4rem] lg:pb-1 font-normal">
                        <svg
                            viewBox="0 0 512 512"
                            fill="currentColor"
                            className="h-7 w-6"
                        >
                            <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224h128c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-24.4 24.4-42 53.1-52.8 83.8-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v128c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1 24.4-24.4 42.1-53.1 52.9-83.7 5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2S177.7 288 168 288H40c-13.3 0-24 10.7-24 24z" />
                        </svg>
                            Get started
                        </button>
                    </Link>
                </div>
			</div>
			<div className="flex flex-col">
				<div className="card card-s-bg mx-5 lg:mx-[20%] mb-[12rem] items-start text-left animate-fade animate-once">
					<h2 className="text-3xl lg:text-4xl mb-5 text-secondary font-bold">
						How it works
					</h2>

					<div
						tabIndex={0}
						className="collapse collapse-arrow hover:shadow-lg hover:ring-1 hover:ring-secondary/5 transition-all ease-in-out"
					>
						<input type="checkbox" className="peer" />
						<div className="flex flex-row gap-2 collapse-title text-lg lg:text-xl font-bold peer-checked:text-secondary transition-colors ease-in-out duration-150">
							<svg
								viewBox="0 0 800 900"
								fill="currentColor"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path d="M294 734c9.333-9.333 20.667-14 34-14 13.333 0 25.333 4.667 36 14 21.333 22.667 21.333 46 0 70l-42 40c-37.333 37.333-81.333 56-132 56-52 0-96.667-18.667-134-56S0 762.667 0 712c0-52 18.667-96.667 56-134l148-148c46.667-45.333 94.667-71 144-77s92 8.333 128 43c10.667 10.667 16 22.667 16 36 0 13.333-5.333 25.333-16 36-24 21.333-47.333 21.333-70 0-33.333-32-77.333-20.667-132 34L126 648c-17.333 17.333-26 38.667-26 64s8.667 46 26 62c17.333 17.333 38.333 26 63 26s45.667-8.667 63-26l42-40m450-574c37.333 37.333 56 81.333 56 132 0 52-18.667 96.667-56 134L586 584c-49.333 48-99.333 72-150 72-41.333 0-78.667-16.667-112-50-9.333-9.333-14-20.667-14-34 0-13.333 4.667-25.333 14-36 9.333-9.333 21-14 35-14s25.667 4.667 35 14c33.333 32 74 24 122-24l158-156c18.667-18.667 28-40 28-64 0-25.333-9.333-46-28-62-16-17.333-34.667-27.667-56-31-21.333-3.333-41.333 3.667-60 21l-50 50c-10.667 9.333-22.667 14-36 14-13.333 0-24.667-4.667-34-14-22.667-22.667-22.667-46 0-70l50-50c36-36 78.333-53 127-51s91.667 22.333 129 61" />
							</svg>
							Connect Your Accounts
						</div>
						<div className="collapse-content border-gray-100">
							<p>
								Start by signing up and linking your Spotify and YouTube Music
								accounts for seamless integration
							</p>
						</div>
					</div>
					<div
						tabIndex={0}
						className="collapse collapse-arrow hover:shadow-lg hover:ring-1 hover:ring-secondary/5 transition-all ease-in-out"
					>
						<input type="checkbox" className="peer" />
						<div className="flex flex-row gap-2 collapse-title text-lg lg:text-xl font-bold peer-checked:text-secondary transition-colors ease-in-out">
							<svg
								viewBox="0 0 24 20"
								fill="currentColor"
								className="inline-block h-6 w-6 stroke-current stroke-[0.5]"
							>
								<path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-6.933 12.481l-3.274-3.274 1.414-1.414 1.726 1.726 4.299-5.159 1.537 1.281-5.702 6.84z" />
								<path d="M4 22h11v-2H4V8H2v12c0 1.103.897 2 2 2z" />
							</svg>
							Select Your Playlist
						</div>
						<div className="collapse-content">
							<p>
								Choose the Spotify playlist you want to convert or select songs
								to add
							</p>
						</div>
					</div>
					<div
						tabIndex={0}
						className="collapse collapse-arrow hover:shadow-lg hover:ring-1 hover:ring-secondary/5 transition-all ease-in-out"
					>
						<input type="checkbox" className="peer" />
						<div className="flex flex-row gap-2 collapse-title text-lg lg:text-xl font-bold peer-checked:text-secondary transition-colors ease-in-out">
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								className="inline-block h-7 w-6"
							>
								<path fill="none" d="M0 0h24v24H0z" />
								<path d="M12 2a9 9 0 019 9v7.5a3.5 3.5 0 01-6.39 1.976 2.999 2.999 0 01-5.223 0 3.5 3.5 0 01-6.382-1.783L3 18.499V11a9 9 0 019-9zm4 11h-2a2 2 0 01-3.995.15L10 13H8l.005.2a4 4 0 007.99 0L16 13zm-4-6a2 2 0 100 4 2 2 0 000-4z" />
							</svg>
							Convert and Enjoy
						</div>
						<div className="collapse-content">
							<p>
								With a single click, convert your playlist and view it in your
								YouTube Music library in seconds
							</p>
						</div>
					</div>
				</div>
			</div>
            <Footer />
		</>
	);
}
