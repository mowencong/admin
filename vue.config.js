// vue.config.js的基础配置
module.exports = {
  //将部署应用程序包的基本URL（baseUrl在Vue CLI 3.3之前称为）
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: "dist",
  assetsDir: "assets", // 静态资源目录 (js, css, img, fonts)
  productionSourceMap: false, // 生产环境 sourceMap
  lintOnSave:false,//关闭eslint
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0", // can be overwritten by process.env.HOST
    port: 8888,
    disableHostCheck: true,
    https: false,
    hotOnly: false,
    proxy: "http://localhost:8081",
    before: app => {}
  }
};
