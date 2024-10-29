/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{html,jsx}"],
	theme: {
		extend: {},
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
