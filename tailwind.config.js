// tailwind.config.js
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                integral: ["IntegralCF", "sans-serif"], // 👈 Use as "font-integral"
            },
        },
    },
    plugins: [],
};
