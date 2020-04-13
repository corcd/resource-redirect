const Redirect = require('./redirect')

class WebpackRedirectPlugin extends Redirect {
  constructor(options) {
    super(options)
  }

  // 应用函数
  apply(compiler) {
    const output = compiler.outputPath || compiler.options.output.path
    if (!output) {
      throw new Error(`请配置 output`)
    }
    // 绑定钩子事件
    if (compiler.hooks) {
      compiler.hooks.done.tapAsync('WebpackRedirectPlugin', compilation => {
        this.redirectIndexPath(output)
        this.redirectAppPath(output, compilation.assetsInfo)
      })
    } else {
      compiler.plugin('done', compilation => {
        this.redirectIndexPath(output)
        this.redirectAppPath(output, compilation.assetsInfo)
      })
    }
  }
}

module.exports = WebpackRedirectPlugin
