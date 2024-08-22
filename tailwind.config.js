/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontSize: {
        deskh1: ["3.75rem", { lineHeight: "115%", fontWeight: "800" }],
        deskh2: ["3.125rem", { lineHeight: "115%", fontWeight: "800" }],
        deskh3: ["2.5625rem", { lineHeight: "115%", fontWeight: "800" }],
        deskh4: ["2.1875rem", { lineHeight: "115%", fontWeight: "800" }],
        deskh5: ["1.8125rem", { lineHeight: "115%", fontWeight: "800" }],
        deskh6: ["1.5rem", { lineHeight: "115%", fontWeight: "800" }],
        deskp: ["1.25rem", { lineHeight: "160%", fontWeight: "400" }],
        desksmp: ["1.0625rem", { lineHeight: "160%", fontWeight: "400" }],
        deskxsp: ["0.875rem", { lineHeight: "160%", fontWeight: "300" }],
        mobh1: ["2.25rem", { lineHeight: "115%", fontWeight: "800" }],
        mobh2: ["2rem", { lineHeight: "115%", fontWeight: "800" }],
        mobh3: ["1.8125rem", { lineHeight: "115%", fontWeight: "800" }],
        mobh4: ["1.625rem", { lineHeight: "115%", fontWeight: "800" }],
        mobh5: ["1.4375rem", { lineHeight: "115%", fontWeight: "800" }],
        mobh6: ["1.25rem", { lineHeight: "115%", fontWeight: "800" }],
        mobp: ["1.125rem", { lineHeight: "160%", fontWeight: "400" }],
        mobsmp: ["1rem", { lineHeight: "160%", fontWeight: "400" }],
        mobxsp: ["0.875rem", { lineHeight: "160%", fontWeight: "300" }],
      },
    },
  },
  plugins: [],
};
