const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;
const BASE_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=300';

app.get('/', (req, res) => {
    res.send('Flight Server Test')
})

// returns flight data => [{},{},{}...]
const fetchFlightData = async () => {
    const response = await axios.get(BASE_URL);
    return response.data.result.records;
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))