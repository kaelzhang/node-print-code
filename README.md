[![Build Status](https://travis-ci.org/kaelzhang/node-print-code.svg?branch=master)](https://travis-ci.org/kaelzhang/node-print-code)
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/print-code.svg)](http://badge.fury.io/js/print-code)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/print-code.svg)](https://www.npmjs.org/package/print-code)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-print-code.svg)](https://david-dm.org/kaelzhang/node-print-code)
-->

# print-code

Print visualized slice of code from its content, line and column for CLI.

## Install

```sh
$ npm install print-code --save
```

## Usage

```js
var code = require('print-code');
code(content)
  .slice(10, 14)
  .max_columns(78)
  .highlight(12)
  .arrow_mark(12, column)
  .print()
```

#### .slice([from] [, to])

Specify which lines should be printed.

- **from** `Number=` The line number begins to be printed, and the value will be `parseInt()`ed. If not specified, it will print all lines. If 
- **to** `Number=` If not specified, it will only print the line of `from`

```js
code(content).slice().print();       // print all code
code(content).slice(10).print();     // print line 10
code(content).slice(10, 20).print(); // print lines from [10, 20)
```

Special cases:

```js
code(content).slice(-1, 10).print(); // will print lines from [0, 10)
code(content).slice(0, -1).print();  // will print lines except for the last line.
code(content).slice(10, 9);          // will only print line 10
code(content).slice(10, 11);         // will print line 10
```

#### .highlight(line [, ...])

Specify which line number(s) should be highlighted.

- line `Number` The number of code line, starts from `1`

#### .max_columns(max)

Limit the max columns to be printed.

- max `Number=` default to the max columns of the current terminal.

#### .arrow_mark(line, column)

Set a mark, and draw an arrow mark to the target coordinate (line, column).

#### .get()

Get the formated result content.

#### .print()

`console.log` the formated result content.

## License

MIT
