// vue-cli 配置
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const UglifyJsPlugin = require('uglifyjs-webpack-plugin3')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', //部署应用包时的基本 URL
  outputDir: 'dist', //生成的生产环境构建文件的目录
  assetsDir: '', //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  indexPath: 'index.html', //指定生成的 index.html 的输出路径 (相对于 outputDir)。
  filenameHashing: false, //生成静态资源文件名包含hash
  /**
   * multi-page 模式
   * 每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是:
   *  1. 指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)；
   *  2. 指定其 entry 的字符串。
   * 例:
  pages: {
    index: {
      // page 的入口
      entry: 'src/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: 'src/subpage/main.js'
  }
  */
  lintOnSave: process.env.NODE_ENV !== 'production', // true: 将 lint 错误输出为编译警告, false: 不验证, 'error': 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败
  runtimeCompiler: false, //是否使用包含运行时编译器的 Vue 构建版本. 注: 设置为true,应用额外增加 10kb 左右
  transpileDependencies: [], //默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  productionSourceMap: true, //生产环境的 source map
  crossorigin: undefined, //设置生成HTML中,link,script标签的crossorigin属性. [anonymous, use-credentials], use-credentials: CORS请求将设置凭证标志。
  integrity: false, //设置生成HTML中,link,script标签上启用SRI安全认证.
  /**
   * 简单配置webpack
   */
  configureWebpack: config => {
    const plugins = []
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      //去掉 console.log
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: true,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']//移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
    } else {
      // 为开发环境修改配置...
    }
    config.plugins = [...config.plugins, ...plugins]
  },
  /** 链式操作webpack */
  chainWebpack:  config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'));
    // 调整内联文件的大小限制,默认4kb
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 4096 }));
  },
  css: {
    requireModuleExtension: true, //只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块
    extract: process.env.NODE_ENV == 'production', //是否将组件中的 CSS 提取至一个独立的 CSS 文件中
    sourceMap: false, //是否为 CSS 开启 source map
    /**
     * 向 CSS 相关的 loader 传递选项. 例如:
     *    loaderOptions: {
     *      css: { // 这里的选项会传递给 css-loader },
     *      postcss: { // 这里的选项会传递给 postcss-loader }
     *    }
     */
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://cms.l.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }, //API 请求代理到 API 服务器
    //设置让浏览器 overlay 同时显示警告和错误
    overlay: {
      warnings: true,
      errors: true
    }
  },
  /**
   * 传递任何第三方插件, 例如:
   * pluginOptions: {
   *    foo: {}
   * }
   */
}