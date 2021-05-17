# Romo JS

A JS toolkit.

## Usage

TODO

## Installation

```
$ yarn install @reddingjs/romo-js
```

## Linting

Install [l.rb](https://github.com/redding/l.rb#lrb).

Install dev packages: `yarn install`.

```
$ l

OR

$ yarn lint

OR

$ ./bin/lint
```

## Testing

* Install Ruby version in .ruby-version file
* `cd test && bundle && cd ..`

```
$ yarn test

OR

$ ./bin/test
```

The starts a Rack app and loads up the main system_tests.html test file. Look for red 'X' items, check the console for errors, test out the example UI on the DOM Component pages.
