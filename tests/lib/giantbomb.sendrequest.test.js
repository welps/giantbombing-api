import test from 'ava';

var sinon = require('sinon');
var rewire = require('rewire');
var giantbombapi = rewire('../../lib/giantbomb');
var GiantBombAPI;

var mockResourcePath;
var mockOptionsQuery;
var mockCallback;
var mockRequest;
var mockSuccessfulRequestCallback;
var mockFailedRequestCallback;

var mockError;
var mockResponse;
var mockBody;

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
    mockRequest = sinon.stub();

    giantbombapi.__set__('request', mockRequest);
});

test.before('Mock parameters for sendRequest calls', it => {
    mockResourcePath = 'games/';
    mockOptionsQuery = '&query=Punch%20Club&resources=game&field_list=name,deck,platforms';
    mockCallback = sinon.stub();
});

test('calls request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);
    it.true(mockRequest.calledOnce);
});

test('passes resource path to request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    // not yet in ava - see a10b9e8bab1544fbb966f80beacb7b7e43ff0d24
    //it.regex(mockRequest.firstCall.args[0], mockOptionsQuery);

});

test('passes query to request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    // not yet in ava - see a10b9e8bab1544fbb966f80beacb7b7e43ff0d24
    //it.regex(mockRequest.firstCall.args[0], mockOptionsQuery);
});

test.before('Mock parameters for mocked request callback', it => {
    mockError = 'Mock error';
    mockResponse = {statusCode: 200};
    mockBody = JSON.stringify({mockItem: 'Mock Item'});

    mockSuccessfulRequestCallback = function(){
        mockRequest.lastCall.args[1](null, mockResponse, mockBody);
    };

    mockFailedRequestCallback = function(){
        mockRequest.lastCall.args[1](mockError, mockResponse);
    };
});

test('callback is passed to request method and called', it=> {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    mockSuccessfulRequestCallback();

    it.true(mockCallback.called);
});

test('callback returns null error and an object upon successful request', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    mockSuccessfulRequestCallback();

    it.same(null, mockCallback.lastCall.args[0]);
    it.is('object', typeof mockCallback.lastCall.args[1]);
});

test('callback returns error upon failed request', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    mockFailedRequestCallback();

    it.same('Mock error', mockCallback.lastCall.args[0]);
});
