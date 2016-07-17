var request = require('request');
var querystring = require('querystring');

var GiantBombAPI = function(config){
    verifyConfig(config);
    createServices();

    this.apiKey = config.apiKey;    
};

var verifyConfig = function(config){
    if (typeof config !== 'object'){
        throw new Error('Configuration must be passed as an object');
    }

    if (typeof config.apiKey === 'undefined' || typeof config.apiKey !== 'string'){
        throw new Error('Invalid or missing API key');
    }
};

var createServices = function(){
    var resources = [
        'accessory',
        'accessories',
        'character',
        'characters',
        'chat',
        'chats',
        'company',
        'companies',
        'concept',
        'concepts',
        'franchise',
        'franchises',
        'game',
        'games',
        'game_rating',
        'game_ratings',
        'genre',
        'genres',
        'location',
        'locations',
        'object',
        'objects',
        'person',
        'people',
        'platform',
        'platforms',
        'promo',
        'promos',
        'rating_board',
        'rating_boards',
        'region',
        'regions',
        'release',
        'releases',
        'review',
        'reviews',
        'search',
        'theme',
        'themes',
        'types',
        'user_review',
        'user_reviews',
        'video',
        'videos',
        'video_type',
        'video_types'
    ];

    var serviceName;

    resources.forEach(function(resource){
        serviceName = 'get' + capitalizeNames(resource);

        GiantBombAPI.prototype[serviceName] = function(options, callback){
            var resourcePath = resource + '/';

            verifyOptions(options);
            verifyCallback(callback);

            var optionsQuery = querystring.stringify(options);
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

GiantBombAPI.prototype.sendRequest = function(resourcePath, optionsQuery, callback){
    var baseURL = 'https://www.giantbomb.com/api/';

    var requestCallback = function(err, res, body) {
        if (!err && res.statusCode == 200) {
            var data = JSON.parse(body);
            callback(null, data);
        }
        else {
            // Appending http_status codes since GiantBombAPI returns their own status codes too
            try {
                body = JSON.parse(body);
                body.http_status = res.statusCode;
                err = body;
            }
            // If we can't parse it, it's not JSON
            catch(syntaxError) {
                err = {'http_status': res.statusCode};
            }

            callback(err);
        }
    }

    request(baseURL + resourcePath + '?api_key=' + this.apiKey + '&format=json&' + optionsQuery, requestCallback);
};


module.exports = GiantBombAPI;