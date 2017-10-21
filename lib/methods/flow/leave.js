const redis = require('redis')
const client = redis.createClient()

module.exports = async ({ user_id }) => {
  try {
    return await client.del(`flow:${user_id}`)
  } catch (err) {
    return console.error(err)
  }
}
