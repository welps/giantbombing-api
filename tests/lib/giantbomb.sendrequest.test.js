import test from 'ava';

var sinon = require('sinon');
var rewire = require('rewire');
var giantbombapi = rewire('../../lib/giantbomb');
var GiantBombAPI;

var mockResourcePath;
var mockOptionsQuery;
var mockCallback;
var requestMock;

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


test.before('Mock request dependency', it => {
    requestMock = sinon.stub();

    giantbombapi.__set__('request', requestMock);
});

test.before('Set up mock parameters for sendRequest calls', it => {
    mockResourcePath = 'games/';
    mockOptionsQuery = '&query=Punch%20Club&resources=game&field_list=name,deck,platforms';

    mockCallback = function(){

    };
});

test('calls request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    it.true(requestMock.calledOnce);
});

test('passes resource path to request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    // not yet in ava - see a10b9e8bab1544fbb966f80beacb7b7e43ff0d24
    //it.regex(requestMock.firstCall.args[0], mockOptionsQuery);

});

test('passes query to request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    // not yet in ava - see a10b9e8bab1544fbb966f80beacb7b7e43ff0d24
    //it.regex(requestMock.firstCall.args[0], mockOptionsQuery);
});