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
  }
};
