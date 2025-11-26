const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../../data/users.json");

function readData() {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getAllUsers() {
    return readData();
}

function addUser(user) {
    const users = readData();
    users.push(user);
    writeData(users);
    return user;
}

function deleteUser(email) {
    const users = readData();
    const newUsers = users.filter(u => u.email !== email);
    if (newUsers.length === users.length) return false;
    writeData(newUsers);
    return true;
}

module.exports = { getAllUsers, addUser, deleteUser};