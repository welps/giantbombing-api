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


