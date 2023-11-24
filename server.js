import express from "express";
import { auth } from "express-openid-connect";

const app = express();
const port = 3000;

app.use(
  auth({
    /*
    clientID:
    clientSecret:
    issuerBaseURL: 
    baseURL:
    secret:
  */
  })
);

app.get("/", (req, res) => {
  res.send("Hello" + JSON.stringify(req.oidc));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
