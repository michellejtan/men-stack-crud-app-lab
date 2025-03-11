const mongoose = require('mongoose');
 
 const restaurantSchema = new mongoose.Schema({
     name: String,
     city: String,
     state: String,
     dishToTry: Boolean
 });
 
 const Restaurant = mongoose.model('Restaurant', restaurantSchema);
 
 module.exports = Restaurant;