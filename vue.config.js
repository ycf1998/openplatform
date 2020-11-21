module.exports = {
  // 当作为子路径，需要指定子路径
  publicPath: '/openplatform/',
  // 开发时，代理后台接口的配置
  devServer: {
    // // 设置默认端口
    port: 8081,
    // 默认打开浏览器
    open: false,
    // 设置代理
    proxy: {
      // 这样就可以在代码中用/api来代替http://localhost:8080，如换axios的基础路径为/api
      '/api': {
        // 目标 API 地址
        //target: 'http://118.31.77.63:8080', // 真实的api地址
        target: 'http://127.0.0.1:8080', // 真实的api地址
        // 如果要代理 websockets
        // ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/uploads': {
        //target: 'http://118.31.77.63:8080/uploads',
          target: 'http://127.0.0.1:8080/uploads',
          changeOrigin: true,
          pathRewrite: {
            '^/uploads': '/'
          }
      }
    }
  },
  // svg图标
  chainWebpack: config => {
    // 一个规则里的 基础Loader
    // svg是个基础loader
    const svgRule = config.module.rule('svg')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  }
}