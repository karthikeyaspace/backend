const express = require('express')
const kvApp = express.Router()
const randomString = require('../shorten/utils/randomString.js')
const asyncHandler = require('express-async-handler')
const { uploadData, getUrlFromLongUrl, getUrlFromAlias } = require('../../libs/firebase.js')
const { errorHandler } = require('../../helpers/helper.js')

kvApp.post('/mailme', asyncHandler(async (req,res)=>{
    let { name, email, message } = req.body;
    const id = randomString(4);

    const mail = {
        name: name,
        email: email,   
        message: message,
        id: id,
        createdAt: new Date()
    }

    try{
        console.log(process.env.FIREBASE_MAILME_COLL_NAME)
        await uploadData(process.env.FIREBASE_MAILME_COLL_NAME, mail)
        return res.send({ message: "Mail recieved"})
    }
    catch(err){
        errorHandler(err, 'kvApp-post')
    }
}))

module.exports = kvApp