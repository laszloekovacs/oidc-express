# OpenID Connect with Express and GitHub

simple app to test login and get the users profile via [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)

to get started, set the

```
CLIENT_ID
CLIENT_SECRET
SECRET
```

environment variables. You need to create a GitHub OAuth app and get the CLIENT_ID and CLIENT_SECRET environment variables.
the SECRET environment variable is used to sign the JWT token, to generate a secret you can use `openssl rand -base64 32`

## Usage

```bash
npm install
npm run start
```
