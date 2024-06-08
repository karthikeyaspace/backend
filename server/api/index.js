const express = require('express')
const app = express()
const cors = require('cors')
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config()

mongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
        const db = client.db('shortenDB');
        const urls = db.collection('urls');
        app.set('urls', urls);
        console.log('Connected to Atlas');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB Atlas', err);
    });


app.use(cors({
    origin: 'https://shortifyy.vercel.app/',
    methods: ['GET', 'POST']
}))
app.use(express.json())

const shorten = require('./shorten/shorten.js')
app.use('/shorten', shorten)

app.use((err, req, res, next) => {
    res.send({
        error: err.message
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})
