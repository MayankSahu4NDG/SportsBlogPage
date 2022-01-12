var express = require("express"),
    router  = express.Router(),
    passport= require("passport");

// =================================================================
//                                                  Importing Models
// =================================================================
var user      = require("../models/user");

// =================================================================
//                                             AUTHENTICATION ROUTES
// =================================================================
// ----------------------------REGISTRATION
router.get("/register", (req,res)=>{
    res.render("register");
});
router.post("/register", (req,res)=>{
    user.register(new user({username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome "+user.username+"! Your registration is successful. Now You can explore more...");
            res.redirect("/sports");
        });
    });
});
// -----------------------------LOGIN ROUTE
router.get("/login", (req,res)=>{
    res.render("login");
});
router.post("/login",passport.authenticate("local", {
    successRedirect : "/sports",
    failureRedirect : "/login"
}), (req,res)=>{
});
// ----------------------------LOGOUT ROUTE
router.get("/logout", (req,res)=>{
    req.logOut();
    req.flash("success", "Logged out successfully!");
    res.redirect("/sports");
});

// // =================================================================
// //                                                       MiddleWares
// // =================================================================
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;