var express = require('express'),
    app = express(),
    util = require('util'),
    twitter = require('twitter'),
    fs = require('fs'),
    twitterAPI = null,
    keysFile = __dirname + '/keys.json';

/** ===============================================
  INIT KEYS AND APIs
=============================================== */
fs.readFile(keysFile, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
  data = JSON.parse(data);
  console.dir(data);
  twitterAPI = new twitter(data.twitter);
});

/** ===============================================
  ROUTING
=============================================== */
app.get('/', function(req, res) {
  res.sendfile('static/index.html');
});

app.get('/api', function(req, res) {
  twitterAPI.search('nodejs OR #node', function(data) {
    var data = util.inspect(data);
    console.log(util.inspect(data));
    res.send(data);
  });
});

app.use(express.static(__dirname + '/static'));

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});