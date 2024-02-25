// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// odata stuff
const o = require("odata").o;

const app = initializeApp({
  credential: applicationDefault(),
  projectId: "boilercompass-3135d",
})

async function queryODataAndStoreInFirebase() {
  logger.info("Querying OData service and storing data in Firestore...");

  const oHandler = o("https://api.purdue.io/odata/$metadata", {});
  const firestore = getFirestore(app);

  try {
    const entityTypes = [
      // "Terms",
      // "Subjects",
      // "Courses",
      // "Classes",
      "Sections",
      // "Meetings",
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

queryODataAndStoreInFirebase()

