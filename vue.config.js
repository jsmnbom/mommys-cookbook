module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "Mommy's Cookbook",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    themeColor: "#E91E63",
    manifestOptions: {
      start_url: "/"
    }
  }
};
