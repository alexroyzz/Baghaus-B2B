/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F2EA",
        bone: "#EFE8DA",
        espresso: "#1B1712",
        charcoal: "#2E2A24",
        camel: "#A9784F",
        "camel-light": "#C79A6E",
        taupe: "#D9CBB6",
        brass: "#8C6B3E",
        rust: "#8A4B32",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      borderRadius: {
        // Shared radius scale so every "card"-like surface across the site
        // (category/product cards, image frames, modals, form panels) reads
        // as one consistent, premium-soft language. Mobile gets the smaller
        // end of the 24–32px range; larger surfaces on desktop step up to
        // the top end. Smaller boxed elements (buttons, chips, thumbnails)
        // intentionally use Tailwind's own smaller tokens (lg/xl/2xl) so
        // the rounding scales down with element size instead of everything
        // becoming uniformly pill-like.
        card: "1.5rem" /* 24px */,
        "card-lg": "2rem" /* 32px */,
      },
      boxShadow: {
        tag: "0 1px 0 rgba(27,23,18,0.06), 0 8px 24px -12px rgba(27,23,18,0.35)",
        card: "0 2px 8px -2px rgba(27,23,18,0.08), 0 12px 32px -16px rgba(27,23,18,0.18)",
        "card-hover": "0 4px 14px -2px rgba(27,23,18,0.12), 0 20px 44px -16px rgba(27,23,18,0.28)",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};
