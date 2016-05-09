var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); 

// our db model
var Drink = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  res.render('index.html')
});


// simple route to show an HTML page
router.get('/first-page', function(req,res){
  res.render('index.html')
})

router.get('/drinks-diary', function(req,res){
 console.log('drinks-diary route') 
  res.render('drinks-diary.html')

})

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);


    // pull out the information from the req.body
    // var name = req.body.name;
    var location = req.body.location;
    var drinktype = req.body.drinktype;
    var brandname = req.body.brandname;
    var amount = req.body.amount;
    var unit = req.body.unit;
    var dollarspent = req.body.dollarspent;
    var timespent = req.body.timespent;
    var occasion = req.body.occasion;
    var drinkDate = req.body.drinkDate;
    var inebriation = req.body.inebriation;
    var drinkLocation = req.body.drinkLocation;
  


    // hold all this data in an object
    // this object should be structured the same way as your db model
    var drinkObj = {
      location: location,
      drinkLocation: drinkLocation,
      drinktype: drinktype,
      brandname: brandname,
      amount: amount,
      unit: unit,
      dollarspent: dollarspent,
      timespent: timespent,
      occasion: occasion,
      drinkDate: drinkDate,
      inebriation: inebriation
    };

      console.log('API CREATE drink object: ', drinkObj);




    // if there is no location, return an error
    if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

    // now, let's geocode the location
    geocoder.geocode(location, function (err,data) {


      // if we get an error, or don't have any results, respond back with error
      if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
        var error = {status:'ERROR', message: 'Error finding location'};
        return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
      }

      // else, let's pull put the lat lon from the results
      var lon = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;

      // now, let's add this to our animal object from above
      drinkObj.location = {
        geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
        name: data.results[0].formatted_address // the location name
      }





    // create a new animal model instance, passing in the object
    var drink = new Drink(drinkObj);

    // now, save that animal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    drink.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving drink'};
        return res.json(error);
      }

      console.log('saved a new drink!: ', data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        drink: data
      }

      return res.json(jsonData);

      })  
    }); 
});
// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the animal to get
//  * @param  {String} req.param('id'). The animalId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Drink.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that drink'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      drink: data
    }

    return res.json(jsonData);
  
  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Drink.find(function(err, data){
    // if err or no animals found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find drinks'};
      return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      drink: data
    } 

    res.json(data);

  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.param('id'). The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var location, drinktype, brandname, amount, unit, dollarspent, timespent, occasion; 

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.drinktype) {
      drinktype = req.body.drinktype;
      // add to object that holds updated data
      dataToUpdate['drinktype'] = drinktype;
    }
    if(req.body.brandname) {
      brandname = req.body.brandname;
      // add to object that holds updated data
      dataToUpdate['brandname'] = brandname;
    }
    if(req.body.amount) {
      amount = req.body.amount;
      // add to object that holds updated data
      dataToUpdate['amount'] = amount;
    }
    if(req.body.unit) {
      unit = req.body.unit;
      // add to object that holds updated data
      dataToUpdate['unit'] = unit;
    }
    if(req.body.dollarspent) {
      dollarspent = req.body.dollarspent;
      // add to object that holds updated data
      dataToUpdate['dollarspent'] = dollarspent;
    }

    if(req.body.timespent){
      timespent = req.body.timespent; // split string into array
      // add to object that holds updated data
      dataToUpdate['timespent'] = timespent;
    }
      if(req.body.occasion){
      occasion = req.body.occasion; // split string into array
      // add to object that holds updated data
      dataToUpdate['occasion'] = occasion;
    }
          if(req.body.inebriation){
      inebriation = req.body.inebriation; // split string into array
      // add to object that holds updated data
      dataToUpdate['inebriation'] = inebriation;
    }



    if(req.body.location) {
      location = req.body.location;
    }

    // if there is no location, return an error
    if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

    // now, let's geocode the location
    geocoder.geocode(location, function (err,data) {


      // if we get an error, or don't have any results, respond back with error
      if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
        var error = {status:'ERROR', message: 'Error finding location'};
        return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
      }

      // else, let's pull put the lat lon from the results
      var lon = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;

      // now, let's add this to our animal object from above
      dataToUpdate['location'] = {
        geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
        name: data.results[0].formatted_address // the location name
      }

      console.log('the data to update is ' + JSON.stringify(dataToUpdate));


    // now, update that animal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Drink.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating drink'};
        return res.json(error);
      }

      console.log('updated the drink!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: 'OK',
        drink: data
      }

      return res.json(jsonData);

    })

    });    
})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.param('id'). The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Drink.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that drink to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;