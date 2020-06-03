require('dotenv').config()
const express = require('express'),
  massive = require('massive'),
  cors = require('cors'),
  session = require('express-session'),
  middle = require('./middleware/middleware'),
  authCtrl = require('./controllers/authController'),
  app = express(),
  { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(cors())
app.use(express.json())

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
  })
)

app.post('/auth/register', middle.checkUsername, authCtrl.register)
app.post('/auth/login', middle.checkUsername, authCtrl.login)
app.delete('/auth/logout', authCtrl.logout)
app.get('/auth/user', authCtrl.getUser)

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
}).then(db => {
  app.set('db', db)
  console.log('DB locked and loaded')
  app.listen(SERVER_PORT, () => console.log(`Server standing by on port ${SERVER_PORT}`))
})
