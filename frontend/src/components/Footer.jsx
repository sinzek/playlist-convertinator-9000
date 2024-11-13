export default function Footer() {
	return (
		<footer className="flex flex-col">
			<div className="flex items-center bg-gradient-to-b from-transparent to-base-100 py-[5rem]" />
            <div className="flex flex-col w-full items-center bg-base-100 pb-5">
					<p className="flex flex-row gap-1 mb-5">
						Website created and designed by
						<b> Chase Brock</b>
					</p>
					<nav className="flex flex-col items-center">
						<h6 className="font-bold mb-2">↓ CONNECT WITH ME ↓</h6>
						<div className="flex flex-row gap-10">
							<a href="https://github.com/sinzek">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-7 h-7 inline mb-1 hover:scale-110 transition-transform ease-in-out fill-current"
									viewBox="0 0 24 24"
								>
									<path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
								</svg>
							</a>
                            <a href="">
                                <p className="hover:scale-110 transition-transform ease-in-out">(insert portfolio website here)</p>
                            </a>
						</div>
					</nav>
				</div>
		</footer>
	);
}
