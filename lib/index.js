const fs = require('fs')
const path = require('path')
const mime = require('mime')
const api = require('../api')
const request = require('request')
const getLastMessage = require('./modules/getlastmessage')
const isMember = require('./modules/ismember')

class Botact {
  constructor (options) {
    if (!options.confirmation || !options.group_id || !options.token) {
      throw 'Bot settings are incomplete.'
    }

    this.msg = []
    this.action = {}
    this.settings = options
    this.messages = { commands: [], hears: [] }
  }

  confirm (req, res) {
    if (req.body.type === 'confirmation') {
      return res.end(this.settings.confirmation)
    }

    return false
  }

  execute () {
    setInterval(() => {
      const method = this.msg.map(obj => `API.messages.send(${JSON.stringify(obj)})`)

      this.msg = []

      if (method.length !== 0) {
        api('execute', {
          code: `return [ ${method.join(',')} ];`,
          access_token: this.settings.token
        }).then(console.log).catch(console.log)
      }
    }, 350)
  }

  command (command, callback) {
    if (typeof command === 'object') {
      command.forEach(cmd => this.messages.commands[cmd.toLowerCase()] = callback)
    } else {
      this.messages.commands[command.toLowerCase()] = callback
    }
  }

  hears (command, callback) {
    if (typeof command === 'object') {
      command.forEach(cmd => this.messages.hears[cmd.toLowerCase()] = callback)
    } else {
      this.messages.hears[command.toLowerCase()] = callback
    }
  }

  on (callback) {
    this.messages.on = callback
  }

  event (event, callback) {
    this.action[event] = callback
  }

  reply (uid, message, attachments) {
    this.msg.push({
      user_id: uid,
      message: message,
      attachment: attachments
    })
  }

  handler (data) {
    let methods = {}

    Object.keys(this.messages.hears).forEach(method => methods[method] = this.messages.hears[method])

    if (this.messages.commands[data.body.toLowerCase()] !== undefined) {
      this.messages.commands[data.body.toLowerCase()](data)
    } else {
      if (!Object.keys(methods).length) {
        if (typeof this.messages.on === 'function') {
          return this.messages.on(data)
        }

        return console.log('Bot can\'t found reserved reply.')
      }

      Object.keys(methods).some((key, i) => {
        if (new RegExp(key, 'i').test(data.body.toLowerCase())) {
          return methods[key](data) || true
        }

        if (i === --Object.keys(methods).length) {
          return this.messages.on(data)
        }
      })
    }
  }

  uploadDocument (file, type) {
    return new Promise((resolve, reject) => {
      if (this.settings.admin === undefined) {
        reject('You must set admin\'s token for upload document. Add token in "admin" value with constructor.')
      }

      api('docs.getUploadServer', {
        access_token: this.settings.admin,
        type: type
      }).then(body => {
        if (body.response === undefined && body.response.upload_url === undefined) {
          reject(`Trying to get upload server, but got the error: ${body}`)
        }

        const data = {
          file: {
            value: fs.createReadStream(file),
            options: {
              filename: path.basename(file),
              contentType: mime.lookup(file)
            }
          }
        }

        request({
          url: body.response.upload_url,
          method: 'POST',
          formData: data,
          json: true
        }, (err, res, body) => {
          if (!err && res.statusCode === 200) {
            api('docs.save', {
              file: body.file,
              access_token: this.settings.admin
            }).then(body => {
              if (body.response !== undefined && body.response[0] !== undefined) {
                resolve(body.response[0])
              } else {
                reject(body)
              }
            }).catch(reject)
          } else {
            reject(err)
          }
        })
      }).catch(reject)
    })
  }

  uploadPhoto (file) {
    return new Promise((resolve, reject) => {
      if (this.settings.admin === undefined) {
        reject('You must set admin\'s token for upload document. Add token in "admin" value with constructor.')
      }

      api('photos.getWallUploadServer', {
        group_id: this.settings.group_id,
        access_token: this.settings.admin
      }).then(body => {
        if (body.response === undefined && body.response.upload_url === undefined) {
          reject(`Trying to get upload server, but got the error: ${body}`)
        }

        const data = {
          photo: {
            value: fs.createReadStream(file),
            options: {
              filename: path.basename(file),
              contentType: mime.lookup(file)
            }
          }
        }

        request({
          url: body.response.upload_url,
          method: 'POST',
          formData: data,
          json: true
        }, (err, res, body) => {
          if (!err && res.statusCode === 200 && body.photo !== '[]') {
            body.group_id = this.settings.group_id
            body.access_token = this.settings.admin

            api('photos.saveWallPhoto', body).then(body => {
              if (body.response !== undefined && body.response[0] !== undefined) {
                resolve(body.response[0])
              } else {
                reject(body)
              }
            }).catch(reject)
          } else {
            reject(err)
          }
        })
      }).catch(reject)
    })
  }

  listen (req, res) {
    res.end('ok')

    const data = req.body.object
    data.body = getLastMessage(data).body

    if (req.body.type === 'message_new') {
      if (this.settings.sub !== undefined) {
        isMember(this.settings.group_id, data.user_id)
          .then(() => this.handler(data))
          .catch(() => this.reply(data.user_id, this.settings.sub))
      } else {
        this.handler(data)
      }
    }

    if (typeof this.action[req.body.type] === 'function') {
      this.action[req.body.type](data)
    }
  }
}

module.exports = Botact
