const express = require("express");
const router = express.Router();

const restaurantsList = require('../../restaurant.json');
  
router.get('/:restaurant_id', (req, res) => {
    const restaurant_info = restaurantsList.results.find(restaurant =>
        restaurant.id.toString() === req.params.restaurant_id
    )
    res.render('show', { restaurants: restaurant_info })
})

router.get('/search', (req, res) => {
    const keyword = req.query.keyword
    const restaurantFilter = restaurantsList.results.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keyword.toLowerCase())
        || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase())
        || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    )
    res.render('index', { restaurants: restaurantFilter, keyword: keyword })
})

module.exports = router;