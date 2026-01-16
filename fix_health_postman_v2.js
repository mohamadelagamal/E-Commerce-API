const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'postman', 'E-Commerce-API.postman_collection.json');

// Read the collection
let collection;
try {
    collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
} catch (error) {
    console.error('Error reading collection:', error);
    process.exit(1);
}

// Function to find the Health Check request
function findHealthCheck(items) {
    for (let item of items) {
        if (item.name === 'Health Check') {
            return item;
        }
    }
    return null;
}

// Update Health Check URL
let healthCheck = findHealthCheck(collection.item);
if (healthCheck) {
    console.log('Updating Health Check endpoint URL...');
    healthCheck.request.url = {
        "raw": "{{baseUrl}}/health",
        "host": ["{{baseUrl}}"],
        "path": ["health"]
    };

    // Ensure response array exists
    if (!healthCheck.response) {
        healthCheck.response = [];
    }

    const responseBody = {
        "status": "success",
        "message": "API is running",
        "timestamp": "2026-01-16T00:30:00.000Z"
    };

    if (healthCheck.response.length > 0) {
        healthCheck.response[0].body = JSON.stringify(responseBody, null, 2);
    } else {
        healthCheck.response.push({
            "name": "Success",
            "status": "OK",
            "code": 200,
            "_postman_previewlanguage": "json",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": JSON.stringify(responseBody, null, 2)
        });
    }
} else {
    console.log('Health Check endpoint not found, creating it...');
    collection.item.unshift({
        "name": "Health Check",
        "request": {
            "method": "GET",
            "header": [],
            "url": {
                "raw": "{{baseUrl}}/health",
                "host": ["{{baseUrl}}"],
                "path": ["health"]
            },
            "description": "Check API health status"
        },
        "response": [
            {
                "name": "Success",
                "status": "OK",
                "code": 200,
                "_postman_previewlanguage": "json",
                "header": [{ "key": "Content-Type", "value": "application/json" }],
                "body": JSON.stringify({
                    "status": "success",
                    "message": "API is running",
                    "timestamp": "2026-01-16T00:30:00.000Z"
                }, null, 2)
            }
        ]
    });
}

// Write back to file
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 4));
console.log('Postman collection updated successfully!');
