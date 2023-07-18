const config = {
  plugins: [
    require("postcss-nesting"),
    require("@csstools/postcss-oklab-function")({ preserve: true }),
  ],
};

module.exports = config;
