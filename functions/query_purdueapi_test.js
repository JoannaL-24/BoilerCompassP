const o = require("odata").o;

async function queryODataAndStoreInFirebase() {
  console.log('Querying OData service and storing data in Firestore...');

  const oHandler = o("https://api.purdue.io/odata/$metadata", {});

  try {
    const result = await oHandler.get("Terms").query();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

queryODataAndStoreInFirebase();
