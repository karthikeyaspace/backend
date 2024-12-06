import express, { Response } from "express";
import cors from "cors";
import env from "./config/env";
import { kv } from "./routes/kv.route";
import { shortifyy } from "./routes/shortifyy.route";
import expressAsyncHandler from "express-async-handler";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/kv", kv);
app.use("/shortifyy", shortifyy);

app.get("/", (_, res: Response) => {
  res.send(
    'Hello World - <a href="http://itskv.me" target="_blank">Visit my website</a>'
  );
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
