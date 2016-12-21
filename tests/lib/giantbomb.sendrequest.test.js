"use strict";

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
var mockErrorResponse;
var mockErrorBody;
var mockResponse;
var mockBody;

test.before('Set up GiantBombAPI', it => {
    var mockConfig = {
        apiKey: '12345abc',
	userAgent: 'Example User Agent'
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

    var regex = new RegExp(mockResourcePath, 'g');
    it.regex(mockRequest.firstCall.args[0].url, regex);
});

test('passes query to request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    var regex = new RegExp(mockOptionsQuery, 'g');
    it.regex(mockRequest.firstCall.args[0].url, regex);
});

test('passes user-agent to request method', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    it.is(mockRequest.firstCall.args[0].headers['User-Agent'], 'Example User Agent');
});

test.before('Mock parameters for mocked request callback', it => {
    mockResponse = {statusCode: 200};
    mockBody = JSON.stringify({mockItem: 'Mock Item'});

    mockSuccessfulRequestCallback = function(){
        mockRequest.lastCall.args[1](null, mockResponse, mockBody);
    };

    mockError = 'Mock Error';
    mockErrorResponse = {statusCode: 404};
    mockErrorBody = "<p> 404 page not found </p>"; 

    mockFailedRequestCallback = function(){
        mockRequest.lastCall.args[1](mockError, mockErrorResponse, mockErrorBody);
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

    var returnBody = {};
    returnBody.mockItem = JSON.parse(mockBody).mockItem;
    returnBody.http_status = mockResponse.statusCode;

    it.deepEqual(null, mockCallback.lastCall.args[0]);
    it.is('object', typeof mockCallback.lastCall.args[1]);
    it.deepEqual(returnBody, mockCallback.lastCall.args[1]);
});

test('callback returns error upon failed request', it => {
    GiantBombAPI.sendRequest(mockResourcePath, mockOptionsQuery, mockCallback);

    var returnBody = {};
    returnBody.http_status = mockErrorResponse.statusCode;

    mockFailedRequestCallback();
    it.deepEqual(returnBody, mockCallback.lastCall.args[0]);
});
