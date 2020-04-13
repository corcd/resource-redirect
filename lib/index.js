const Redirect = require('./redirect')

class WebpackRedirectPlugin extends Redirect {
  constructor(options) {
    super(options)
  }

  // 应用函数
  apply(compiler) {
    const output = compiler.outputPath || compiler.options.output.path
    if (output) {
      this.config.output = output
    } else {
      throw new Error(`请配置 Output`)
    }
    // 绑定钩子事件
    if (compiler.hooks) {
      compiler.hooks.done.tapAsync(
        'WebpackRedirectPlugin',
        this.handle.bind(this)
      )
    } else {
      compiler.plugin('done', this.handle.bind(this))
    }
  }

  handle(compilation, callback) {
    const assets = compilation.compilation.assets
    console.log(Object.keys(assets))
    this.redirectIndexPath()
    this.redirectAppPath(assets)
    if (typeof callback === 'function') {
      callback()
    }
  }
}

module.exports = WebpackRedirectPlugin
