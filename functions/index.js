// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// odata stuff
const o = require("odata").o;

initializeApp();

async function queryODataAndStoreInFirebase() {
  logger.info("Querying OData service and storing data in Firestore...");

  const oHandler = o("https://api.purdue.io/odata/$metadata", {});
  const db = getFirestore();

  try {
    const result = await oHandler.get("Terms").query();
    logger.info("Result:", result);
  } catch (error) {
    logger.error("Error:", error);
  }
}


// Scheduled Firebase Cloud Function
exports.scheduledFunction = onSchedule({ schedule: "every 1 minutes from 21:28 to 21:35", timeZone: "America/New_York" }, async (event) => {
  await queryODataAndStoreInFirebase();
  console.log("Scheduled function executed successfully.");
});

