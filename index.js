const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;
const BASE_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=300';

// Fetching the base url
app.get('/', async (req, res) => {
    try{
        const result = await fetchFlightData();
        res.send(result)

    } catch (error){
        res.status(500).json(error)
    }
})

// Number of flights
app.get('/flights/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        res.json(flights.length);

    } catch (error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
    
})

// Number of Inbound flights
app.get('/flights/inbound/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const inboundCount = flights.reduce((total, flight) => {
            return flight.CHRMINE === 'LANDED' ? total + 1 : total;
        }, 0);

        res.json(inboundCount);

    } catch (error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// Number of Outbound flights
app.get('/flights/outbound/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const outboundCount = flights.reduce((total, flight) => {
            return flight.CHRMINE === 'DEPARTED' ? total + 1 : total;

        }, 0);

        res.json(outboundCount);

    } catch (error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// Number of flights from a given country
app.get('/flights/count/:country', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const country = req.params.country.toLowerCase();
        const flightCount = flights.reduce((total, flight) => {
            return flight.CHLOCCT.toLowerCase() === country ? total + 1 : total
        }, 0)

        res.json(flightCount)

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})
// Number of outbound flights from a given country
app.get('/flights/outbound/count/:country', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const country = req.params.country.toLowerCase();
        const outboundCount = flights.reduce((total, flight) => {
            return (flight.CHLOCCT.toLowerCase() === country && flight.CHRMINE === 'DEPARTED') ? total + 1 : total;
        }, 0)

        res.json(outboundCount)

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// Number of inbound flights from a given country
app.get('/flights/inbound/count/:country', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const country = req.params.country.toLowerCase();
        const inboundCount = flights.reduce((total, flight) => {
            return (flight.CHLOCCT.toLowerCase() === country && flight.CHRMINE === 'LANDED') ? total + 1 : total;
        }, 0)

        res.json(inboundCount)

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

//Number of delayed flights
app.get('/flights/delayed/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const delayedCount = flights.reduce((total, flight) => {
            return isDelayed(flight.CHSTOL, flight.CHPTOL) ? total + 1 : total
        }, 0)

        res.json(delayedCount

        )
    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// Most popular fl  ight
app.get('/flights/most-popular', async (req, res) => {
    try {
        const flights = await fetchFlightData();

        const map = new Map();
        let max = 0;
        let mostPopularDest;
        flights.forEach(flight => {
            // filter outbound flights
            if(flight.CHRMINE === 'DEPARTED'){
                const country = flight.CHLOC1T.toLowerCase();
                if(!map.has(country)){
                    map.set(country, 1);
                }
                else {
                    map.set(country, map.get(country) + 1);
                }
                // update max and country
                if(max < map.get(country)){
                    max = map.get(country);
                    mostPopularDest = country;
                }
            }
        })

        res.json(mostPopularDest)
    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

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


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

/*
try {

} catch(error){
    res.status(500).json({error: 'Failed to fetch flight data'})
}
*/


// fetchFlightData().then(result => {
//     const times = result.map(flight => {
//         return {
//             EST: flight.CHSTOL, 
//             REAL: flight.CHPTOL,
//         }
//     })
//     const delayed = times.filter(time => {
//         return isDelayed(time.EST, time.REAL)
//     })
//     console.log({Count:delayed.length, Delayed: delayed})
//     const onTime = times.filter(time => {
//         return !isDelayed(time.EST, time.REAL)
//     })
//     console.log({Count:onTime.length, OnTime: onTime})

// })