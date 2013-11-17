/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment');

var weeklyCount = require('./weeklyCount.js'),
    Evt = require('./evt_model.js');

var app = module.exports = express.createServer();

// Database
var mongo_URI = process.env['MONGOLAB_URI'] || 'mongodb://localhost:27017/africa';
console.log(mongo_URI);
var db = mongoose.connect(mongo_URI);

var port = process.env.PORT || 3000;

// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// API


//GET evts
//Retrieves records from the media orgs

app.get('/api/evts', function (req, res) {

    if (req.query.startdate != undefined) {
        //parses the date
        startdate = moment(req.query.startdate, ["DD-MM-YYYY"]);
    } else {
        startdate = moment().subtract('days', 7);
    }

    if (startdate.format("ddd") == "Sun") {
        var currentWeek = new weeklyCount;
        currentWeek.setStartDate(startdate);

        return res.send({
            "status": "scrape initiated"
        });

    } else {

        return res.send({
            "status": "Come back on Sunday"
        });
    }

});

app.get('/api/data', function (req, res) {

    return Evt.find({}).sort('startdate').limit(20).exec(function (err, evt) {
        if (!err) {
            return res.send(evt);
        } else {
            return res.send(err);
        }
    });

});


app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});