/*
 * @Author: Whzcorcd
 * @Date: 2020-04-10 13:59:10
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-05-11 11:07:12
 * @Description: file content
 */
const fs = require('fs-extra')

class Redirect {
  constructor(options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw new Error(`配置信息应为 Object`)
    }

    this.config = Object.assign(
      {
        cdn: true,
        url: '',
        prefix: '',
        output: '',
        variable: '.p',
        env: 'production'
      },
      options
    )

    if (['cdn', 'url'].some(key => !options[key])) {
      throw new Error(`请填写正确的 cdn, url 和 prefix`)
    }
  }

  outputInfo(info) {
    process.chdir(this.config.output)
    const str = info.toString()
    fs.writeFile(`${this.config.output}/info.json`, str, err => {
      if (err) {
        console.log(err)
        return err
      }
      console.log('Info Output')
    })
  }

  redirectIndexPath() {
    const path = this.config.prefix
      ? `=${this.config.url}`
      : `=${this.config.url}/`
    process.chdir(this.config.output)
    console.log(`构建环境：${this.config.env}`)
    fs.readFile(`${this.config.output}/index.html`, (err, data) => {
      if (err) {
        console.log(err)
        return err
      }
      let str = data.toString()
      str = str.split(`=/${this.config.prefix}`).join(path)
      fs.writeFile(`${this.config.output}/index.html`, str, err => {
        if (err) {
          console.log(err)
          return err
        }
        console.log('Index Redirect Complete')
      })
    })
  }

  redirectAppPath(assets) {
    const path = `"${this.config.url}/"`
    process.chdir(this.config.output)
    console.log(`构建环境：${this.config.env}`)
    const pathSum = Object.keys(assets)
    let appPath = ''
    pathSum.forEach(item => {
      if (
        item.includes('app') &&
        item.includes('js') &&
        !item.includes('chunk')
      )
        appPath = item
    })
    fs.readFile(`${this.config.output}/${appPath}`, (err, data) => {
      if (err) {
        console.log(err)
        return err
      }
      let str = data.toString()
      str = str.split(`${this.config.variable}+`).join(`${path}+`)
      str = str.split(`=${this.config.variable}`).join(`=${path}`)
      fs.writeFile(`${this.config.output}/${appPath}`, str, err => {
        if (err) {
          console.log(err)
          return err
        }
        console.log('App Redirect Complete')
      })
    })
  }
}

module.exports = Redirect
