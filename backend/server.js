const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const csvWriter = require('fast-csv');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let dataStore = {
    System1: {
        mainData: {},            // Data handled by /data endpoint
        microcontrollerData: []  // Data handled by /addData endpoint
    },
    System2: {
        mainData: {},            // Data handled by /data endpoint
        microcontrollerData: []  // Data handled by /addData endpoint
    }
};

let lastUpdatedSystem = 'System1'; // Default to System1 or set based on first POST request

// GET endpoint to retrieve main data for the last updated system
app.get('/data', (req, res) => {
    try {
        const systemData = dataStore[lastUpdatedSystem].mainData; // Retrieve main data
        if (systemData) {
            res.status(200).json({
                system: lastUpdatedSystem,
                data: systemData
            });
        } else {
            res.status(404).send('System data not found.');
        }
    } catch (error) {
        res.status(500).send('An error occurred while fetching the data.');
    }
});

// POST endpoint to handle main data updates for System1 and System2
app.post('/data', (req, res) => {
    const { system, data } = req.body;

    if (system === 'System1' || system === 'System2') {
        dataStore[system].mainData = data;
        lastUpdatedSystem = system; // Track the last updated system
        res.status(200).send('Data updated successfully.');
    } else {
        res.status(400).send('Invalid system identifier.');
    }
});

// Function to append data to CSV
const appendToCsv = (system, data) => {
    const writableStream = fs.createWriteStream(`${system}_microcontrollerData.csv`, { flags: 'a' });

    const csvStream = csvWriter.format({ headers: !fs.existsSync(`${system}_microcontrollerData.csv`) });
    csvStream.pipe(writableStream);

    // If data is an array, write each object in a new row
    if (Array.isArray(data)) {
        data.forEach(entry => csvStream.write(entry));
    } else {
        csvStream.write(data);
    }

    csvStream.end();
};

// GET endpoint to retrieve microcontroller data
app.get('/addData', (req, res) => {
    try {
        res.status(200).json({
            System1: dataStore.System1.microcontrollerData,
            System2: dataStore.System2.microcontrollerData
        });
    } catch (error) {
        res.status(500).send('An error occurred while fetching the data.');
    }
});

// POST endpoint to handle microcontroller data updates for System1 and System2
app.post('/addData', (req, res) => {
    const { System1, System2 } = req.body;

    // Check if both System1 and System2 are provided in the request body
    if (System1 && System2) {
        // Validate and update data for System1
        if (System1) {
            dataStore.System1.microcontrollerData = System1;
            appendToCsv('System1', System1);  // Append System1 data to CSV
        } else {
            return res.status(400).send('Invalid system identifier for System1.');
        }

        // Validate and update data for System2
        if (System2) {
            dataStore.System2.microcontrollerData = System2;
            appendToCsv('System2', System2);  // Append System2 data to CSV
        } else {
            return res.status(400).send('Invalid system identifier for System2.');
        }

        res.status(200).send('Data updated successfully.');
    } else {
        res.status(400).send('Request must include data for both System1 and System2.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
