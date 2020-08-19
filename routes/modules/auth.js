const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/facebook", passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}))

router.get("/facebook/callback", function(req, res, next) {
    passport.authenticate('facebook', (err, user, info) => {
      req.logIn(user, err => {
        if (err) { return next(err); }
        req.flash("success_msg", "登入成功 歡迎您");
        return res.redirect('/');
      });
    })(req, res, next);
}) 

module.exports = router;