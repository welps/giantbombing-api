var request = require('request');

var GiantBombAPI = function(config){
    this.verifyConfig(config);

    this.apiKey = config.apiKey,
};

GiantBombAPI.prototype.verifyConfig = function(config){
    if (typeof config !== 'object'){
        throw new Error('Configuration must be passed as an object');
    }

    if (typeof config.apiKey === undefined || typeof config.apiKey !== 'string'){
        throw new Error('Invalid or missing API key')
    }

}

module.exports = GiantBombAPI;