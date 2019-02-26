require('dotenv').config();

const express = require("express"),
     router = express.Router({ mergeParams: true }),
     NodeGeocoder = require('node-geocoder');
//local requires
const MapApi = require('../models/location');

//Google Maps Config
var options = {
     provider: 'google',
     httpAdapter: 'https',
     apiKey: process.env.GEOCODER_API_KEY,
     formatter: null
};
var geocoder = NodeGeocoder(options);

//Routes
router.get('/', (req, res) => {
     res.redirect('/maps');
})

//INDEX
router.get('/maps', (req, res) => {
     MapApi.find({}, (err, maps) => {
          if (err) {
               res.send('error');
               console.log(err);
          } else {

               res.render('index', { mapsGoogle: maps });
          }
     });
});

//Show New Map Form
router.get('/maps/new', (req, res) => {
     res.render('new');
})

// Creat - Add New Map To DB
router.post('/maps', (req, res) => {
     geocoder.geocode(req.body.location, function (err, data) {
          if (err || !data.length) {
               console.log(err);
               return res.redirect('back');
          }
          var lat = data[0].latitude;
          var lng = data[0].longitude;
          var location = data[0].formattedAddress;
          var newMap = { location: location, lat: lat, lng: lng }
          MapApi.create(newMap, (err, data) => {
               if (err) {
                    console.log(err)
                    res.send('error');
               } else {
                    console.log(data);
                    res.redirect('/maps/' + data._id);
               }
          });
     });
});

//Show Specific Map
router.get('/maps/:id', (req, res) => {
     MapApi.findById(req.params.id, (err, foundMap) => {
          if (err) {
               console.log(err);
               res.redirect('back');
          } else {
               res.render("show", { mapsGoogle: foundMap });
          }
     })
})

//Edit Map
router.get("/maps/:id/edit", (req, res) => {
     MapApi.findById(req.params.id, (err, foundMap) => {
          if (err) {
               res.redirect('back');
          } else {
               res.render("edit", { mapsGoogle: foundMap });
          }
     });
});

//Update Map
router.put("/maps/:id", (req, res) => {
     geocoder.geocode(req.body.location, (err, data) => {
          if (err || !data.length) {
               console.log(err);
               return res.redirect('back');
          }
          req.body.lat = data[0].latitude;
          req.body.lng = data[0].longitude;
          req.body.location = data[0].formattedAddress;
          var updetedMap = {
               location: req.body.location,
               lat: req.body.lat,
               lng: req.body.lng
          }
          MapApi.findByIdAndUpdate(req.params.id, updetedMap, (err, updetedData) => {
               if (err) {
                    res.redirect("back");
               } else {
                    res.redirect("/maps/" + req.params.id);
               }
          });
     });
});

//Delete Map
router.delete("/maps/:id", (req, res) => {
     MapApi.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
               res.redirect("/maps")
          } else {
               res.redirect("/maps")
          }
     })
})


module.exports = router;