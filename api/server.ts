import express, { Response } from "express";
import cors, { CorsOptions } from "cors";
import env from "./config/env";
import { kv } from "./routes/kv.route";
import { shortifyy } from "./routes/shortifyy.route";
import { npx } from "./routes/npx.route";

const app = express();

const whitelist = [
  "http://localhost:5173",
  "https://www.itskv.me",
  "https://itskv.me",
  "https://shortifyy.vercel.app",
];

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
app.use("/shortifyy", shortifyy);
app.use("/npx", npx)


app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
