import express, { Response } from "express";
import cors from "cors";
import env from "./config/env";

const app = express();

app.use(cors());

app.use(express.json());

const shortenSupabase = require("./routes/shorten/shortenSupabase.js");
const kv3 = require("./routes/kv3/kv3.js");
app.use("/shorten", shortenSupabase);
app.use("/kv3", kv3);

app.get("/", (_, res: Response) => {
  res.send(
    'Hello World - <a href="http://itskv.me" target="_blank">Visit my website</a>'
  );
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
