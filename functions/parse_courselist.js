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
  const db = getFirestore(app);

  try {
    const courses = await db.collection('courses').get();
    const subjectsRef = db.collection('subjects');

    const promiseCoursesList = [];
    for (const doc of courses.docs) {
      const course = doc.data();
      promiseCoursesList.push(new Promise((resolve, reject) => {
        subjectsRef.doc(course.SubjectId).get().then((doc) => {
          if (!doc.exists) {
            console.log('No such document!');
            reject();
          }

          const subject = doc.data();
          let name = "";
          name += subject.Abbreviation + " ";
          name += course.Number;
          const item = { Name: name, Id: course.Id };
          resolve(item);
        })
      }))
    };

    const coursesList = await Promise.all(promiseCoursesList);

    console.log("Courses List parsed");

    const courseListRef = db.collection("courseList");

    let count = 0;
    const batchSize = 1000;
    while (coursesList.length > 0) {
      const batch = db.batch();

      const dataBatch = coursesList.splice(0, batchSize);
      for (const course in dataBatch) {
        const docRef = courseListRef.doc(course.Id);
        batch.set(docRef, { Name: course.Name });
      }
      await batch.commit();

      count += dataBatch.length;

      console.log(`${count}/${coursesList.length} courses stored in Firestore.`);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

queryODataAndStoreInFirebase()

