const fontMagician = require("postcss-font-magician");
const autoPrefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const cssNano = require("cssnano");

module.exports = {
    plugins: [
        autoPrefixer(),
        cssNano({
            preset: "default",
        }),
        fontMagician({
            variants: {
                "IBM Plex Sans": {
                    400: ["woff2"],
                    "400 italic": ["woff2"],
                    700: ["woff2"],
                },
                "IBM Plex Serif": {
                    700: ["woff2"],
                },
            },
            display: "swap",
            foundries: ["google"],
            protocol: "https:",
        }),
        postcssPresetEnv(),
    ],
};
