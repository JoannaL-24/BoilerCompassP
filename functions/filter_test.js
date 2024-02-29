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

  const oHandler = o("https://api.purdue.io/odata/$metadata", {});
  const db = getFirestore(app);

  try {
    console.log("Querying OData service and storing data in Firestore...");
    const coursesRef = db.collection('courses');
    const classesRef = db.collection('classes');

    const users = await db.collection('users').get();
    // const snapshot = await coursesRef.where('Number', '==', '59700').get();
    if (users.empty) {
      console.log('No matching documents.');
    } else {
      users.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    }

    // const testCourseData = await coursesRef.doc('12315a8e-ca07-490c-a0a3-0e6114fc0fc2').get();
    // console.log(testCourseData);
    // console.log(testCourseData.data());

    // // get all classes assigned to a course
    // const classesSnapshot = await classesRef.where('CourseId', '==', testCourseData.id).get();
    // if (classesSnapshot.empty) {
    //   console.log('No matching documents.');
    // } else {
    //   classesSnapshot.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    //   });
    // }

  } catch (error) {
    console.error("Error:", error);
  }
}

queryODataAndStoreInFirebase()

