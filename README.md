# cf-dedupe-list-aggregator

Dedupe version of cf-list-aggregator

## Installation

      npm install --save cf-dedupe-list-aggregator

## Usage

```js
var aggregate = createDedupeAggregator(listService, sectionService, articleService, { logger: logger })

aggregate(listId, dedupe, limit, section, function (err, results) {})
```

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
