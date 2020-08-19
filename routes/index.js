const express = require("express");
const router = express.Router();
const { authenticator } = require("../middleware/auth");
const Restaurant = require("../models/rastaurant");
// const restaurantsList = require('../restaurant.json');


const users = require("./modules/users");
const restaurants = require("./modules/restaurant");
const auth = require("./modules/auth");

router.use("/restaurants", restaurants);
router.use("/users", users);
router.use("/auth", auth);

router.get('/', authenticator, (req, res) => {
    let useId = req.user_id;
    Restaurant.find({ useId })
    .lean()
    .then(restaurants=>{
        return res.render("index", { restaurants });
    })
    .catch(err=> console.log(err))
    // res.render("index", { restaurants: restaurantsList.results });
})


module.exports = router;