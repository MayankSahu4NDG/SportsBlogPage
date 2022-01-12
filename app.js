// =================================================================
//                                              Package Installation
// =================================================================
var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    flash                   = require("connect-flash"),
    localStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    passportLocalMongoose   = require("passport-local-mongoose"),

    app  = express(),
    port = process.env.PORT || 1020;

// =================================================================
//                                                  Importing Models
// =================================================================
var user      = require("./models/user"),
    sports    = require("./models/sports"),
    comment   = require("./models/comment"),

    restFulRoutes = require("./routes/restFulRoutes"),
    authRoutes    = require("./routes/authRoutes");

// =================================================================
//                                             Package Configuration
// =================================================================
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));

//============================================Passport Configuration
app.use(require("express-session")({
    secret            : "I am the best",
    resave            : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
passport.use(new localStrategy(user.authenticate()));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use(restFulRoutes);
app.use(authRoutes);

// =================================================================
//                                     Secure Connection to Database
// =================================================================
var url = process.env.DATABASEURL;

//-------------------------------------------Connect to mongoose
mongoose.connect(url,sports)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database with sports. \n${err}`);
    });
mongoose.connect(url,user)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database with user. \n${err}`);
    });

// =================================================================
//                                            First data on database
// =================================================================
// sports.create({
//     name:"Sports",
//     date: "2/sep/2017",
//     image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcDQbdfQepfnqBSeJKxbFKRrS6G_YJxu0vhw&usqp=CAU",
//     story: "Sport pertains to any form of competitive physical activity or game that aims to use, maintain or improve physical ability and skills while providing enjoyment to participants and, in some cases, entertainment to spectators.Sports can, through casual or organized participation, improve one's physical health. Hundreds of sports exist, from those between single contestants, through to those with hundreds of simultaneous participants, either in teams or competing as individuals. In certain sports such as racing, many contestants may compete, simultaneously or consecutively, with one winner; in others, the contest (a match) is between two sides, each attempting to exceed the other. Some sports allow a 'tie' or 'draw', in which there is no single winner; others provide tie-breaking methods to ensure one winner and one loser. A number of contests may be arranged in a tournament producing a champion. Many sports leagues make an annual champion by arranging games in a regular sports season, followed in some cases by playoffs.<br>Sport is generally recognised as system of activities based in physical athleticism or physical dexterity, with major competitions such as the Olympic Games admitting only sports meeting this definition.Other organisations, such as the Council of Europe, preclude activities without a physical element from classification as sports. However, a number of competitive, but non-physical, activities claim recognition as mind sports. The International Olympic Committee (through ARISF) recognises both chess and bridge as bona fide sports, and SportAccord, the international sports federation association, recognises five non-physical sports: bridge, chess, draughts (checkers), Go and xiangqi, and limits the number of mind games which can be admitted as sports.<br> Sport is usually governed by a set of rules or customs, which serve to ensure fair competition, and allow consistent adjudication of the winner. Winning can be determined by physical events such as scoring goals or crossing a line first. It can also be determined by judges who are scoring elements of the sporting performance, including objective or subjective measures such as technical performance or artistic impression.",
//     description:"There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do."
//     }, function (err, sports){
//         if(err){ console.log(err); }
//         else{console.log("newly added Sport " + sports);}
// });



// =================================================================
//                                                  Home Page Config
// =================================================================
app.get("/", (req,res) => {
    // res.redirect("/sports");
    res.redirect("/sports");
});

// =================================================================
//                                                    Server Starter
// =================================================================
app.listen(port, (req, res) => {
    console.log("Server is Working!!");
});