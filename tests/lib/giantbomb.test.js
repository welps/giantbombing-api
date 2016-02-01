import test from 'ava';

var giantbombapi = require('../../lib/giantbomb');
var GiantBombAPI;

var GiantBombFactory = function (config){
    return function(){
        return new giantbombapi(config);
    };
}

test('throws error if not passed config as an object', it => {
    it.throws(GiantBombFactory(), 'Configuration must be passed as an object');
});

test('throws error if not passed API key as a string', it => {
    it.throws(GiantBombFactory({}), 'Invalid or missing API key');
    it.throws(GiantBombFactory({apiKey: 12345}), 'Invalid or missing API key');
});

test('has an api key', it => {
    GiantBombAPI = GiantBombFactory({apiKey: '12345abc'})();
    it.same(GiantBombAPI.apiKey, '12345abc');
});
