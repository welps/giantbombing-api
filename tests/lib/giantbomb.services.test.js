import test from 'ava';

var sinon = require('sinon');
var giantbombapi = require('../../lib/giantbomb');
var GiantBombAPI;

var mockSendRequest;
var resources;
var services;

test.before('Set up GiantBombAPI', it => {
    var mockConfig = {
        apiKey: '12345abc',
        useCache: true,
        cacheOptions: {
            host: 'localhost',
            port: 6379
        }
    };

    GiantBombAPI = new giantbombapi(mockConfig);
});

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

test.before('stub send request service', it => {
    mockSendRequest = sinon.stub(GiantBombAPI, 'sendRequest');
});

test('all services call internal send request function', it => {
    services.forEach(function(service){
        GiantBombAPI[service]();
    });

    it.same(mockSendRequest.callCount, services.length);
});

test('all services provide their resource path when calling send request function', it => {
    for (var i = 0; i < services.length; i++){
        GiantBombAPI[services[i]]();

        it.same(mockSendRequest.lastCall.args[0], resources[i] + '/');
    }
});

