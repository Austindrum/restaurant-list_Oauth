module.exports = {
    authenticator: (req, res, next)=>{
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("warning_msg", "請先登入");
            res.redirect("/users/login");
        }
    }
}