var request = require('request');

var GiantBombAPI = function(config){
    this.verifyConfig(config);
    this.createServices();

    this.apiKey = config.apiKey;
    this.useCache = config.useCache || false;
    this.cacheOptions = config.cacheOptions || undefined;
};

GiantBombAPI.prototype.verifyConfig = function(config){
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

GiantBombAPI.prototype.createServices = function(){
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

        GiantBombAPI.prototype[serviceName] = function(){
            var resourcePath = resource + '/';

            this.sendRequest(resourcePath, 'blah', 'blah');
        }
    });

};

GiantBombAPI.prototype.sendRequest = function(){
    //var baseURL = 'https://www.giantbomb.com/api';
    //
    //request( baseURL + '/search/?api_key=' + this.apiKey + '&format=json&query=Punch%20Club&resources=game&field_list=name,deck,platforms', function (err, res, body) {
    //    if (!err && res.statusCode == 200) {
    //        var data;
    //        data = JSON.parse(body);
    //        console.log(data);
    //    }
    //});
};

var capitalizeNames = function(names){
    var capitalizedNames = names.split('_').map(function(name){
        return name.charAt(0).toUpperCase() + name.substr(1);
    });

    return capitalizedNames.join('');
};

module.exports = GiantBombAPI;