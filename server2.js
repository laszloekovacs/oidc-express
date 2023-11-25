const { auth } = require('express-openid-connect')
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000',
  clientID: 'rR5bil7LG9wzmy17jglXCZbi8r0C5rix',
  issuerBaseURL: 'https://dev-7qw6a6od3iv2j1hd.us.auth0.com',
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  console.log(req.oidc.user)

  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
})

app.listen(3000, () => {
  console.log(`Example app listening: http://localhost:${3000}`)
})
