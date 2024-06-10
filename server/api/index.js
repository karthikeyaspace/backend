const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { initializeFirebase } = require('./libs/firebase.js')


// const mongoClient = require('mongodb').MongoClient;
// mongoClient.connect(process.env.MONGODB_URI)
//     .then(client => {
//         const db = client.db('shortenDB');
//         const urls = db.collection('urls');
//         app.set('urls', urls);
//         console.log('Connected to Atlas');
//     })
//     .catch(err => {
//         console.error('Failed to connect to MongoDB Atlas', err);
//     });

// mongo db randomly disconnects out of no where, so using firebase/firestore instead
// not issue of mongo db, issue of vercel



app.use(cors())

app.use(express.json())
initializeFirebase()

const shorten = require('../routes/shorten/shorten.js')
app.use('/shorten', shorten)

app.use((err, req, res, next) => {
    res.send({
        error: err.message
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})
