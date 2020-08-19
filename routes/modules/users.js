const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../../models/users");

// login & register form page
router.get("/login", (req, res)=>{
    res.render("login");
})
router.get("/register", (req, res)=>{
    res.render("register");
})

// login
router.post("/login", (req, res, next) => {
    let { email, password } = req.body;
    let errors = [];
    if(!email || !password){
        req.flash("warning_msg", "各欄位不得為空");
        return res.redirect("/users/login");
    }
    passport.authenticate('local', (err, user, info) => {
      req.logIn(user, err => {
        if (err) { 
            if(info.message === "user"){
                errors.push({message: "找不到使用者"});
            }else{
                errors.push({message: "密碼錯誤"});
            }
            return res.render("login", { email, errors });
        }
        req.flash("success_msg", "登入成功，歡迎您");
        return res.redirect('/');
      });
    })(req, res, next);
})
// logout
router.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success_msg", "您已成功登出");
    res.redirect("/users/login");
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
        return res.render("register", { name, email, errors });
    }
    User.findOne({ email })
    .then(user=>{
        if(user){
            errors.push({message: "此信箱已有人註冊"})
            return res.render("register", { name, email, errors });
        }else{
            // register success
            return bcrypt.genSalt(10).then(slat=>{
                return bcrypt.hash(password, slat);
            })
            .then(hash=>{
                User.create({name, email, password: hash});
            })
            .then(()=>{
                req.flash("success_msg", "註冊成功 請登入");
                res.redirect("/users/login");
            })
            .catch(err=> console.log(err))
        }
    })
})


module.exports = router;