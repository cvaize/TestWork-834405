const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",

  important: "#app",

  purge: ["./src/**/*.vue"],

  theme: {
    styles: {
      "font-feature-settings-num-on": {
        "font-feature-settings": '"tnum" on,"lnum" on',
      },
    },

    screens: {
      xs: "576PX",
      // => @media (min-width: 576px) { ... }

      sm: "640PX",
      // => @media (min-width: 640px) { ... }

      md: "768PX",
      // => @media (min-width: 768px) { ... }

      lg: "1024PX",
      // => @media (min-width: 1024px) { ... }

      xl: "1280PX",
      // => @media (min-width: 1280px) { ... }

      xxl: "1400PX",
      // => @media (min-width: 1280px) { ... }

      xxxl: "1536PX",
      // => @media (min-width: 1536px) { ... }
    },
    container: {
      padding: "1rem",
      center: true,
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      white: "#FFFFFF",
      black: "#000000",

      "dark-gunmetal": "#212529",
      "eerie-black": "#16181b",
      "yankees-blue": "#152536",
      "anti-flash-white": "#F2F4F7",
      "bright-gray": "#e9ecef",
      "light-gray": "#ced4da",
      "cadet-blue-crayola": "#ABB5BE",
      apple: "#59B95A",
      "may-green": "#479448",
      "pastel-red": "#FF6767",
      "sunset-orange": "#ff5555",
      "auro-metal-saurus": "#6c757d",
      "sea-serpent": "#61C4DA",
      "black-coral": "#565e64",
      platinum: "#DEE2E6",
      "platinum-50": "#DEE2E680",
      "azureish-white": "#d9edf7",
      blueberry: "#4985F8",
      "han-blue": "#3A6AC6",
      "maximum-yellow-red": "#F0B146",
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  // variants: {
  //     extend: {
  //         opacity: ['disabled'],
  //     },
  // },

  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant("placeholder", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`placeholder${separator}${className}`)}::placeholder`;
        });
      });
      addVariant("placeholder-in", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `placeholder-in${separator}${className}`
          )} input::placeholder, .${e(
            `placeholder-in${separator}${className}`
          )} textarea::placeholder`;
        });
      });
      addVariant("not-disabled", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `not-disabled${separator}${className}`
          )}:not(:disabled), .${e(
            `not-disabled${separator}${className}`
          )}:not(.disabled)`;
        });
      });
      addVariant("is-active", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`is-active${separator}${className}`)}.active`;
        });
      });
      addVariant("group-is-active", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group.active .${e(
            `group-is-active${separator}${className}`
          )}`;
        });
      });
      // addVariant('is-after-active-group', ({ modifySelectors, separator }) => {
      //     modifySelectors(({ className }) => {
      //         return `.group.active ~ .${e(`is-after-active-group${separator}${className}`)}`
      //     })
      // })
      addVariant("after-group-disabled", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group${separator}disabled ~ .${e(
            `after-group-disabled${separator}${className}`
          )}`;
        });
      });
      addVariant("after-group-hover", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group${separator}hover + .${e(
            `after-group-hover${separator}${className}`
          )}`;
        });
      });
      addVariant("after-group-focus", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group${separator}focus + .${e(
            `after-group-focus${separator}${className}`
          )}`;
        });
      });
      addVariant("after-group-checked", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group${separator}checked ~ .${e(
            `after-group-checked${separator}${className}`
          )}`;
        });
      });
      addVariant(
        "after-group-checked-in-element",
        ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.group${separator}checked ~ * >.${e(
              `after-group-checked-in-element${separator}${className}`
            )}`;
          });
        }
      );
      addVariant(
        "after-group-loading-in-element",
        ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.group${separator}.loading ~ * >.${e(
              `after-group-loading-in-element${separator}${className}`
            )}`;
          });
        }
      );
      addVariant("after-group", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.group + .${e(`after-group${separator}${className}`)}`;
        });
      });
      // addVariant('after-group-placeholder-shown', ({ modifySelectors, separator }) => {
      //     modifySelectors(({ className }) => {
      //         return `.group${separator}placeholder-shown ~ .${e(`after-group-placeholder-shown${separator}${className}`)}`
      //     })
      // })
      // addVariant('in-group-hover', ({ modifySelectors, separator }) => {
      //     modifySelectors(({ className }) => {
      //         return `.group${separator}hover > .${e(`in-group-hover${separator}${className}`)}`
      //     })
      // })
    }),
    // require('@tailwindcss/forms')
  ],
};
