module.exports = (body, executionItems) => {
  const { response, execute_errors } = body

  executionItems.forEach((item, i) => {
    if (response && response[i] !== undefined) {
      item.resolve(response[i])
    } else {
      item.reject({
        error: execute_errors && execute_errors[i] ? execute_errors[i] : null,
      })
    }

    if (item.callback) {
      item.callback(response && response[i] !== undefined
        ? { response: response[i] }
        : { error: execute_errors && execute_errors[i] ? execute_errors[i] : null })
    }
  })
}
