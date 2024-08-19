
const express = require('express')
const { fetchFlightData, isDelayed } = require('./utils')
const router = express.Router();

// 1. Get the Base Url
router.get('/', async (req, res) => {
    try{
        const result = await fetchFlightData();
        res.send(result)

    } catch (error){
        res.status(500).json(error)
    }
})

// 2. Get Total Number of Flights (Inbound & Outbound)
router.get('/flights/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();

        res.json({count: flights.length});

    } catch (error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
    
})

// 3. Get Number of Inbound Flights
router.get('/flights/inbound/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const inboundCount = flights.reduce((total, flight) => {
            return flight.CHRMINE === 'LANDED' ? total + 1 : total;
        }, 0);

        res.json({count: inboundCount});

    } catch (error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// 4. Get Number of Outbound Flights
router.get('/flights/outbound/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const outboundCount = flights.reduce((total, flight) => {
            return flight.CHRMINE === 'DEPARTED' ? total + 1 : total;

        }, 0);

        res.json({count: outboundCount});

    } catch (error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// 5. Get Number of Flights from a Specific Country
router.get('/flights/count/:country', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const country = req.params.country.toLowerCase();
        const flightCount = flights.reduce((total, flight) => {
            return flight.CHLOCCT.toLowerCase() === country ? total + 1 : total
        }, 0)

        res.json({count: flightCount})

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})
// 6. Get Number of Outbound Flights from a Specific Country
router.get('/flights/outbound/count/:country', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const country = req.params.country.toLowerCase();
        const outboundCount = flights.reduce((total, flight) => {
            return (flight.CHLOCCT.toLowerCase() === country && flight.CHRMINE === 'DEPARTED') ? total + 1 : total;
        }, 0)

        res.json({count: outboundCount})

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// 7. Get Number of Inbound Flights from a Specific Country
router.get('/flights/inbound/count/:country', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        const country = req.params.country.toLowerCase();
        const inboundCount = flights.reduce((total, flight) => {
            return (flight.CHLOCCT.toLowerCase() === country && flight.CHRMINE === 'LANDED') ? total + 1 : total;
        }, 0)

        res.json({count: inboundCount})

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// 8. Get Number of Delayed Flights
router.get('/flights/delayed/count', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        // isDelayed returns true if the real departure time is 10 minute or greater than the etimated departue time.
        const delayedCount = flights.reduce((total, flight) => {
            return isDelayed(flight.CHSTOL, flight.CHPTOL) ? total + 1 : total
        }, 0)

        res.json({count: delayedCount})

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// 9. Get Most Popular Destination (City)
router.get('/flights/most-popular', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        // map stores city name as key and amount or occurrences as value.
        const map = new Map();
        let max = 0;
        let mostPopularDest;

        flights.forEach(flight => {
            // only outbound flights are relevent
            if(flight.CHRMINE === 'DEPARTED'){
                const country = flight.CHLOC1T.toLowerCase();
                if(!map.has(country)){ // first occurence of country
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

        res.json({city: mostPopularDest})

    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

// 10. Get a Quick Getaway Suggestion (BONUS)
router.get('/flights/quick-getaway', async (req, res) => {
    try {
        const flights = await fetchFlightData();
        let departureFlight, arrivalFlight;

        // separated arrays for outbound and inbound flights. Added data object as departureDate for later calculations
        const outBoundFlights = flights.filter(flight => flight.CHRMINE === 'DEPARTED').map(flight => (
            {
                ...flight,
                departureDate: new Date(flight.CHPTOL)
                
            }
        ))
        const inBoundFlights = flights.filter(flight => flight.CHRMINE === 'LANDED').map(flight => (
            {
                ...flight,
                departureDate: new Date(flight.CHPTOL)
                
            }
        ))

        // sorted arrays by departureDate (ascending)
        outBoundFlights.sort((a,b) => a.departureDate - b.departureDate);
        inBoundFlights.sort((a,b) => a.departureDate - b.departureDate);

        // find first occurence where outbound departure time is less than inbound departure time.
        for(outFlight of outBoundFlights){
            for(inFlight of inBoundFlights){
                if(outFlight.departureDate < inFlight.departureDate){
                    departureFlight = outFlight;
                    arrivalFlight = inFlight;
                    break;
                }
            }
            if(departureFlight && arrivalFlight) break; // found a pair
        }

        if(departureFlight && arrivalFlight){
            res.json({
                departure: departureFlight.CHOPER + departureFlight.CHFLTN,
                arrival: arrivalFlight.CHOPER + arrivalFlight.CHFLTN
            })
        }
        else {
            res.json({
                departure: 'Does Not Exist',
                arrival: 'Does Not Exist'
            });
        }
        
    } catch(error){
        res.status(500).json({error: 'Failed to fetch flight data'})
    }
})

module.exports = router;




