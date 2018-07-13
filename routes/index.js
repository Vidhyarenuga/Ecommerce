var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
//var stripe =require('stripe')('sk_test_aXtpT95Pbp4hWMXg4zN2Y8P2');
/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', {
      title: 'Shopping Cart',
      products: productChunks,
      successMsg: successMsg
    });
  });

});
router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});
router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});
router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});
router.get('/shopping-cart',isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});
router.get('/charge',function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart =new Cart(req.session.cart);
  res.render('shop/signin',{products: cart.generateArray(), email: email});
})
router.post('/charge', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  //var amount=160;
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_aXtpT95Pbp4hWMXg4zN2Y8P2");
   
  stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount: cart.totalPrice * 100,
        description: 'Ecommerce',
        currency: 'usd',
        customer: customer.id
      },
      function (err,charge) {
        if (err) {
          return res.redirect('/shopping-cart');
        }
        var order = new Order({
          user : req.user,
          //email:req.body.email,
         // email: signin.email,
          cart: cart,
          //name: charge.name,
          paymentId: charge.id
        });
        //console.log(order);
        order.save(function (err,result) {
          //req.flash( 'Successfully bought product');
          req.session.cart = null;
          res.redirect('/');
          
        });
        
      }
    ))


});

module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/user/signin');
}