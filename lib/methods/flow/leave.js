module.exports = async ({ redis, user_id }) => {
  try {
    return await redis.del(`flow:${user_id}`)
  } catch (err) {
    return console.error(err)
  }
}
