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
  console.log("Querying OData service and storing data in Firestore...");

  const oHandler = o("https://api.purdue.io/odata/$metadata", {});
  const firestore = getFirestore(app);

  try {
    const entityTypes = [
      // "Terms",
      // "Subjects",
      "Courses",
      // "Classes",
      // "Sections",
      // "Meetings",
      // "Instructors",
      // "Campuses",
      // "Buildings",
      // "Rooms"
    ];

    for (const entityType of entityTypes) {
      console.log(`Querying ${entityType}...`);

      const totalCount = await oHandler.get(entityType + "/$count").query();
      const entities = await oHandler.get(entityType).query();
      // const lowerCaseEntityType = entityType.toLowerCase();

      console.log(`Queried ${entityType} of count ${totalCount}`);

      // find duplicates in subject + name
      var valueArr = entities.map(function(item) { return item.SubjectId + " " + item.Number });
      var duplicateArr = entities.filter(function(item, index) {
        return valueArr.indexOf(item.SubjectId + " " + item.Number) != index
      });
      // filter Number == 49000
      duplicateArr = duplicateArr.filter(function(item) {
        return item.Number == 49000
      });
      duplicateArr = duplicateArr.filter(function(item) {
        return item.SubjectId == "25183622-2773-4f40-a3cd-c9c909fc6cad"
      });

      console.log(duplicateArr);

      // var count = 0;
      // const batchSize = 10000;
      // while (entities.length > 0) {
      //   const batch = firestore.batch();

      //   const dataBatch = entities.splice(0, batchSize);
      //   dataBatch.forEach(entity => {
      //     const docId = entity.Id; // Use the object's ID as the document ID
      //     const docRef = firestore.collection(lowerCaseEntityType).doc(docId);
      //     batch.set(docRef, entity);
      //   });
      //   await batch.commit();

      //   count += dataBatch.length;

      //   console.log(`${count}/${totalCount} ${entityType} stored in Firestore.`);
      // }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

queryODataAndStoreInFirebase()

