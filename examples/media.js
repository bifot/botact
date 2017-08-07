const path = require('path')
const { Botact } = require('../index')

const bot = new Botact({
  confirmation: process.env.CONFIRMATION,
  group_id: process.env.ID,
  token: process.env.TOKEN,
  admin: process.env.ADMIN_TOKEN
})

bot.uploadDocument(path.join(__dirname, 'files', 'book.pdf'))
  .then((file) => {
    console.log(file)
    // {
    //   id: 445225557
    //   owner_id: 145003487,
    //   title: 'book.pdf',
    //   ...
    // }
  })

bot.uploadPhoto(path.join(__dirname, 'files', 'girl.png'))
  .then((file) => {
    console.log(file)
    // {
    //   id: 456246067,
    //   album_id: -14,
    //   owner_id: 145003487,
    //   ...
    // }
  })
