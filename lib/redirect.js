const fs = require('fs-extra')
const path = require('path')

class Redirect {
  constructor(options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw new Error(`配置信息应为 Object`)
    }

    this.config = Object.assign(
      {
        region: 'oss-cn-hangzhou',
        bucket: 'guangdianyun-static',
        prefix: ''
      },
      options
    )

    this.path = `"https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${this.config.prefix}`

    if (['bucket', 'region', 'prefix'].some(key => !options[key])) {
      throw new Error(`请填写正确的 Region、Bucket 和 Prefix`)
    }
  }

  redirectIndexPath(outputPath) {
    process.chdir(outputPath)
    console.log(`${outputPath}/index.html`)
    fs.readFile(`${outputPath}/index.html`, (err, data) => {
      if (err) {
        console.log(err)
        return err
      }
      let str = data.toString()
      str = str.split(`"/${this.config.prefix}`).join(this.path)
      fs.writeFile(`${outputPath}/index.html`, str, err => {
        if (err) {
          console.log(err)
          return err
        }
        console.log('Index Redirect Complete')
      })
    })
  }

  redirectAppPath(outputPath, assetsInfo) {
    process.chdir(outputPath)
    let appPath = ''
    assetsInfo.forEach((value, key) => {
      if (key.toString().includes('app') && key.toString().includes('js'))
      appPath = key.toString()
    })
    console.log(`${outputPath}/${appPath}`)
    fs.readFile(`${outputPath}/${appPath}`, (err, data) => {
      if (err) {
        console.log(err)
        return err
      }
      let str = data.toString()
      str = str.split(`"/${this.config.prefix}`).join(this.path)
      fs.writeFile(`${outputPath}/${appPath}`, str, err => {
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
