// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// odata stuff
const o = require('odata').o;

initializeApp();

async function queryODataAndStoreInFirebase() {
    console.log('Querying OData service and storing data in Firestore...');

    const oHandler = o('https://api.purdue.io/odata/$metadata', {});
    // const db = getFirestore();

    try {
        const result = await oHandler.get('Terms').query();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { queryODataAndStoreInFirebase };

// Scheduled Firebase Cloud Function
// exports.scheduledFunction = onSchedule('every 24 hours', async (event) => {
//     await queryODataAndStoreInFirebase();
//     console.log('Scheduled function executed successfully.');
// });
