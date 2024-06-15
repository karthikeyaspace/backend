const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { initializeFirebase } = require("./libs/firebase.js");

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

const allowedOrigins = [
  "https://kv3.vercel.app",
  "https://shortifyy.vercel.app",
];


const corsOptions = (req, callback) => {
  let corsOptions;
  if (allowedOrigins.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false }; 
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptions));

app.use(express.json());

initializeFirebase();

const shorten = require("./routes/shorten/shorten.js");
const kv3 = require("./routes/kv3/kv3.js");
app.use("/shorten", shorten);
app.use("/kv3", kv3);

app.get("/", (req, res) => {
  res.send(
    'Hello World - <a href="http://kv3.vercel.app" target="_blank">see me</a>'
  );
});

app.use((err, req, res, next) => {
  res.send({
    error: err.message,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
