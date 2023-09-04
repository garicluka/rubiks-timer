/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                biglayout: "300px 1fr 300px",
                mediumlayout: "280px 1fr 280px",
                smalllayout: "1fr 1fr",
            },
        },
        screens: {
            tab: { max: "1400px" },
            mob: { max: "1050px" },
        },
    },
    plugins: [],
};
