module.exports = function (req, res, next) {
    console.log('Authenticating...')
    next()
  }