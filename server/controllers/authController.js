const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const { username, password } = req.body,
      db = req.app.get('db'),
      user = await db.check_user(username)

    if (user[0]) return res.status(400).send('Email already exists')

    const salt = bcrypt.genSaltSync(10),
      hash = bcrypt.hashSync(password, salt),
      newUser = await db.register_user(username, hash)

    req.session.user = newUser[0]
    delete req.session.user.password

    res.status(200).send(req.session.user)
  },
  login: async (req, res) => {
    const { username, password } = req.body,
      db = req.app.get('db'),
      user = await db.check_user(username)

    if (!user[0]) {
      return res.status(400).send(`User doesn't exist`)
    }

    const authenticated = bcrypt.compareSync(password, user[0].password)

    if (!authenticated) return res.status(401).send('Invalid Password')

    delete user[0].password

    req.session.user = user[0]
    res.status(200).send(req.session.user)
  },
  logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  },
  getUser: (req, res) => {
    if (req.session.user) {
      res.status(200).send(req.session.user)
    } else {
      res.status(204).send('No one logged in')
    }
  }
}
