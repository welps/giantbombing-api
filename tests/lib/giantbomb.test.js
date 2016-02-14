import test from 'ava';

var sinon = require('sinon');
var giantbombapi = require('../../lib/giantbomb');
var GiantBombAPI;
var resources;
var services;

var GiantBombFactory = function (config){
    return function(){
        return new giantbombapi(config);
    };
};

test.before('Convert resources to service names', it => {

    var capitalizeNames = function(name){
        var capitalizedNames = name.split('_').map(function(name){
            return name.charAt(0).toUpperCase() + name.substr(1);
        });

        return capitalizedNames.join('');
    };

    // All of GiantBomb's resources
    resources = [
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

    // Convert resources to service names
    services = resources.map(function(resourceName){
        return 'get' + capitalizeNames(resourceName);
    });
});

test.before('Set up GiantBombAPI', it => {
    var mockConfig = {
        apiKey: '12345abc',
        useCache: true,
        cacheOptions: {
            host: 'localhost',
            port: 6379
        }
    };

    GiantBombAPI = GiantBombFactory(mockConfig)();
});

test('throws error if not passed config as an object', it => {
    it.throws(GiantBombFactory(), 'Configuration must be passed as an object');
});

test('throws error if not passed API key as a string', it => {
    it.throws(GiantBombFactory({}), 'Invalid or missing API key');
    it.throws(GiantBombFactory({apiKey: 12345}), 'Invalid or missing API key');
});

test('has an api key', it => {
    it.same(GiantBombAPI.apiKey, '12345abc');
});

test('throws error if not passed cacheOptions as an object', it => {
    var mockConfig = {
        apiKey: '12345abc',
        cacheOptions: 'Hello'
    };

    it.throws(GiantBombFactory(mockConfig), 'Cache options must be passed as an object');
});

test('throws error if useCache is not true/undef and passed cacheOptions', it => {
    var mockConfig = {
        apiKey: '1nocache',
        cacheOptions: {
            host: 'localhost',
            port: 6379
        }
    }
    it.throws(GiantBombFactory(mockConfig), 'useCache must be true if using cache options');

    mockConfig.useCache = false;
    it.throws(GiantBombFactory(mockConfig), 'useCache must be true if using cache options');
});

test('all services call internal send request function', it => {
    var giantBombSendRequest = sinon.spy(GiantBombAPI, 'sendRequest');

    services.forEach(function(service){
        GiantBombAPI[service]('foo', 'bar');
    });

    it.same(giantBombSendRequest.callCount, services.length);
});