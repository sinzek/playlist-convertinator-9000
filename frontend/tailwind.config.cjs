/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{html,jsx}"],
	theme: {
		extend: {
			opacity: {
				99: "0.99",
				98: "0.98",
				97: "0.97",
			},
		},
		fontFamily: {
			display: ["Poppins"],
		},
	},
	plugins: [require("tailwindcss-animated"), require("daisyui")],
	daisyui: {
		themes: ["synthwave", "fantasy"],
	},
	darkMode: ["class", '[data-theme="synthwave"]'],
};
