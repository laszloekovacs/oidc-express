require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.use(cookieParser())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/login', (req, res) => {
  const qs = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'openid profile email',
  })

  res.redirect('https://github.com/login/oauth/authorize' + '?' + qs.toString())
})

app.get('/callback', async (req, res) => {
  console.log(req.query)

  const qs = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  })

  const response = await fetch(
    'https://github.com/login/oauth/access_token' + '?' + qs.toString(),
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  // get the access token
  const data = await response.json()

  // set the cookie with the access token
  res.cookie('Bearer', data.access_token, {
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
  })

  res.redirect('/')
})

app.get('/profile', async (req, res) => {
  if (!req.cookies.Bearer) {
    res.redirect('/login')
    return
  }

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${req.cookies.Bearer}`,
    },
  })

  const data = await response.json()

  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening: http://localhost:${port}`)
})
