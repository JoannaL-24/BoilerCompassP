const o = require('odata').o;

const oHandler = o('https://api.purdue.io/odata/$metadata', {});

async function queryTerms() {
    try {
        const result = await oHandler.get('Terms').query();
        console.log(result);
    } catch (error) {
        console.error('Error querying OData service:', error.message);
    }
}

queryTerms();
