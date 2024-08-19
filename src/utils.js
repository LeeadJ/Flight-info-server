const axios = require('axios');
const BASE_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=300';

// returns flight data => [{},{},{}...]
const fetchFlightData = async () => {
    const response = await axios.get(BASE_URL);
    return response.data.result.records;
}

// returns true if a flight departs 10 or more min after the estimated time:
const isDelayed = (estimatedTime, realTime) => {
    const estDate = new Date(estimatedTime);
    const realDate = new Date(realTime);

    if(realDate > estDate){
        const diffInMs = realDate - estDate;
        const diffInMin = diffInMs / (1000 * 60);
        return diffInMin >= 10;
    }

    return false;
}

module.exports = { fetchFlightData, isDelayed };