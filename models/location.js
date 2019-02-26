//New Map Model
var mongoose = require("mongoose");
var mapApiSchema = new mongoose.Schema({
   location: { type: String, trim: true, default: '' },
   lat: { type: Number, trim: true, default: '' },
   lng: { type: Number, trim: true, default: '' }

});
module.exports = mongoose.model("MapApi", mapApiSchema);


