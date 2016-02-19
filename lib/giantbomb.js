var request = require('request');
var querystring = require('querystring');

var GiantBombAPI = function(config){
    verifyConfig(config);
    createServices();

    this.apiKey = config.apiKey;
    this.useCache = config.useCache || false;
    this.cacheOptions = config.cacheOptions || undefined;
};

var verifyConfig = function(config){
    if (typeof config !== 'object'){
        throw new Error('Configuration must be passed as an object');
    }

    if (typeof config.apiKey === 'undefined' || typeof config.apiKey !== 'string'){
        throw new Error('Invalid or missing API key');
    }

    if (typeof config.cacheOptions !== 'undefined' && typeof config.cacheOptions !== 'object'){
        throw new Error('Cache options must be passed as an object');
    }

    if ((typeof config.useCache === 'undefined' || config.useCache === false) && typeof config.cacheOptions === 'object'){
        throw new Error('useCache must be true if using cache options');
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

    request(baseURL + resourcePath + '?api_key=' + this.apiKey + optionsQuery, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var data = JSON.parse(body);
            callback(null, data);
        }
        else {
            callback(err);
        }
    });
};

module.exports = GiantBombAPI;