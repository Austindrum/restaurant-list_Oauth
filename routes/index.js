const express = require("express");
const router = express.Router();

const restaurantsList = require('../restaurant.json');

const users = require("./modules/users");
const restaurants = require("./modules/restaurant");

router.use("/restaurants", restaurants);
router.use("/users", users);

router.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantsList.results })
})

module.exports = router;