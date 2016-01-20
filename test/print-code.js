'use strict';

var expect = require('chai').expect;
var code = require('../');

var fs = require('fs')
var file = require.resolve('..')
var content = fs.readFileSync(file)

code(content)
  .highlight(4)
  .slice(1, 6)
  .max_columns(68)
  .arrow_mark(4, 10)
  .print()
