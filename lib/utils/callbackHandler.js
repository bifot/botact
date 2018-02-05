module.exports = (body, callbacks) => {
  const { response, execute_errors } = body

  callbacks.forEach((callback, i) => {
    if (callback) {
      callback(
        response && typeof(response[i]) !== undefined
          ? { response: response[i] }
          : { error: execute_errors[i] }
      )
    }
  })
}
