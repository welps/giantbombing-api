"use strict";

// NodeJS API Wrapper for GiantBomb API
var request = require('request');
var querystring = require('querystring');

var GiantBombAPI = function(config){
    verifyConfig(config);
    createSingleNamedServices();
    createPluralNamedServices();

    this.apiKey = config.apiKey;
    this.userAgent = config.userAgent;    
};

var verifyConfig = function(config){
    if (typeof config !== 'object'){
        throw new Error('Configuration must be passed as an object');
    }

    if (typeof config.apiKey === 'undefined' || typeof config.apiKey !== 'string'){
        throw new Error('Invalid or missing API key');
    }

    if(typeof config.userAgent === 'undefined' || typeof config.userAgent !== 'string'){
        throw new Error('Invalid or missing User-Agent');
    }
};

// Giant Bomb's API contains both singular and plural named resources 
// so we'll have to treat them separately and differently
var createSingleNamedServices = function(){
    var singleNamedResources = [
        'accessory',
        'character',
        'chat',
        'company',
        'concept',
        'franchise',
        'game',
        'game_rating',
        'genre',
        'location',
        'object',
        'person',
        'platform',
        'promo',
        'rating_board',
        'region',
        'release',
        'review',
        'theme',
        'user_review',
        'video',
        'video_type'
    ];

    var serviceName;

    singleNamedResources.forEach(function(resource){
        serviceName = 'get' + capitalizeNames(resource);

        GiantBombAPI.prototype[serviceName] = function(id, options, callback){
            verifyId(id);
            verifyOptions(options);
            verifyCallback(callback);

            var resourcePath = resource + '/' + id + '/';
            var optionsQuery = parseOptions(options);

            this.sendRequest(resourcePath, optionsQuery, callback);
        }
    });
}

// Giant Bomb's API contains both singular and plural named resources 
// so we'll have to treat them separately and differently
var createPluralNamedServices = function(){
    var pluralNamedResources = [
        'accessories',
        'characters',
        'chats',
        'companies',
        'concepts',
        'franchises',
        'games',
        'game_ratings',
        'genres',
        'locations',
        'objects',
        'people',
        'platforms',
        'promos',
        'rating_boards',
        'regions',
        'releases',
        'reviews',
        'search',
        'themes',
        'types',
        'user_reviews',
        'videos',
        'video_types'
    ];

    var serviceName;

    pluralNamedResources.forEach(function(resource){
        serviceName = 'get' + capitalizeNames(resource);

        GiantBombAPI.prototype[serviceName] = function(options, callback){
            verifyOptions(options);
            verifyCallback(callback);

            var resourcePath = resource + '/';
            
            var optionsQuery = parseOptions(options);

            this.sendRequest(resourcePath, optionsQuery, callback);
        }
    });
};

var capitalizeNames = function(names){
    var capitalizedNames = names.split('_').map(function(name){
        return name.charAt(0).toUpperCase() + name.substr(1);
    });

    return capitalizedNames.join('');
};

var verifyOptions = function(options){
    if (typeof options !== 'object'){
        throw new Error('Options must be passed as object');
    }
};

var verifyCallback = function(callback){
    if (typeof callback !== 'function'){
        throw new Error('Callback must be passed as function');
    }
};

var verifyId = function(id){
    if (!id) {
        throw new Error('Single named resource calls (ex: game, person, user_review) must be passed an ID');
    }
}

var parseOptions = function(options) {
    // Filter and sort options have nested properties so we'll handle them differently
    var filter = '', sort = '';

    if (options.filter) {
        filter = '&filter=' + querystring.stringify(options.filter, ',', ':');
        delete options.filter;
    }

    if (options.sort) {
        sort = '&sort=' + querystring.stringify(options.sort, ',', ':');
		delete options.sort;
    }

    var optionsQuery = querystring.stringify(options) + filter + sort;
    return optionsQuery;
}

GiantBombAPI.prototype.sendRequest = function(resourcePath, optionsQuery, callback){
    var baseURL = 'https://www.giantbomb.com/api/';

    var requestCallback = function(err, res, body) {
        // Appending http_status codes to response
        try {
            body = JSON.parse(body);
            body.http_status = res.statusCode;

            if (!err && res.statusCode == 200) {
                return callback(null, body);
            }

            err = body;
        }
        // If we can't parse it, it's not JSON so we'll just return the http status code
        catch(syntaxError) {
            err = {'http_status': res.statusCode};
        }

        callback(err);
    }

    var url = baseURL + resourcePath + '?api_key=' + this.apiKey + '&format=json&' + optionsQuery;
    var config = {
        url: url,
        headers: {
            'User-Agent': this.userAgent
        }
    };
    
    request(config, requestCallback);
};

module.exports = GiantBombAPI;