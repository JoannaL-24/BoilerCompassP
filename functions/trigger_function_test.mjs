import fetch from "node-fetch";

// trigger cloud function
fetch('https://queryfunction-jmcmkrvdxa-uc.a.run.app')
  .then(() => { console.log("Done") })
