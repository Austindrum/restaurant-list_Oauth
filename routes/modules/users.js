const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../../models/users");

// login & register form page
router.get("/login", (req, res)=>{
    res.render("login");
})
router.get("/register", (req, res)=>{
    res.render("register");
})

// register
router.post("/register", (req, res)=>{
    let { name, email, password, confirmPassword} = req.body;
    let errors = [];
    if(!name || !email || !password || !confirmPassword){
        errors.push({message: "各欄位不得為空"});
    }
    if(password !== confirmPassword){
        errors.push({message: "密碼確認錯誤"});
    }
    if(errors.length > 0){
        return res.render("register", { errors });
    }
    // register success
    return bcrypt.genSalt(10).then(slat=>{
        return bcrypt.hash(password, slat);
    })
    .then(hash=>{
        User.create({name, email, password: hash});
    })
    .then(()=>{
        res.redirect("/login");
    })
    .catch(err=> console.log(err))
})


module.exports = router;