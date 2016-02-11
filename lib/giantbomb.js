var request = require('request');

var GiantBombAPI = function(config){
    this.verifyConfig(config);

    this.apiKey = config.apiKey;
    this.useCache = config.useCache || undefined;
    this.cacheOptions = config.cacheOptions || undefined;
};

GiantBombAPI.prototype.verifyConfig = function(config){
    if (typeof config !== 'object'){
        throw new Error('Configuration must be passed as an object');
    }

    if (typeof config.apiKey === 'undefined' || typeof config.apiKey !== 'string'){
        throw new Error('Invalid or missing API key');
    }

    if (typeof config.cacheOptions !== 'undefined' && typeof config.cacheOptions !== 'object'){
        throw new Error('Cache options must be passed as an object');
    }

    if ((typeof config.useCache === 'undefined' || config.useCache === false) && typeof config.cacheOptions === 'object'){
        throw new Error('useCache must be true if using cache options');
    }
};

GiantBombAPI.prototype.sendRequest = function(){
    var baseURL = 'https://www.giantbomb.com/api';

    request( baseURL + '/search/?api_key=' + this.apiKey + '&format=json&query=Punch%20Club&resources=game&field_list=name,deck,platforms', function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var data;
            data = JSON.parse(body);
            console.log(data);
        }
    });
};

module.exports = GiantBombAPI;