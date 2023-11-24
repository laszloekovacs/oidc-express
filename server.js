import express from "express";
import { auth } from "express-openid-connect";

const app = express();
const port = 3000;

app.use(auth({}));
