// Tailwind v4 via PostCSS — NOT `astro add tailwind` / the Vite plugin
// (Astro 6 bug, withastro/astro#16542). Same setup as Main Website.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
