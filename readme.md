```javascript
var rs = require('require-shield')(
    {
        mode: 'white-list'
    }
);
rs.allow('^stream|string_decoder$').for('^sax$');
rs.trust('^stream|string_decoder$');
```

## What this is
* A simple tool to control which modules can be loaded and by which modules
* It gives you peace of mind when using third party modules
* It eases you of the burden of reviewing and understanding the implementation of other modules

## Installation
This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 9.4 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install require-shield
```

## Arguments (`configuration`)
### configuration: `mode`
* `white-list`: Default. All modules are prohibited from loading any module unless explicitly allowed.
* `black-list`: All modules are allowed to load any other module unless explicitly denied.

```js
var rs = require('require-shield')(
    {
        mode: 'black-list'
    }
);
```

## Methods
### `allow`
### `deny`