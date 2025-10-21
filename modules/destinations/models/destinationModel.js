const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/destinations.json");

function readData() {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getAllDestinations() {
    return readData();
}

function getDestinationByName(name) {
    return readData().find(dest => dest.name.toLowerCase() === name.toLowerCase());
}

function addDestination(newDest) {
    const data = readData();
    data.push(newDest);
    writeData(data);
    return newDest;
}

function updateDestination(name, updates) {
    const data = readData();
    const index = data.findIndex(d => d.name.toLowerCase() === name.toLowerCase());
    if (index === -1) return null;
    data[index] = {...data[index], ...updates };
    writeData(data);
    return data[index];
}

function deleteDestination(name) {
    const data = readData();
    const newData = data.filter(d => d.name.toLowerCase() !== name.toLowerCase());
    if (newData.length === data.length) return false;
    writeData(newData);
    return true;
}

module.exports = {
    getAllDestinations,
    getDestinationByName,
    addDestination,
    updateDestination,
    deleteDestination,
};

