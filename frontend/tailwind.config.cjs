/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{html,jsx}"],
	theme: {
		extend: {
			opacity: {
				'99': '0.99',
				'98': '0.98',
				'97': '0.97',
			},
		},
		fontFamily: {
			'display': ['Poppins'],
		}
	},
	plugins: [require("@tailwindcss/typography"),require("daisyui")],
	daisyui: {
		themes: [
			"dark",
			"light"
		]
	},
	darkMode: ['class', '[data-theme="synthwave"]']
};
