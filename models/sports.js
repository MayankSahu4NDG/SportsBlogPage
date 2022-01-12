var mongoose = require("mongoose"),
    comment  = require("./comment");

// =================================================================
//                                                      SCHEMA Setup
// =================================================================
var sportsSchema = new mongoose.Schema({
    name        : String,
    date        : String,
    image       : String,
    story       : String,
    description : String,
    author      : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        username: String
    },
    comment     : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "comment"
        }
    ]
});
// Modeling SCHEMA
module.exports = mongoose.model('sports',sportsSchema);