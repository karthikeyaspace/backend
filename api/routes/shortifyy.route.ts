import express from "express";
import expressAsyncHandler from "express-async-handler";

import supabase from "../config/db";
import { errorHandler } from "../utils/logger";
import { randomString } from "../utils/random";
import env from "../config/env";

const shortifyy = express.Router();

const table = env.SUPABASE_TABLE_NAME as string;

shortifyy.post(
  "/",
  expressAsyncHandler(async (req, res): Promise<any> => {
    const { data } = req.body;
    let { long, alias } = data;

    if (!long) return res.json({ message: "long url not provided" });
    if (alias && (alias.length < 2 || alias.length > 10))
      return res.send({
        success: false,
        message: "alias length should be between 3 and 10",
      });

    if (!alias || alias === " ") alias = randomString(5);

    const formData = {
      long: long,
      alias: alias,
      short: env.SHORTIFYY_URL + alias,
      createdAt: new Date(),
    };

    try {
      if (!supabase) throw new Error("supabase not connected");

      const supares = await supabase
        .from(table)
        .select("*")
        .eq("long", formData.long)
        .single();

      if (supares.data)
        return res.send({
          success: true,
          message: "short url already exists",
          short: supares.data.short,
        });

      const upload = await supabase.from(table).insert([formData]);

      if (upload.error) throw new Error(upload.error.message);

      return res.send({
        success: true,
        message: "Short url created",
        short: env.SHORTIFYY_URL + alias,
      });
    } catch (err) {
      errorHandler(err, "shorten-post");
      return res.send({
        success: false,
        message: "Internal server error",
      });
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

      if (supares.data)
        return res.send({
          success: true,
          message: "short url found",
          long: supares.data.long,
        });
      else {
        return res.send({
          success: false,
          message: "short url not found",
        });
      }
    } catch (err) {
      errorHandler(err, "shorten-get");
      return res.send({
        success: false,
        message: "Internal server error",
      });
    }
  })
);

export { shortifyy };
