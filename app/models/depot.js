/**
 * Created by thomasmundt on 08.02.16.
 */
// Defines mongoose schema for Depot
var mongoose = require('mongoose');

module.exports = mongoose.model("Depot",{
    author: String,
    name: String,
    year: Number,
    region: String,
    amount: Number,
    price: String,
    shop: String,
    buyDate: Date,
    rating: Number,
    remarks: String,
    selectedSort: String,
    selectedTaste: String,
    sort: String,
    taste: String
});