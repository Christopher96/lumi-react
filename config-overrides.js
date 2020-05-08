const {
  override,
  addWebpackPlugin,
  addLessLoader,
  fixBabelImports,
  adjustStyleLoaders,
} = require("customize-cra");

const AntdScssThemePlugin = require("antd-scss-theme-plugin");
const path = require("path");

module.exports = override(
  fixBabelImports("antd", {
    libraryDirectory: "es",
    style: true,
  }),
  addWebpackPlugin(
    new AntdScssThemePlugin(path.join(__dirname, "src", "colors.scss"))
  ),
  adjustStyleLoaders((rule) => {
    const loaders = rule.use;
    const newUse = [];
    loaders.forEach((loaderObj) => {
      if (typeof loaderObj === "object") {
        if (loaderObj.loader.indexOf("sass-loader") !== -1) {
          newUse.push(
            AntdScssThemePlugin.themify({
              loader: "sass-loader",
              options: {
                sourceMap: process.env.NODE_ENV !== "production",
              },
            })
          );
        } else {
          newUse.push(loaderObj);
        }
      } else {
        newUse.push(loaderObj);
      }
    });
    rule.use = newUse;
    return rule;
  }),
  addLessLoader({
    // If you are using less-loader@5 please spread the lessOptions to options directly
    javascriptEnabled: true,
    modifyVars: { "@primary-color": "#1DA57A" },
  })
);
