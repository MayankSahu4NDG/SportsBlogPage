var express = require("express"),
    router  = express.Router();

// =================================================================
//                                                  Importing Models
// =================================================================
var user      = require("../models/user"),
    sports    = require("../models/sports"),
    comment   = require("../models/comment");

// =================================================================
//                                                    RESTful ROUTES
// =================================================================
//------------------------------INDEX ROUTE
router.get("/sports", (req,res)=>{
    sports.find({}, (err, allSports)=>{
        if(err){
            console.log(err);
        } else{
            res.render("index", {allSports:allSports});
        }
    });
});
//--------------------------------NEW ROUTE
router.get("/sports/new", isLoggedIn, (req,res)=>{
    res.render("new");
});
//-----------------------------CREATE ROUTE
router.post("/sports", isLoggedIn, (req,res)=>{
    var name        = req.body.name,
        image       = req.body.image,
        date        = req.body.date,
        description = req.body.description,
        story       = req.body.story,
        author      = {
                        id       : req.user.id,
                        username : req.user.username
                      };
    var newOne = {name:name, image:image, date:date, description:description, story:story, author:author};
    sports.create(newOne, (err, newSports)=>{
        if(err){
            res.render("new");
        } else{
            req.flash("success", "You just added "+newOne.name);
            res.redirect("/sports");
        }
    });
});
//-------------------------------SHOW ROUTE
router.get("/sports/:id", (req,res)=>{
    sports.findById(req.params.id).populate("comment").exec( (err, idSports)=>{
        if(err){ console.log(err); }
        else{
            res.render("show", {idSports:idSports});
        }
    });
});
//-------------------------------EDIT ROUTE
router.get("/sports/:id/edit", checkOriginality, (req,res)=>{
    sports.findById(req.params.id, (err, editSports)=>{
        res.render("edit", {editSports:editSports});
    });
});

//-----------------------------UPDATE ROUTE
router.put("/sports/:id", checkOriginality, (req,res)=>{
    sports.findByIdAndUpdate(req.params.id, req.body, (err, updateSports)=>{
        if(err){
            res.redirect("/sports");
        } else{
            req.flash("success", "Updated successfully!")
            res.redirect("/sports/" +req.params.id);
        }
    });
});
//-----------------------------DELETE ROUTE
router.delete("/sports/:id", checkOriginality, (req,res)=>{
    sports.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/sports");
        } else{
            req.flash("error", "Removed Successfully!");
            res.redirect("/sports");
        }
    });
});
// //----------------------------COMMENT ROUTE
// router.get("/sports/:id/comments/new",isLoggedIn, (req,res)=>{
//     sports.findById(req.params.id, (err, sportsComment)=>{
//         if(err){
//             console.log(err);
//         } else {
//             res.render("commentForm", {sportsComment:sportsComment});
//         }
//     });
// });
// --------------------------CREATE COMMENT
router.post("/sports/:id/comments",isLoggedIn, (req,res)=>{
    sports.findById(req.params.id, (err, sports)=>{
        if(err){
            console.log(err);
        } else {
            comment.create(req.body, (err, comment)=>{
                if(err){
                    console.log(err);
                    req.flash("error", "Something went wrong!!");
                    res.redirect("/sports");
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    sports.comment.push(comment);
                    sports.save();
                    req.flash("success", "Your comment saved successfully!");
                    res.redirect("/sports/" +sports.id);
                }
            });
        }
    });
});

// =================================================================
//                                                      MIDDLE WARES
// =================================================================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to login first to use this feature");
    res.redirect("/login");
}

function checkOriginality(req, res, next){
    if(req.isAuthenticated()){
        sports.findById(req.params.id, (err, editSports)=>{
            if(err){
                req.flash("error", "You have login with same id to edit it");
                res.redirect("back");
            } else{
                if(editSports.author.id.equals(req.user.id)){
                    next();
                } else{
                req.flash("error", "You need to login with the same id to edit it");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to logged in to do that!");
        res.redirect("back");
    }
}

module.exports = router;