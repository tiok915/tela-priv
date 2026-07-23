import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                "privacy-com-br-cambria-math-regular":
                    "var(--privacy-com-br-cambria-math-regular-font-family)",
                "privacy-com-br-poppins-medium":
                    "var(--privacy-com-br-poppins-medium-font-family)",
                "privacy-com-br-poppins-regular":
                    "var(--privacy-com-br-poppins-regular-font-family)",
                "privacy-com-br-semantic-button":
                    "var(--privacy-com-br-semantic-button-font-family)",
                "privacy-com-br-semantic-heading-1":
                    "var(--privacy-com-br-semantic-heading-1-font-family)",
                "privacy-com-br-semantic-heading-2":
                    "var(--privacy-com-br-semantic-heading-2-font-family)",
                "privacy-com-br-semantic-link":
                    "var(--privacy-com-br-semantic-link-font-family)",
            },
        },
    },
    plugins: [],
};

export default config;
