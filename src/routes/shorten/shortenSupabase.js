const express = require("express");
const shorten = express.Router();
const asyncHandler = require("express-async-handler");
const supabase = require("../../libs/supabase.js");
const { errorHandler } = require("../../helpers/helper.js");
const randomString = require("./utils/randomString.js");

shorten.post(
  "/",
  asyncHandler(async (req, res) => {
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

      const upload = await supabase
        .from(process.env.SUPABASE_TABLE_NAME)
        .insert([data]);

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

shorten.get(
  "/:alias",
  asyncHandler(async (req, res) => {
    const { alias } = req.params;
    try {
      const supares = await supabase
        .from(process.env.SUPABASE_TABLE_NAME)
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

module.exports = shorten;
