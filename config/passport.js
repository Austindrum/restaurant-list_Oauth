const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/users");

module.exports = app => {
    //passport init
    app.use(passport.initialize());
    app.use(passport.session());

    //passport localstrategy
    passport.use(new LocalStrategy({usernameField: "email", passReqToCallback: true}, 
    (req, email, password, done)=>{
        User.findOne({ email })
        .then(user=>{
            if(!user){
                return done(null, false, {message: "user"});
                // req.flash("warning_msg", "沒有找到使用者")
            }
            return bcrypt.compare(password, user.password)
                    .then(isMatch=>{
                        if(!isMatch){
                            return done(null, false, {message: "password"});
                            // return done(null, false, req.flash("warning_msg", "密碼錯誤"));
                        }else{
                            done(null, user);
                        }
                    }) 
                    .catch(err => done(err, false))
            
        })
        .catch( err => done(err, false) )
    }))

    //passport serialize & deserialize
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    })
    passport.deserializeUser((id, done)=>{
        User.findById(id)
        .lean()
        .then(user => done(null, user))
        .catch(err => done(err, false))
    })
}