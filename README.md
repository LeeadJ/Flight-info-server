# Flight-info-server

## Project Overview
The **Flight Info Server** is a web server that provides information on inbound and outbound flights from TLV airport. The server fetches flight data from an external API and offers several endpoints to query various details about the flights.
###### Base URL: 
`https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5&limit=300` 

## Features

- **Flight Count**: Get the total number of inbound, outbound, and specific flights.
- **Delayed Flights**: Count the number of delayed flights (calculated by a 10 minute difference between estimate time and real time departure).
- **Popular Destination**: Find the most popular outbound destination.
- **Quick Getaway**: Returns two flights (outbound and inbound) that someone can take for a quick getaway considering date and time (calculated by departure times and **not** flight duration).

## Tech Stack

- **Backend**: Node.js
- **Package Manager**: npm
- **Containerization**: Docker

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v14 or above)
  
  - **Installation**:
    - On **Windows/macOS**: Download and install from [Node.js official website](https://nodejs.org/).
    - On **Linux**: Use the package manager for your distribution:
      ```bash
      sudo apt install nodejs npm
      ```
- **npm** (comes with Node.js)

  - **Installation**: npm is installed automatically with Node.js. Verify installation with:
    ```bash
    npm --version
    ```
- **Docker** 

  - **Installation**:
    - On **Windows/macOS**: Download and install Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).
    - On **Linux**: Follow the installation guide on [Docker's official documentation](https://docs.docker.com/engine/install/).

  - **Verify Docker Installation**:
    ```bash
    docker --version
    ```

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/LeeadJ/Flight-info-server.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd Flight-info-server
    ```

3. **Install the dependencies**:

    ```bash
    npm install
    ```

## Running the Server

### Running Locally

To run the server locally:

1. **Start the server**:

    ```bash
    npm start
    ```

2. **Access the server**:

    The server will be running on `http://localhost:3000`.

### Running with Docker

To run the server in a Docker container:

1. **Build the Docker image**:

    ```bash
    docker build -t flight-info-server .
    ```

2. **Run the Docker container**:

    ```bash
    docker run -p 8080:3000 flight-info-server
    ```

3. **Access the server**:

    The server will be running on `http://localhost:8080`.

## API Endpoints

### 1. Get the Base Url
- **Endpoint**: `/'
- **Method**: `GET`

### 2. Get Total Number of Flights (Inbound & Outbound)
- **Endpoint**: `/flights/count`
- **Method**: `GET`
- **Response**: `{ "count": <number> }`

### 3. Get Number of Inbound Flights
- **Endpoint**: `/flights/inbound/count`
- **Method**: `GET`
- **Response**: `{ "count": <number> }`

### 4. Get Number of Outbound Flights
- **Endpoint**: `/flights/outbound/count`
- **Method**: `GET`
- **Response**: `{ "count": <number> }`

### 5. Get Number of Flights from a Specific Country
- **Endpoint**: `/flights/count/:country`
- **Method**: `GET`
- **Parameters**: `{ "country": "<country_name>" }`
- **Response**: `{ "count": <number> }`

### 6. Get Number of Outbound Flights from a Specific Country
- **Endpoint**: `/flights/outbound/count/:country`
- **Method**: `GET`
- **Response**: `{ "count": <number> }`

### 7. Get Number of Inbound Flights from a Specific Country
- **Endpoint**: `/flights/inbound/count/:country`
- **Method**: `GET`
- **Response**: `{ "count": <number> }`

### 8. Get Number of Delayed Flights
- **Endpoint**: `/flights/delayed/count`
- **Method**: `GET`
- **Response**: `{ "count": <number> }`

### 9. Get Most Popular Destination (City)
- **Endpoint**: `//flights/most-popular`
- **Method**: `GET`
- **Response**: `{ "city": "<city_name>" }`

### 10. Get a Quick Getaway Suggestion (BONUS)
- **Endpoint**: `/flights/quick-getaway`
- **Method**: `GET`
- **Response**: `{ "departure": "<flight_code>", "arrival": "<flight_code>" }`

## Functions

### 1. `fetchFlightData()`

- **Description**: A helper function that fetches flight data from the external API.
- **Returns**: An array of flight records from the BASE_URL.

### 2. `isDelayed(estimatedTime, realTime)`

- **Description**: A helper function that checks if a flight is delayed. A flight is considered delayed if the real departure time of a flight is 10 minutes or greater than the extimated departure time. 
- **Parameters**:
  - `estimatedTime`: The estimated time of departure.
  - `realTime`: The actual time of departure.
- **Returns**: `true` if the flight is delayed, `false` otherwise.
