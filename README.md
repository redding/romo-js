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

```
$ brew install lighttpd
```

Install [Lighttpd](https://www.lighttpd.net/) to host the local static test files.

```
$ cat test/support/lighttpd.conf.example > test/support/lighttpd.conf && vi test/support/lighttpd.conf
```

Copy the example Lighttpd conf file and modify with the local path to the romo-js repo.

```
$ yarn test

OR

$ ./bin/test
```

The (re)starts Lighttpd and loads up the main system_tests.html test file. Look for red 'X' items, check the console for errors, test out the example UI on the DOM Component pages.
