const express = require("express");
const router = express.Router();
const { authenticator } = require("../middleware/auth");
const Restaurant = require("../models/rastaurant");


const users = require("./modules/users");
const restaurants = require("./modules/restaurant");
const auth = require("./modules/auth");

router.use("/restaurants", authenticator, restaurants);
router.use("/users", users);
router.use("/auth", auth);

router.get('/', authenticator, (req, res) => {
    let userId = req.user._id;
    Restaurant.find({ userId })
    .lean()
    .then(restaurants=>{
        return res.render("index", { restaurants });
    })
    .catch(err=> console.log(err))
})


module.exports = router;