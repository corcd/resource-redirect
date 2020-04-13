const fs = require('fs-extra')

class Redirect {
  constructor(options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw new Error(`配置信息应为 Object`)
    }

    this.config = Object.assign(
      {
        region: 'oss-cn-hangzhou',
        bucket: 'guangdianyun-static',
        prefix: '',
        output: '',
        env: 'production'
      },
      options
    )

    if (['bucket', 'region', 'prefix'].some(key => !options[key])) {
      throw new Error(`请填写正确的 Region、Bucket 和 Prefix`)
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
    const path = `=https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${this.config.prefix}`
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
    const path = `"https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${this.config.prefix}/"`
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
      str = str.split('c.p+').join(`${path}+`)
      str = str.split('=c.p').join(`=${path}`)
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
