const CracoLessPlugin = require("craco-less");
const { getThemeVariables } = require("antd/dist/theme");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              ...getThemeVariables({
                dark: true,
                compact: true,
              }),
              "primary-color": "#42E2B8",
              "link-color": "#42E2B8",
              "border-radius-base": "2px",
              "btn-primary-color": "#000",
              // black: "#01161E",
              // black: "#333D48",
              // black: "#011627",
              // black: "#040F16",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
