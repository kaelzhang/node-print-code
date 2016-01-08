'use strict';

var expect = require('chai').expect;
var code = require('../');

var fs = require('fs')
var file = require.resolve('..')
var content = fs.readFileSync(file)

code(content)
  .highlight(7)
  .slice(3, 11)
  .max_columns(78)
  .arrow_mark(7, 20)
  .print()
