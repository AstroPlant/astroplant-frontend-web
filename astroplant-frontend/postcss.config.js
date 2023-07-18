const config = {
  plugins: [
    require("postcss-nesting"),
    require("@csstools/postcss-oklab-function"),
    require("@csstools/postcss-color-mix-function"),
  ],
};

module.exports = config;
