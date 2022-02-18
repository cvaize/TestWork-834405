module.exports = {
  plugins: [
    ["postcss-import"],
    ["postcss-nested"],
    ["tailwindcss"],
    ["postcss-color-function"],
    ["postcss-discard-duplicates"],
    ["postcss-combine-duplicated-selectors"],
    [
      "postcss-pxtorem",
      {
        rootValue: 16,
        unitPrecision: 5,
        propList: ["*"],
        minPixelValue: 4,
      },
    ],
    ["autoprefixer"],
  ],
};
