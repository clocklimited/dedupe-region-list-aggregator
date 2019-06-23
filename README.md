# dedupe-region-list-aggregator

[![Greenkeeper badge](https://badges.greenkeeper.io/clocklimited/dedupe-region-list-aggregator.svg)](https://greenkeeper.io/)

Dedupe version of dedupe-region-list-aggregator

## Installation

      npm install --save dedupe-region-list-aggregator

## Usage

```js
var aggregate = createDedupeAggregator(listService, sectionService, articleService, { logger: logger })

aggregate(listId, dedupe, limit, section, function (err, results) {})
```

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
