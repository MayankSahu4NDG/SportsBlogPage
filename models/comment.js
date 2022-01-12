var mongoose = require("mongoose");

// =================================================================
//                                                      SCHEMA Setup
// =================================================================
var commentSchema = new mongoose.Schema({
    comment  : String,
    author   : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});
// Modeling SCHEMA
module.exports = mongoose.model('comment',commentSchema);