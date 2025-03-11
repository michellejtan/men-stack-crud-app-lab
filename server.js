// dependencies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
// Import the Restaurant model
const Restaurant = require('./models/restaurant');

// initialize the express application
const app = express();

// config code
dotenv.config();

// initialize connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Mongoose/MongoDB event listeners
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (error) => {
    console.log(`An error connecting to MongoDB has occurred: ${error}`)
});
// mount middleware functions here
 

app.use(express.urlencoded({ extended: false }));

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /restaurants/new
app.get("/restaurants/new", (req, res) => {
    res.render("restaurants/new.ejs");
  });

// POST /restaurants
// server.js

// POST /fruits
app.post("/restaurants", async (req, res) => {
    if (req.body.dishToTry === "on") {
      req.body.dishToTry = true;
    } else {
      req.body.dishToTry = false;
    }
    await Restaurant.create(req.body);
    res.redirect("/restaurants/");
  });

  app.get("/restaurants", async (req, res) => {
    const allRestaurants = await Restaurant.find();
    console.log(allRestaurants); // log the fruits!
    res.render("restaurants/index.ejs", { restaurants: allRestaurants });
});

// show route
 app.get('/restaurants/:restaurantId', async (req, res) => {
    const foundRestaurant = await Restaurant.findById(req.params.restaurantId);
    res.render('restaurants/show.ejs', { restaurant: foundRestaurant });
});
  
  
app.listen(3000, () => {
    console.log('Listening on port 3000');
  });