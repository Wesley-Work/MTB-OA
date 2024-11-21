const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  // devServer: {
  //   allowedHosts: [
  //     'a.b.c',
  //   ],
  // },
  lintOnSave: false,
  transpileDependencies: true,
  pages: {
    'index': {
      // 入口文件，相当于单页面的 main.js
      entry: 'src/pages/index.js',
      // 模板文件
      template: 'src/pages/index.html',
      // 编译后 dist 目录下输出的文件，可以包含子目录
      filename: 'system/index.html'
    },
  },
  assetsDir: 'static',
  chainWebpack: config => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }])
  },
})