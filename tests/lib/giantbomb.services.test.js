"use strict";

import test from 'ava';

var sinon = require('sinon');
var querystring = require('querystring');
var giantbombapi = require('../../lib/giantbomb');
var GiantBombAPI;
var mockSendRequest;
var singleNamedServices;
var pluralNamedServices;
var mockId;
var mockOptions;
var mockCallback;

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

test.before('Set up GiantBombAPI', it => {
    var mockConfig = {
        apiKey: '12345abc',
	userAgent: 'Example User Agent'
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

    var generateServices = function(serviceNames) {
        var namedServices = serviceNames.map(function(serviceName){
            return 'get' + capitalizeNames(serviceName);
        });

        return namedServices;
    }

    // Convert resources to service names
    singleNamedServices = generateServices(singleNamedResources);
    pluralNamedServices = generateServices(pluralNamedResources);
});

test.before('Mock options and callback for service calls', it => {
    mockId = '12345';

    mockOptions = {
        resources: 'game',
        field_list: 'name,deck,platforms',
        resource_type: 'game'
    };

    mockCallback = function(){

    };
});

test('throws error if id not passed for single resources', it => {
    singleNamedServices.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service]();
        }, 'Single named resource calls (ex: game, person, user_review) must be passed an ID');
    });
});

test('throws error if options not passed as object', it => {
    singleNamedServices.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service](mockId);
        }, 'Options must be passed as object');
    });
    pluralNamedServices.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service]();
        }, 'Options must be passed as object');
    });
});

test('throws error if callback not passed as function', it=> {
    singleNamedServices.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service](mockId, mockOptions);
        }, 'Callback must be passed as function');
    });
    pluralNamedServices.forEach(function(service){
        it.throws(function(){
            GiantBombAPI[service](mockOptions);
        }, 'Callback must be passed as function');
    });
});

test.before('stub send request service', it => {
    mockSendRequest = sinon.stub(GiantBombAPI, 'sendRequest');
});

test('call internal send request function', it => {
    singleNamedServices.forEach(function(service){
        GiantBombAPI[service](mockId, mockOptions, mockCallback);
    });

    pluralNamedServices.forEach(function(service){
        GiantBombAPI[service](mockOptions, mockCallback);
    });

    it.deepEqual(mockSendRequest.callCount, singleNamedServices.length + pluralNamedServices.length);
});

test('provide their resource path when calling send request function', it => {
    singleNamedServices.forEach(function(service, index){
        GiantBombAPI[service](mockId, mockOptions, mockCallback);
        it.deepEqual(mockSendRequest.lastCall.args[0], singleNamedResources[index] + '/' + mockId + '/');
    });

    pluralNamedServices.forEach(function(service, index){
        GiantBombAPI[service](mockOptions, mockCallback);
        it.deepEqual(mockSendRequest.lastCall.args[0], pluralNamedResources[index] + '/');
    });
});

test('serialize options into a query string when calling send request function', it => {
    var mockQueryString = querystring.stringify(mockOptions);

    singleNamedServices.forEach(function(service){
        GiantBombAPI[service](mockId, mockOptions, mockCallback);

        it.deepEqual(mockSendRequest.lastCall.args[1], mockQueryString);
    });

    pluralNamedServices.forEach(function(service){
        GiantBombAPI[service](mockOptions, mockCallback);

        it.deepEqual(mockSendRequest.lastCall.args[1], mockQueryString);
    });
});
