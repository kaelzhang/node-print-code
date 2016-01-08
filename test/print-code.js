'use strict';

var expect = require('chai').expect;
var code = require('../');

var fs = require('fs')
var file = require.resolve('..')
var content = fs.readFileSync(file)

code(content)
  .highlight(10, 11)
  .slice(1, 12)
  .max_columns(68)
  .arrow_mark(11, 70)
  .print()
