const express = require("express");
const router = express.Router();
// const restaurantsList = require('../../restaurant.json');
const Restaurant = require("../../models/rastaurant");

//create page
router.get("/", (req, res)=>{
    res.render("newRestaurant");
})
//craete restaurant
router.post("/", (req, res)=>{
    let { name, name_en, category, image, location, phone, rating, description} = req.body; 
    let userId = req.user._id;
    return Restaurant.create({
        name, name_en, category, image, location, phone, rating, description, userId
    })
    .then(()=>{
        req.flash("success_msg", "商店建立成功");
        res.redirect("/");
    })
    .catch(err => console.log(err))
})
//show restaurant detail
router.get('/:restaurant_id', (req, res) => {
    let _id = req.params.restaurant_id;
    let userId = req.user._id;
    return Restaurant.findOne({_id, userId})
    .lean()
    .then(restaurants=>{
        return res.render("show", { restaurants });
    })
    .catch(err=> console.log(err))
})
//edit restaurant page
router.get("/edit/:restaurant_id", (req, res)=>{
    let _id = req.params.restaurant_id;
    let userId = req.user._id;
    return Restaurant.findOne({_id, userId})
    .lean()
    .then(restaurant => {
        return res.render("editRestaurant", { restaurant })
    })
    .catch( err => console.log(err) )
})
//edit restaurant
router.put("/:restaurant_id", (req, res)=>{
    let { name, name_en, category, image, location, phone, rating, description} = req.body; 
    let _id = req.params.restaurant_id;
    let userId = req.user._id;
    return Restaurant.findOne({ _id, userId })
        .then(restaurant => {
            restaurant.name = name;
            restaurant.name_en = name_en;
            restaurant.category = category;
            restaurant.image = image;
            restaurant.location = location;
            restaurant.phone = phone;
            restaurant.rating = rating;
            restaurant.description = description;
            return restaurant.save();
        })
        .then(()=>{
            req.flash("success_msg", "編輯成功");
            res.redirect("/");
        })
        .catch(err => console.log(err))
})
//delete restaurant
router.delete("/:restaurant_id", (req, res)=>{
    let _id = req.params.restaurant_id;
    let userId = req.user._id;
    return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => {
        req.flash("success_msg", "餐廳刪除成功");
        res.redirect("/")
    })
    .catch(err => console.log(err))
})
//search restaurant
router.post('/search', (req, res) => {
    let keyword = req.body.keyword;
    let userId = req.user._id;
    Restaurant.find({ userId })
    .lean()
    .then(restaurants=>{
        return restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(keyword.toLowerCase())
            || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase())
            || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
        );
    })
    .then(restaurants=>{
        return res.render('index', { restaurants, keyword })
    })
})

module.exports = router;