module.exports = {
  checkUsername: (req, res, next) => {
    const { username } = req.body
    if (username.includes('@') && username.includes('.')) {
      next()
    } else {
      res.status(403).send('Must enter valid email')
    }
  }
}
