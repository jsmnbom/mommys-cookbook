const path = require("path");
const glob = require("glob-all");
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "Mommy's Cookbook",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    themeColor: "#E91E63",
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      navigateFallback: "index.html",
      exclude: [/\.map$/, /^manifest.*\.js$/, /^_redirects$/],
      skipWaiting: true
    }
  },
  configureWebpack: {
    plugins: [
      new PurgecssPlugin({
        paths: glob.sync([
          path.join(__dirname, "./public/index.html"),
          path.join(__dirname, "./**/*.vue"),
          path.join(__dirname, "./src/**/*.ts"),
          path.join(__dirname, "./node_modules/vuetify/src/**/*.ts")
        ]),
        whitelist: [
          "v-input__prepend-inner",
          "v-input__icon",
          "v-input__icon--prepend-inner",
          "red",
          "green",
          "lighten-4",
          "lighten-1",
          "darken-4",
          "darken-1"
        ]
      })
    ]
  }
};
