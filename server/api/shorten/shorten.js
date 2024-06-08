const express = require('express');
const shorten = express.Router();
const randomString = require('./randomString.js')
const asyncHandler = require('express-async-handler')


shorten.post('/', asyncHandler(async (req, res) => {
    const urls = req.app.get('urls')
    let longUrl = req.body.longUrl

    console.log("Long Url: ", longUrl)

    const urlParts = longUrl.split('.');
    if (urlParts.length < 2) {
        return res.json({ message: "invalid url" })
    }

    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
        longUrl = "https://" + longUrl;
    }

    try {
        //check for existing long url
        const longUrlFromDb = await urls.findOne({ longUrl: longUrl })
        if (longUrlFromDb) {
            return res.json({ message: "url already exists", payload: { shortUrl: longUrlFromDb.shortUrl } })
        }

        //create short url
        const alias = randomString().shortUrl
        await urls.insertOne({ longUrl: longUrl, alias: alias, shortUrl: process.env.LongUrl + alias, createdAt: new Date() })
        return res.json({ message: "short url created", payload: { shortUrl: process.env.LongUrl + alias } })

    }
    catch (err) {
        return res.json({ message: "error", error: err })
    }

}))


shorten.get('/:alias', asyncHandler(async (req, res) => {
    const urls = req.app.get('urls');
    const alias = req.params.alias;

    try {
        const longUrlFromDb = await urls.findOne({ alias: alias });
        if (longUrlFromDb) {
            res.send({ message: "redirecting", payload: { longUrl: longUrlFromDb.longUrl } });
        }
        else {
            res.send({ message: "url not found" });
        }
    }
    catch (err) {
        return res.json({ message: "error", error: err });
    }

}));

module.exports = shorten;