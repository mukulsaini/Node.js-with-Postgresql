var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

// ConnectionString is for connection -> username : postgres, password -> root123, database -> happiness
// You have to change it according to your password and username
var connectionString =  'postgres://postgres:root123@localhost:5433/happiness';

var url = require('url');

// When the user clicks Ok button after entering name and email to generate random coupon code

router.post('/generate', function(req, res) {
 
	var couponCode = Math.floor((Math.random()* (9999- 1000) + 1000));

  var data = {name: req.body.name, email: req.body.email, couponCode: couponCode};
  console.log(data);
  return res.json(data);

});


// ---------- When the user clicks on order button to isert into orders table and set coupon code to redeemed 

router.get('/placeorder', function(req, res) {

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var data = {name: req.query.username, orderId: req.query.orderId, amount: req.query.amount};
	var results = []; 

	pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

		var quesry = client.query("SELECT * FROM Customer where name='"+data.name+"'");

		quesry.on('row', function(row) {

        	client.query("INSERT INTO orders(order_id, order_amount, customerid) values($1, $2, $3);", [data.orderId, data.amount, parseInt(row.id)]);
        	client.query("UPDATE Coupon SET status = 'redeemed' where customerid ="+parseInt(row.id) );

       });

        var query = client.query("SELECT * FROM orders");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});


// --------- When the user clicks on share button -------------

router.post('/share', function(req, res) {

	 var results = [];

  	var data = {name: req.body.name, email: req.body.email, couponCode: req.body.couponCode};
 
     pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query("INSERT INTO Customer(name, email_id) values($1, $2);", [data.name, data.email]);

        var query = client.query("SELECT * FROM Customer where name='"+data.name+"'");

		    query.on('row', function(row) {
        	client.query("INSERT INTO Coupon(code_id, status, CustomerId) values($1, $2, $3);", [data.couponCode, 'NEW', parseInt(row.id)]);
        });

        var query = client.query("SELECT * FROM Coupon ORDER BY code_id ASC");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

module.exports = router;
