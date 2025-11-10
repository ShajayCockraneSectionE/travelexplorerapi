const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, min:0, max: 5, required: true},
    pricePerPerson: { type: Number, required: true },
    activities: [{ type: String }]

});

module.exports = mongoose.model("Destination", destinationSchema);

