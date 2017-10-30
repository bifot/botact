module.exports = async ({ user_id }) => {
  try {
    return await this.redis.del(`flow:${user_id}`)
  } catch (err) {
    return console.error(err)
  }
}
