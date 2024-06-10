const express = require('express');
const shorten = express.Router();
const randomString = require('./utils/randomString.js')
const asyncHandler = require('express-async-handler')
const { uploadData, getUrlFromLongUrl, getUrlFromAlias } = require('../../libs/firebase.js')
const { errorHandler } = require('../../helpers/helper.js')


shorten.post('/', asyncHandler(async (req, res) => {
    // const urls = req.app.get('urls')
    let { longUrl } = req.body;

    const urlParts = longUrl.split('.');
    if (urlParts.length < 2) {
        return res.json({ message: "invalid url" })
    }

    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
        longUrl = "https://" + longUrl;
    }

    const alias = randomString(5);

    const data = {
        longUrl: longUrl,
        alias: alias,
        shortUrl: process.env.LONG_URL + alias,
        createdAt: new Date()
    }

    try {
        //check for existing long url
        //mongo db
        // const longUrlFromDb = await urls.findOne({ longUrl: longUrl })
        // if (longUrlFromDb) {
        //     return res.json({ message: "url already exists", payload: { shortUrl: longUrlFromDb.shortUrl } })
        // }

        // //create short url
        // const alias = randomString(5).shortUrl
        // await urls.insertOne({ longUrl: longUrl, alias: alias, shortUrl: process.env.LONG_URL + alias, createdAt: new Date() })
        // return res.json({ message: "short url created", payload: { shortUrl: process.env.LONG_URL + alias } })


        //firebase
        const longUrlFromDb = await getUrlFromLongUrl(process.env.FIREBASE_COLLECTION_NAME, data.longUrl)
        if (longUrlFromDb.length > 0) {
            return res.send({ message: "url already exists", payload: { shortUrl: longUrlFromDb[0].shortUrl } })
        }
        else {
            await uploadData(process.env.FIREBASE_COLLECTION_NAME, data)
            return res.send({ message: "short url created", payload: { shortUrl: data.shortUrl } })
        }
        console.log("fire data", data)
    }
    catch (err) {
        errorHandler(err, 'shorten-post')
    }

}))


shorten.get('/:alias', asyncHandler(async (req, res) => {
    // const urls = req.app.get('urls');
    const { alias } = req.params;

    try {
        // mongodb
        // const longUrlFromDb = await urls.findOne({ alias: alias });
        // if (longUrlFromDb) {
        //     res.send({ message: "redirecting", payload: { longUrl: longUrlFromDb.longUrl } });
        // }
        // else {
        //     res.send({ message: "url not found" });
        // }

        //firebase
        const document = await getUrlFromAlias(process.env.FIREBASE_COLLECTION_NAME, alias);
        console.log(document)
        if (document) {
            console.log("redirect document",document)
            res.send({ message: "redirecting", payload: { longUrl: document.longUrl } });
        }
        else {
            res.send({ message: "url not found" });
        }

    }
    catch (err) {
        errorHandler(err, 'shorten-get')
    }

}));

module.exports = shorten;