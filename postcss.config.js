import fontMagician from 'postcss-font-magician';
import autoPrefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import cssNano from 'cssnano';

export default {
  plugins: [
    autoPrefixer(),
    cssNano({
      preset: 'default',
    }),
    fontMagician({
      variants: {
        'IBM Plex Sans': {
          400: ['woff2'],
          '400 italic': ['woff2'],
          700: ['woff2'],
        },
        'IBM Plex Serif': {
          700: ['woff2'],
        },
      },
      display: 'swap',
      foundries: ['google'],
      protocol: 'https:',
    }),
    postcssPresetEnv(),
  ],
};
