var express = require('express');
var bodyParser = require('body-parser');
var controllers = require('./controllers');
var cors = require('cors');
var app = express();
app.use(cors({origin: 'http://178.33.122.217:8000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/build', controllers.build_search_index);
app.get('/artists', controllers.artists_list);
app.get('/search', controllers.search);

console.log('App running on port 8002');
app.listen(8002);
