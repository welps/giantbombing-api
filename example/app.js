"use strict";

// Examples on how to use the GiantBomb API Wrapper
const GiantBombAPI = require('../lib/giantbomb');
const config = {
    apiKey: 'Your GiantBomb API code here',
    userAgent: 'A User Agent to Identify This Script'
};
const giantBombAPI = new GiantBombAPI(config);

// Example 1 - We want to search through GiantBomb's catalog for Metroid Prime 3 and its game ID
let options = {
    field_list: 'name,id',
    query: 'Metroid Prime 3: Corruption',
    resources: 'game',
    resource_type: 'game',
    limit: 20
};

giantBombAPI.getSearch(options, function(err, res) {
    if (err) {
        return console.log(err);
    }
    console.log(res);
});


// Example 2 - We want the name, deck (a short desc), and platforms 'Metroid Prime 3' is on
options = {
    field_list: 'name,deck,platforms',
};

giantBombAPI.getGame('4725', options, function(err, res) {
    if (err) {
        return console.log(err);
    }
    console.log(res);
});


// Example 3 - We want to find Unprofessional Fridays videos, sorted by publish date
options = {
    sort: {
        publish_date: 'desc'
    },
    filter: {
        name: 'Unprofessional Fridays'
    },
    limit: 10
}

giantBombAPI.getVideos(options, function(err, res) {
    if (err) {
        return console.log(err);
    }
    console.log(res);
});


