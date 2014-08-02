var express = require('express'),
    app = express(),
    util = require('util'),
    twitter = require('twitter'),
    fs = require('fs'),
    twitterAPI = null,
    KEYS_FILE = __dirname + '/keys.json';

/** ===============================================
  INIT KEYS AND APIs
=============================================== */
var configJSON = require(KEYS_FILE);
twitterAPI = new twitter(configJSON.twitter);

/** ===============================================
  ROUTING
=============================================== */
app.get('/', function(req, res) {
  res.sendfile('static/index.html');
});

app.get('/api', function(req, res) {
  var tags = req.query.tags.join(' OR ');
  console.log('TAGS', tags);
  twitterAPI.search(tags, function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.use(express.static(__dirname + '/static'));

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});