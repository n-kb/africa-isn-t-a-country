"use strict";

var countries = require('./public/assets/countries.json')
    , http = require('http')
    , mongoose = require('mongoose')
    , Evt = require('./evt_model.js');

// Constructor
function weeklyCount() {

    var startdate;

    var guardianURL = "";
    var guardianURL_Africa = "";
    var guardianURL_Asia = "";
    var guardianTotal = -1;
    var guardianTotal_Africa = -1;
    var guardianTotal_Asia = -1;

    var nytURL = "";
    var nytURL_Africa = "";
    var nytURL_Asia = "";
    var nytTotal = -1;
    var nytTotal_Africa = -1;
    var nytTotal_Asia = -1;

    this.setStartDate = function (d) {
    	startdate = d;
    	scrape();
    }

    var setGuardianTotal = function (v) {
        guardianTotal = v;
        console.log("guardianTotal: " + guardianTotal);

        if (v == -1) {
            setTimeout(function(){callGuardian(guardianURL, setGuardianTotal)}, 1000);
        }

        checkScrape();
    };

    var setGuardianTotal_Africa = function (v) {
        guardianTotal_Africa = v;
        console.log("guardianTotal_Africa: " + guardianTotal_Africa);

        if (v == -1) {
            setTimeout(function(){callGuardian(guardianURL_Africa, setGuardianTotal_Africa)}, 2000);
        }

        checkScrape();
    };

    var setGuardianTotal_Asia = function (v) {
        guardianTotal_Asia = v;
        console.log("guardianTotal_Asia: " + guardianTotal_Asia);

        if (v == -1) {
            setTimeout(function(){callGuardian(guardianURL_Asia, setGuardianTotal_Asia)}, 3000);
        }

        checkScrape();
    };

    var setNYTTotal = function (v) {
        nytTotal = v;
        console.log("nytTotal: " + nytTotal);

        if (v == -1) {
            setTimeout(function(){callNYT(nytURL, setNYTTotal)}, 1000);
        }

        checkScrape();
    };

    var setNYTTotal_Africa = function (v) {
        nytTotal_Africa = v;
        console.log("nytTotal_Africa: " + nytTotal_Africa);

        if (v == -1) {
            setTimeout(function(){callNYT(nytURL_Africa, setNYTTotal_Africa)}, 2000);
        }

        checkScrape();
    };

    var setNYTTotal_Asia = function (v) {
        nytTotal_Asia = v;
        console.log("nytTotal_Asia: " + nytTotal_Asia);

        if (v == -1) {
            setTimeout(function(){callNYT(nytURL_Asia, setNYTTotal_Asia)}, 3000);
        }

        checkScrape();
    };

    //Checks that all has been properly scraped
    var checkScrape = function () {
        if (guardianTotal != -1 && guardianTotal_Asia != -1 && guardianTotal_Africa != -1) {
            console.log("store");
            store();
        }
    };

    var store = function () {

        var new_evt_Guardian = new Evt({

            brand: "The Guardian",
            startdate: startdate,
            amount_Africa: guardianTotal_Africa,
            proportion_Africa: guardianTotal_Africa / guardianTotal,
            amount_Asia: guardianTotal_Asia,
            proportion_Asia: guardianTotal_Asia / guardianTotal

        });

        var new_evt_NYT = new Evt({

            brand: "The New-York Times",
            startdate: startdate,
            amount_Africa: nytTotal_Africa,
            proportion_Africa: nytTotal_Africa / nytTotal,
            amount_Asia: nytTotal_Asia,
            proportion_Asia: nytTotal_Asia / nytTotal

        });

        //Removes any record on the same date and saves
        Evt.find({ brand:"The Guardian", startdate:startdate }).remove(function(error) {
                new_evt_Guardian.save(function (err) {
                    if (!err) {
                        console.log("created");
                    } else {
                        console.log(err);
                    }
                });
            });

        Evt.find({ brand:"The New-York Times", startdate:startdate }).remove(function(error){
            new_evt_NYT.save(function (err) {
                if (!err) {
                    console.log("created");
                } else {
                    console.log(err);
                }
            });
        });

    };

    var scrape = function () {

        makeURLs();

        //Activates the actual scraping function
        setTimeout(function(){callGuardian(guardianURL, setGuardianTotal)}, 1000);
        setTimeout(function(){callGuardian(guardianURL_Africa, setGuardianTotal_Africa)}, 2000);
        setTimeout(function(){callGuardian(guardianURL_Asia, setGuardianTotal_Asia)}, 3000);

        setTimeout(function(){callNYT(nytURL, setNYTTotal)}, 1000);
        setTimeout(function(){callNYT(nytURL_Africa, setNYTTotal_Africa)}, 2000);
        setTimeout(function(){callNYT(nytURL_Asia, setNYTTotal_Asia)}, 3000);

    };

    var callNYT = function (url, callback) {
        if (nytTotal == -1 || nytTotal_Asia == -1 || nytTotal_Africa == -1) {
            http.get(url, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {

                    try {
                        var response = JSON.parse(body);

                        var total = response.response.meta.hits;

                        callback(total);
                    } catch (e) {
                        console.log("Got error: ", e);
                        callback(-1);
                    }
                });
            }).on('error', function (e) {
                console.log("Got error: ", e);
            });
        }
    }

    var callGuardian = function (url, callback) {
        if (guardianTotal == -1 || guardianTotal_Asia == -1 || guardianTotal_Africa == -1) {
            http.get(url, function (res) {
                var body = '';

                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {

                    try {
                        var response = JSON.parse(body);

                        var total = response.response.total;

                        callback(total);
                    } catch (e) {
                        console.log("Got error: ", e);
                        callback(-1);
                    }
                });
            }).on('error', function (e) {
                console.log("Got error: ", e);
            });
        }
    };

    var makeURLs = function () {

        // Lists all countries by continent
        var countries_Africa = listCountries("Africa"),
            countries_Asia = listCountries("Asia");

        // Makes URL for the NYT
        nytURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?page=1&sort=newest&api-key=83da110e8682225eb39a3cb9a2264268:6:61350733"

        // Adds date limits
        nytURL = nytURL + "&begin_date=" + startdate.format("YYYYMMDD") + "&end_date="+startdate.add('days', 7).format("YYYYMMDD");

        // Makes URL for API call to Guardian
        guardianURL = "http://content.guardianapis.com/search?";

        // Adds date limits
        guardianURL = guardianURL + "from-date=" + startdate.format("YYYY-MM-DD") + "&to-date=" + startdate.add('days', 7).format("YYYY-MM-DD");

        // Adds countries
        guardianURL_Africa = guardianURL + "&q=Africa%20";
        nytURL_Africa = nytURL + "&q=Africa%20";

        for (var i in countries_Africa) {
            guardianURL_Africa = guardianURL_Africa + "-%22" + escape(countries_Africa[i]) + "%22%20";
            nytURL_Africa = nytURL_Africa + "-%22" + escape(countries_Africa[i]) + "%22%20";
        }

        guardianURL_Asia = guardianURL + "&q=Asia%20";
        nytURL_Asia = nytURL + "&q=Asia%20";

        for (var i in countries_Asia) {
            guardianURL_Asia = guardianURL_Asia + "-%22" + escape(countries_Asia[i]) + "%22%20";
            nytURL_Asia = nytURL_Asia + "-%22" + escape(countries_Asia[i]) + "%22%20";
        }

    };

    //Parses the country file by continent
    var listCountries = function (continent) {

        var countries_continent = [];

        for (var i in countries) {

            if (countries[i].region == continent) {
                countries_continent.push(countries[i].name)
            }

        }

        return countries_continent;

    }
}

// export the class
module.exports = weeklyCount;