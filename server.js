require('dotenv').config()
const express = require('express')
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
    scope: 'openid user email',
    response_type: 'code',
  })

  res.redirect(process.env.ENDPOINT + '/authorize' + '?' + qs.toString())
})

app.get('/callback', async (req, res) => {
  console.log('req.query', req.query)

  // build the query string for exchange for the access token
  const qs = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/callback',
  })

  // get the access token
  const accessTokenResponse = await fetch(
    process.env.ENDPOINT + '/oauth/token' + '?' + qs.toString(),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  if (!accessTokenResponse.ok) {
    console.log(accessTokenResponse.status)
  }

  const accesstoken = await accessTokenResponse.json()

  console.log(accesstoken)

  // using access token, get the user profile
  const profileRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accesstoken.access_token}`,
    },
  })

  const profile = await profileRes.json()

  // build custom jwt token for out app
  const token = jwt.sign(
    {
      login: profile.login,
    },
    process.env.SECRET
  )

  // decode token
  const decoded = jwt.decode(token, { json: true })
  //console.log(decoded)

  // verify token
  const verified = jwt.verify(token, process.env.SECRET)

  // set cookie
  res.cookie('token', token)

  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening: http://localhost:${port}`)
})
