
const express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require('mongoose'),
     methodOverride = require("method-override");

//local require
const indexRoute = require('./routes/maps.js');

app.use(methodOverride("_method"));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var port = process.env.DATABASEURL || "mongodb://localhost:27017/maps"
mongoose.connect(port, { useNewUrlParser: true })
mongoose.set('useFindAndModify', false);


app.use("/", indexRoute);

app.listen(3000, () => {
     console.log("map has started!!");
});
