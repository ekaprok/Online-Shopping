var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');

router.get('/:name', function(req, res, next) { // First, search a name of the category we typed in
    async.waterfall([ // runs in sequence
      function(callback) { // find a category
        Category.findOne({ name: req.params.name }, function(err, category) {
          if (err) return next(err); // one it's found, the document passes a callback
          callback(null, category);
        });
      },
      // use this category to generate products
      function(category, callback) {

          var product = new Product();
          product.category = category._id; // id of the name that you typed in (:name)
          product.name = "Cooler 1";
          product.price = 15;
          product.image = 'http://www.dickssportinggoods.com/graphics/product_images/pDSP1-9962609v750.jpg';

          product.save();

          var product = new Product();
          product.category = category._id; // id of the name that you typed in (:name)
          product.name = "Cooler 2";
          product.price = 15;
          product.image = 'http://www.dickssportinggoods.com/graphics/product_images/pDSP1-9962609v750.jpg';

          product.save();

          var product = new Product();
          product.category = category._id; // id of the name that you typed in (:name)
          product.name = "Cooler 3";
          product.price = 15;
          product.image = 'http://www.dickssportinggoods.com/graphics/product_images/pDSP1-9962609v750.jpg';

          product.save();

          var product = new Product();
          product.category = category._id; // id of the name that you typed in (:name)
          product.name = "Cooler 4";
          product.price = 15;
          product.image = 'http://www.dickssportinggoods.com/graphics/product_images/pDSP1-9962609v750.jpg';

          product.save();

          var product = new Product();
          product.category = category._id; // id of the name that you typed in (:name)
          product.name = "Cooler 5";
          product.price = 15;
          product.image = 'http://www.dickssportinggoods.com/graphics/product_images/pDSP1-9962609v750.jpg';

          product.save();

          var product = new Product();
          product.category = category._id; // id of the name that you typed in (:name)
          product.name = "Cooler 6";
          product.price = 15;
          product.image = 'http://www.dickssportinggoods.com/graphics/product_images/pDSP1-9962609v750.jpg';

          product.save();
      }
    ]);
    res.json({ message: 'Success' });
});

module.exports = router;
