import express from "express";

import supabase from "../config/db";
import { errorHandler } from "../utils/logger";
import { randomString } from "../utils/random";
import env from "../config/env";
import expressAsyncHandler from "express-async-handler";

const shortifyy = express.Router();
const table = env.SUPABASE_TABLE_NAME as string;

shortifyy.post(
  "/",
  expressAsyncHandler(async (req, res): Promise<any> => {
    let { longUrl } = req.body;
    const urlParts = longUrl.split(".");
    if (urlParts.length < 2) return res.json({ message: "invalid url" });
    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://"))
      longUrl = "https://" + longUrl;

    const alias = randomString(5);
    const data = {
      longUrl: longUrl,
      alias: alias,
      shortUrl: process.env.LONG_URL + alias,
      createdAt: new Date(),
    };
    try {
      if (!supabase) throw new Error("supabase not connected");

      const supares = await supabase
        .from("shortifyyUrls")
        .select("*")
        .eq("longUrl", longUrl)
        .single();

      console.log(supares, "supares");
      if (supares.data)
        return res.send({
          message: "url already exists",
          payload: { shortUrl: supares.data.shortUrl },
        });

      const upload = await supabase.from(table).insert([data]);

      console.log(upload, "upload res");
      if (upload.error) throw new Error(upload.error.message);

      return res.send({
        message: "short url created",
        payload: { shortUrl: data.shortUrl },
      });
    } catch (err) {
      errorHandler(err, "shorten-post");
    }
  })
);

shortifyy.get(
  "/:alias",
  expressAsyncHandler(async (req, res): Promise<any> => {
    const { alias } = req.params;
    try {
      const supares = await supabase
        .from(table)
        .select("*")
        .eq("alias", alias)
        .single();
      console.log(supares, "supares, aliais");
      if (supares.data)
        return res.send({
          message: "redirecting",
          payload: { longUrl: supares.data.longUrl },
        });
      else return res.json({ message: "url not found" });
    } catch (err) {
      errorHandler(err, "shorten-get");
    }
  })
);

export { shortifyy };
