// dependencies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

// Import the Restaurant model
const Restaurant = require('./models/restaurant');

const methodOverride = require('method-override');
 const morgan = require('morgan');

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

app.use(methodOverride('_method')); 
app.use(morgan('dev'));

// static asset middleware - used to sent static assets (CSS, Imgs and DOM manipulation JS) to the client 
app.use(express.static('public'));

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /restaurants/new
app.get("/restaurants/new", (req, res) => {
    res.render("restaurants/new.ejs");
  });

// POST /restaurants
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
    console.log(allRestaurants); // log the restaurants!
    res.render("restaurants/index.ejs", { restaurants: allRestaurants });
});

// show route
 app.get('/restaurants/:restaurantId', async (req, res) => {
    const foundRestaurant = await Restaurant.findById(req.params.restaurantId);
    res.render('restaurants/show.ejs', { restaurant: foundRestaurant });
});

app.delete('/restaurants/:restaurantId', async (req, res) => {
    await Restaurant.findByIdAndDelete(req.params.restaurantId);
    res.redirect('/restaurants');
});

app.get('/restaurants/:restaurantId/edit', async (req, res) => {
    // 1. look up the restaurant by it's id
    const foundRestaurant = await Restaurant.findById(req.params.restaurantId);
    // 2. respond with a "edit" template with an edit form
    res.render('restaurants/edit.ejs', { restaurant: foundRestaurant });
});


// update route - used to capture edit form submissions
// from the client and send updates to MongoDB
app.put('/restaurants/:restaurantId', async (req, res) => {
    if(req.body.dishToTry === 'on') {
        req.body.dishToTry = true;
    } else {
        req.body.dishToTry = false;
    }

    await Restaurant.findByIdAndUpdate(req.params.restaurantId, req.body);

    res.redirect(`/restaurants/${req.params.restaurantId}`);
});
  
  
app.listen(3000, () => {
    console.log('Listening on port 3000');
  });