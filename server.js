const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Travel Explorer API");
});

//----DESTINATIONS----

//Get all destinations
app.get("/destinations", (req, res) => {
    res.json({ message: "List of all destinations"});
});

//Get destinations by name 
app.get("/destinations/name/:name", (req, res) => {
    const { name } = req.params;
    res.json({ message: `Fetched destination with name: ${name}`});
});

//Update destination information for example using rating
app.put("/destinations/:name", (req, res) => {
    const { name } = req.params;
    res.json({ message: `Updated destination: ${name}`, data: req.body});
});

//Filter destination by country, category, rating
app.get("destinations/filter", (req, res) => {
    const { country, category, rating } = req.query;
    res.json({
        message: "Filtered Destinations",
        filters: { country, category, rating}
    });
});

//Search for destinations
app.get("/destinations/search/:keyword", (req, res) => {
    const { keyword } = req.params;
    res.json({ message: `Search results for keyword: ${keyword}`});
});

// Delete a destination (admin only)
app.delete("/destinations/:name", (req, res) => {
    const {name} = req.params;
    res.json({ message: `Destination '${name}' deleted by admin`});
});

//------USERS----

//To create a new user profile
app.post("/users/signup", (req, res) => {
    res.json({ message: "User signed up succesfully", data: req.body});
});

//To login
app.post("/users/login", (req, res) => {
    res.json({ message: "User logged in successfully", data: req.body});
});

//To manage favourites (add/remove)
app.post("/users/:email/favorites", (req, res) => {
    const { email } = req.params;
    res.json({ message: `Favourites upadated for user: ${email}`, data: req.body});
});

//To manage bookings(add/remove booking)
app.post("/users/:email/bookings", (req, res) => {
    const { email } = req.params;
    res.json({ message: `Bookings upfdated for user: ${email}`, data: req.body});
});

//Delete user account(admin only)
app.delete("/users/:email", (req, res) => {
    const { email } = req.params;
    res.json({ message: `User account '${email}' deleted by admin`});

});

//To start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
