import test from 'ava';

var sinon = require('sinon');
var giantbombapi = require('../../lib/giantbomb');
var GiantBombAPI;

var mockSendRequest;
var resources;
var services;
var mockOptions;
var mockCallback;

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

test.before('Set up mock options and callback for service calls', it => {
    mockOptions = {

    };

    mockCallback = function(){

    };
});

test('throws error if options not passed as object', it => {
    services.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service]();
        }, 'Options must be passed as object');
    });
});

test('throws error if callback not passed as function', it=> {
    services.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service](mockOptions);
        }, 'Callback must be passed as function');
    });
});

test.before('stub send request service', it => {
    mockSendRequest = sinon.stub(GiantBombAPI, 'sendRequest');
});

test('call internal send request function', it => {
    services.forEach(function(service){
        GiantBombAPI[service](mockOptions, mockCallback);
    });

    it.same(mockSendRequest.callCount, services.length);
});

test('provide their resource path when calling send request function', it => {
    services.forEach(function(service, index){
        GiantBombAPI[service](mockOptions, mockCallback);

        it.same(mockSendRequest.lastCall.args[0], resources[index] + '/');
    });
});


