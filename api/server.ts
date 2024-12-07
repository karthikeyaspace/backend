import express, { Response } from "express";
import cors, { CorsOptions } from "cors";
import env from "./config/env";
import { kv } from "./routes/kv.route";
// import { shortifyy } from "./routes/shortifyy.route";

const app = express();

const whitelist = ["http://localhost:5173", "https://itskv.me"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) callback(null, true);
    else callback(new Error("Cors error"));
  },
  methods: ["POST", "GET"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/kv", kv);
// app.use("/shortifyy", shortifyy);

app.get("/", (_, res: Response) => {
  res.send(
    'Hello World - <a href="https://itskv.me" target="_blank">Visit my website</a>'
  );
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
