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
      // "Sections",
      "Meetings",
      // "Instructors",
      // "Campuses",
      // "Buildings",
      // "Rooms"
    ];

    for (const entityType of entityTypes) {
      logger.info(`Querying ${entityType}...`);

      const totalCount = await oHandler.get(entityType + "/$count").query();
      const entities = await oHandler.get(entityType).query();
      const lowerCaseEntityType = entityType.toLowerCase();

      logger.info(`Queried ${entityType} of count ${totalCount}`);

      var count = 0;
      const batchSize = 10000;
      while (entities.length > 0) {
        const batch = firestore.batch();

        const dataBatch = entities.splice(0, batchSize);
        dataBatch.forEach(entity => {
          const docId = entity.Id; // Use the object's ID as the document ID
          const docRef = firestore.collection(lowerCaseEntityType).doc(docId);
          batch.set(docRef, entity);
        });
        await batch.commit();

        count += dataBatch.length;

        logger.info(`${count}/${totalCount} ${entityType} stored in Firestore.`);
      }
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
