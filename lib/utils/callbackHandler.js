module.exports = (body, executionItems) => {
  const { response, execute_errors } = body

  executionItems.forEach((item, i) => {
    response && response[i] !== undefined
      ? item.resolve(response[i])
      : item.reject(
        execute_errors && execute_errors[i]
          ? { error: execute_errors[i] }
          : { error: null }
      )

    if (item.callback) {
      item.callback(
        response && response[i] !== undefined
          ? { response: response[i] }
          : { error: execute_errors && execute_errors[i] ? execute_errors[i] : null }
      )
    }
  })
}
