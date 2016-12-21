[![Build Status](https://travis-ci.org/welps/giantbombing-api.svg?branch=master)](https://travis-ci.org/welps/giantbombing-api)

# GiantBomb API Wrapper
A NodeJS wrapper for the GiantBomb API. You can use the GiantBomb API to find birth dates of your waifus, peruse their vast collection of game data, or find out which videos Vinny's in.

## Installation 
` npm install giantbombing-api`

## Get started

### Setup 
```
const GiantBombAPI = require('giantbombing-api');
const config = {
    apiKey: 'Your GiantBomb API code here',
    userAgent: 'A User Agent or Name to Identify This Script'
};
const giantBombAPI = new GiantBombAPI(config);
```

The wrapper maps directly to each of [GiantBomb's Resources](http://www.giantbomb.com/api/documentation) with 'get' as a prefix for the method.

### Using the wrapper for singular resources (game, video):

```
giantBombAPI.getGame(id, options, callback)
giantBombAPI.getVideo(id, options, callback)
```

| parameters | type     | details                                                                            |
|------------|----------|------------------------------------------------------------------------------------|
| id         | string   | the id of the resource                                                             |
| config     | object   | maps directly to each options set provided by the GiantBomb API                    |
| callback   | function | your callback function should expect (error, response) and handle them accordingly |

### Using the wrapper for plural resources (games, videos):

```
giantBombAPI.getGames(id, options, callback)
giantBombAPI.getVideos(id, options, callback)
```

| parameters | type     | details                                                                            |
|------------|----------|------------------------------------------------------------------------------------|
| config     | object   | maps directly to each options set provided by the GiantBomb API                    |
| callback   | function | your callback function should expect (error, response) and handle them accordingly |

## Example:

If you want to search through the GiantBomb catalog for 'Metroid Prime 3', you'd do the following:

```
let options = {
    field_list: 'name,id',
    query: 'Metroid Prime 3: Corruption',
    resources: 'game',
    resource_type: 'game',
    limit: 20
};

giantBombAPI.getSearch(options, function(err, res) {
    if (err) {
        return console.log(err);
    }
    console.log(res);
});
```

A working example with multiple use cases can be found within [example/app.js](https://github.com/welps/giantbombing-api/blob/master/example/app.js) 

If you fill out your API key in `example/app.js`, you can run it by typing `npm run example`
