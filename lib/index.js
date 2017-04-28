const express = require('express')
const bodyParser = require('body-parser')
const api = require('./modules/api')
const isMember = require('./modules/ismember')

const app = express()

app.use(bodyParser.json())

class Botact {
  constructor (options) {
    this.bot = {}

    Object.keys(options).forEach(url => {
      this.bot[url] = { options: { confirmation: options[url].confirmation, group_id: options[url].group_id, token: options[url].token } }
    })
  }

  command (url, command, callback) {
    console.log(`Set ${command} to ${url}`)
  }

  //   if (Array.isArray(options)) {
  //     this.type = 'many'
  //     this.count = 0
  //     this.action = { commands: [], hears: [], events: [] }
  //   } else {
  //     this.action = { commands: {}, hears: {}, events: {} }
  //   }
  //
  //   this.options = options
  // }
  //
  // info () {
  //   if (this.type === 'many') {
  //     return console.log(this.options[this.count], this.action.commands[this.count])
  //   }
  //
  //   return console.log(this.options)
  // }
  //
  // command (command, callback) {
  //   if (this.type === 'many') {
  //     if (!this.action.commands[this.count]) this.action.commands[this.count] = {}
  //
  //     return this.action.commands[this.count][command.toLowerCase()] = callback
  //   }
  //
  //   return this.action.commands[command.toLowerCase()] = callback
  // }
  //
  // hears (command, callback) {
  //   if (this.type === 'many') {
  //     if (!this.action.hears[this.count]) this.action.hears[this.count] = {}
  //
  //     return this.action.hears[this.count][command.toLowerCase()] = callback
  //   }
  //
  //   return this.action.hears[command.toLowerCase()] = callback
  // }
  //
  // event (event, callback) {
  //   if (this.type === 'many') {
  //     if (!this.action.events[this.count]) this.action.events[this.count] = {}
  //
  //     return this.action.events[this.count][event.toLowerCase()] = callback
  //   }
  //
  //   return this.action.events[event.toLowerCase()] = callback
  // }
  //
  // reserve (callback) {
  //   if (this.type === 'many') {
  //     return this.action.reserve[this.count] = callback
  //   }
  //
  //   return this.action.reserve = callback
  // }
  //
  // start (address) {
  //   var url
  //
  //   if (/\/[aA-zZ0-9]{0,}\//g.test(address)) {
  //     url = address
  //   } else {
  //     url = `/${address}/`
  //
  //     if (!/\/[aA-zZ0-9]{0,}\//g.test(url)) {
  //       url = '/'
  //
  //       console.log('The address should not include cyrillic and special characters.\nListening will be available at \'/\'\n')
  //     }
  //   }
  //
  //   app.use('/', (req, res) => {
  //     console.log(req.url)
  //     // var data = req.body.object
  //     //
  //     // switch (req.body.type) {
  //     //   case 'confirmation':
  //     //     res.end(this.settings.confirmation)
  //     //     break
  //     //
  //     //   case 'message_new':
  //     //     var uid = data.user_id
  //     //     var msg = data.body
  //     //
  //     //     console.log(this.options[this.count].group_id, msg)
  //     //
  //     //     break
  //     // }
  //
  //     res.end('ok')
  //   })
  // }
  //
  // listen (port) {
  //   app.listen(port || 3000)
  // }
}

module.exports = Botact

// var app = express()
// var messages = []
// var settings = {}
// var action = { commands: {}, hears: {}, events: {} }
//
// setInterval(() => {
//   var code = []
//
//   messages.forEach(msg => {
//     code.push(`API.messages.send(${JSON.stringify(msg)})`)
//   })
//
//   if (code.length) {
//     api('execute', {
//       code: `return [ ${code.join(',')} ];`,
//       access_token: settings.token
//     }).then(console.log).catch(console.log)
//   }
//
//   messages = []
// }, 340)
//
// module.exports = {
//   auth: function (options) {
//     settings = options
//   },
//
//   command: function (command, callback) {
//     action.commands[command.toLowerCase()] = callback
//   },
//
//   hears: function (command, callback) {
//     action.hears[command.toLowerCase()] = callback
//   },
//
//   events: function (event, callback) {
//     action.events[event] = callback
//   },
//
//   reserve: function (callback) {
//     action.reserve = callback
//   },
//
//   getLastMessage: function (update) {
//     if (update.fwd_messages && update.fwd_messages.length) {
//       return this.getLastMessage(update.fwd_messages[0])
//     }
//
//     return update
//   },
//
//   sendMessage: function (uid, msg, attach) {
//     if (typeof uid === 'object') {
//       messages.push(uid)
//     } else {
//       messages.push({
//         user_id: uid,
//         message: msg,
//         attachment: attach
//       })
//     }
//   },
//
//   replyMessage: function (uid, msg) {
//     if (action.commands[msg.toLowerCase()]) {
//       return action.commands[msg.toLowerCase()]({ uid: uid, msg: msg })
//     } else {
//       if (Object.keys(action.hears).length) {
//         Object.keys(action.hears).forEach((cmd, i) => {
//           if (new RegExp(cmd, 'i').test(msg.toLowerCase())) {
//             action.hears[cmd]({ uid: uid, msg: msg })
//           } else if (i === Object.keys(action.hears).length - 1) {
//             action.reserve({ uid: uid, msg: msg })
//           }
//         })
//       } else {
//         return action.reserve({ uid: uid, msg: msg })
//       }
//     }
//   },
//
//   start: function (address) {
    // var url
    //
    // if (/\/[aA-zZ0-9]{0,}\//g.test(address)) {
    //   url = address
    // } else {
    //   url = `/${address}/`
    //
    //   if (!/\/[aA-zZ0-9]{0,}\//g.test(url)) {
    //     url = '/'
    //
    //     console.log('The address should not include cyrillic and special characters.\nListening will be available at \'/\'\n')
    //   }
    // }
//
//     app.use(bodyParser.json())
//
    // app.all(url, (req, res) => {
    //   var data = req.body.object
    //
    //   switch (req.body.type) {
    //     case 'confirmation':
    //       res.end(this.settings.confirmation)
    //       break
    //
    //     case 'message_new':
    //       var uid = data.user_id
    //       var msg = this.getLastMessage(data).body
    //
    //       if (settings.subscribers) {
    //         isMember(settings.group_id, uid).then(subscribe => {
    //           if (subscribe) {
    //             this.replyMessage(uid, msg)
    //           } else {
    //             this.sendMessage(uid, settings.subscribers.msg)
    //           }
    //         }).catch(console.log)
    //       } else {
    //         this.replyMessage(uid, msg)
    //       }
    //
    //       break
    //   }
    //
    //   res.end('ok')
    // })
//   },
//
//   listen: function() {
//     app.listen(3000)
//   }
// }
