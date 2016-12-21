"use strict";

import test from 'ava';

var sinon = require('sinon');
var giantbombapi = require('../../lib/giantbomb');
var GiantBombAPI;

var GiantBombFactory = function (config){
    return function(){
        return new giantbombapi(config);
    };
};

test.before('Set up GiantBombAPI', it => {
    var mockConfig = {
        apiKey: '12345abc',
	userAgent: 'Example User Agent'
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
    it.deepEqual(GiantBombAPI.apiKey, '12345abc');
});

