const { initializeApp } = require('firebase/app');
const { errorHandler } = require('../helpers/helper');
const { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where } = require('firebase/firestore');
require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


let app;
let firestoreDb;

const initializeFirebase = () => {
    try {
        app = initializeApp(firebaseConfig);
        firestoreDb = getFirestore();
        return app;
    }
    catch (err) {
        console.error(err);
    }
}

const uploadData = async (collectionName, data) => {
    try {
        const document = doc(firestoreDb, collectionName, data.alias); //firestore, collection, unique id
        let response = await setDoc(document, data);
    } catch (error) {
        errorHandler(error, 'firebase-uploadData');
    }
}


const getUrlFromLongUrl = async (collectionName, longUrl) => {
    try {
        //get all collections
        const collectionsRef = collection(firestoreDb, collectionName);
        const data =[]
        const q = query(
            collectionsRef,
            where("longUrl", "==", longUrl)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push(doc.data())
        });
        return data;
        
    } catch (error) {
        errorHandler(error, 'firebase-getDataLongUrl');
    }
}

const getUrlFromAlias = async (collectionName, alias) =>{
    try{
       
        const document = doc(firestoreDb, collectionName, alias);
        const docSnap = await getDoc(document);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    }
    catch(error){
        errorHandler(error, 'firebase-getDataAlias');
    }
}

const getFirebaseApp = () => app;



module.exports = {
    initializeFirebase,
    getFirebaseApp,
    firestoreDb,
    uploadData,
    getUrlFromLongUrl,
    getUrlFromAlias
}


