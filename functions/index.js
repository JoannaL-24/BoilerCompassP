// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// odata stuff
const o = require("odata").o;

initializeApp();

async function queryODataAndStoreInFirebase() {
  logger.info("Querying OData service and storing data in Firestore...");

  const oHandler = o("https://api.purdue.io/odata/$metadata", {});
  const firestore = getFirestore();

  try {
    const entityTypes = [
      // "Terms",
      // "Subjects",
      // "Courses",
      // "Classes",
      "Sections",
      "Meetings",
      // "Instructors",
      // "Campuses",
      // "Buildings",
      // "Rooms"
    ];

    for (const entityType of entityTypes) {
      logger.info(`Querying ${entityType}...`);

      const entities = await oHandler.get(entityType).query();
      const lowerCaseEntityType = entityType.toLowerCase();

      await entities.forEach(async entity => {
        const docId = entity.Id; // Use the object's ID as the document ID
        const docRef = firestore.collection(lowerCaseEntityType).doc(docId);
        await docRef.set(entity);
      });

      logger.info(`Data for ${entityType} stored in Firestore successfully.`);
    }
  } catch (error) {
    logger.error("Error:", error);
  }
}

// Scheduled Firebase Cloud Function
// exports.scheduledFunction = onSchedule({ schedule: "every 1 minutes from 18:10", timeZone: "America/New_York" }, async (event) => {
//   await queryODataAndStoreInFirebase();
//   console.log("Scheduled function executed successfully.");
// });

exports.queryFunction = onRequest(async (req, res) => {
  await queryODataAndStoreInFirebase();
  console.log("Scheduled function executed successfully.");
});

// Function URL (queryFunction(us-central1)): https://queryfunction-jmcmkrvdxa-uc.a.run.app
