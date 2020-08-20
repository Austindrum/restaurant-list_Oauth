const bcrypt = require("bcrypt");
const db = require("../../config/db");
const Restaurant = require("../rastaurant");
const User = require("../users");
const restaurantsList = require('../../restaurant.json');

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const SEED_USER = [
    {
        name: "user1",
        email: "user1@example.com",
        password: "12345678"
    },
    {
        name: "user2",
        email: "user2@example.com",
        password: "12345678"
    },
]
db.once('open', ()=>{
    Promise.all(
        Array.from({ length: 2 }, (_, i)=>{
            return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(SEED_USER[i].password, salt))
            .then(hash => {
                return User.create({
                    name: SEED_USER[i].name,
                    email: SEED_USER[i].email,
                    password: hash      
                })
            })
            .then(user=>{
                const userId = user._id;
                let tempRestaurant = [];
                restaurantsList.results.forEach((list, num)=>{
                    if(user.name === "user1"){
                        if(num < 3){
                            tempRestaurant.push(list);
                        }
                    }else{
                        if(num > 3 || num == 3){
                            tempRestaurant.push(list);
                        }
                    }
                })
                return [tempRestaurant, userId];
            })
            .then(data=>{
                return Promise.all(
                    Array.from({ length: 3 }, (_, i)=> Restaurant.create({
                                name: data[0][i].name,
                                name_en: data[0][i].name_en,
                                category: data[0][i].category,
                                image: data[0][i].image,
                                location: data[0][i].location,
                                phone: data[0][i].phone,
                                rating: data[0][i].rating,
                                description: data[0][i].description,
                                userId: data[1]        
                        })
                    )
                )
            })
        })
    )
    .then(()=>{
        console.log("Done....");
        process.exit();
    })
})