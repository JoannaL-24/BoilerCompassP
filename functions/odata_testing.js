// the firebase admin sdk to access firestore.
const { initializeapp, applicationdefault } = require("firebase-admin/app");
const { getfirestore } = require("firebase-admin/firestore");

// odata stuff
const o = require("odata").o;

async function queryodataandstoreinfirebase() {
  const oHandler = o("https://api.purdue.io/odata/$metadata", {});

  try {
    const entities = await oHandler.get("Courses").query({
      $expand: `Classes($filter=Campus/Code eq 'PWL'), Subject`,
      $filter: `Subject/Abbreviation eq 'CS' and Number eq '18000'`
    });
    console.log(entities);
  } catch (error) {
    console.error("Error:", error);
  }
}

queryodataandstoreinfirebase()

