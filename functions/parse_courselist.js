// the firebase admin sdk to access firestore.
const { initializeapp, applicationdefault } = require("firebase-admin/app");
const { getfirestore } = require("firebase-admin/firestore");

// odata stuff
const o = require("odata").o;

const app = initializeapp({
  credential: applicationdefault(),
  projectid: "boilercompass-3135d",
})

async function queryodataandstoreinfirebase() {
  const db = getfirestore(app);

  try {
    const courses = await db.collection('courses').get();
    const subjectsref = db.collection('subjects');

    const promisecourseslist = [];
    for (const doc of courses.docs) {
      const course = doc.data();
      promisecourseslist.push(new promise((resolve, reject) => {
        subjectsref.doc(course.subjectid).get().then((doc) => {
          if (!doc.exists) {
            console.log('no such document!');
            reject();
          }

          const subject = doc.data();
          let name = "";
          name += subject.abbreviation + " ";
          name += course.number;
          const item = { name: name, id: course.id };
          resolve(item);
        })
      }))
    };

    const courseslist = await promise.all(promisecourseslist);
    const totalcourses = courseslist.length;

    console.log("courses list parsed");

    const courselistref = db.collection("courselist");

    const genkeywords = (name) => {
      const arr = [];
      for (let i = 1; i <= name.length; i++) {
        arr.push(name.slice(0, i));
      }
      return arr;
    }

    let count = 0;
    const batchsize = 2000;
    while (courseslist.length > 0) {
      const batch = db.batch();

      const databatch = courseslist.splice(0, batchsize);
      for (const course of databatch) {
        const docref = courselistref.doc(course.id);

        const [subj, num] = course.name.split(" ");
        const keywords = genkeywords(course.name).concat(genkeywords(subj)).concat(genkeywords(num));
        const obj = { name: course.name, keywords: keywords };

        batch.set(docref, obj);
      }
      await batch.commit();

      count += databatch.length;

      console.log(`${count}/${totalcourses} courses stored in firestore.`);
    }

  } catch (error) {
    console.error("error:", error);
  }
}

queryodataandstoreinfirebase()

