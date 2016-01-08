'use strict';

module.exports = code
code.Code = Code
code.generate = generate

var chalk = require('chalk')
var set = require('set-options')
var make_array = require('make-array')


function code (content) {
  return new Code(content)
}


function Code (content) {
  this.codes = content
    .split('\n')
    .map(
      (code, index) => {
        code: code,
        index: index
      }
    )
  this.options = {}
}


Code.prototype.get = function() {
  this._clean_options()

  var lines = this.codes
  var options = this.options

  if (options.slice) {
    lines = lines.slice.apply(lines, options.slice)
  }

  return lines.map(function (line) {
    return this._format_line(line.index, line.code)
  }.bind(this))
}


var DEFAULT_COLOR_PALETTE = {
  highlight_no: function (str) {
    return chalk.red(str)
  }
}

Code.prototype._clean_options = function() {
  this.options.colors = set(this.options.colors, DEFAULT_COLOR_PALETTE)
}


Code.prototype._format_line = function(no, content) {
  var options = this.options
  var max_columns = options.max_columns || process.stdout.columns - 1
  var length = content.length

  var max_content_columns = max_columns === -1
    ? length
    // 5: line no
    // 1: |
    // 1: whitespace  
    : max_columns - 7

  // if there is no mark, only manage and slice line string
  if (!options.mark) {
    content = this._slice_content(content, 0, max_content_columns)
    return this._format_components(no, content)
  }

  
}


function whitespaces (n, joiner) {
  return Array(n + 1).join(joiner || ' ')
}

// format cleaned components
Code.prototype._format_components = function(no, content, mark) {
  var no_length = ('' + no).length

  mark = mark
    ? '\n' + mark
    : ''

  // spaces
  return whitespaces(5 - no_length)
    + this._format_line_no(no)
    + '| '
    + content
    + mark
}


// @param {Number} caret 
Code.prototype._draw_caret = function(caret, column) {
  return whitespaces(7 + caret, '-') 
    + '^  '
    + 'column: ' + column
}


// format line number
Code.prototype._format_line_no = function(no) {
  var highlight = this.options.highlight

  if (!highlight || !~highlight.indexOf(no)) {
    return no
  }

  return this.options.colors.highlight_no(no)
}


// slice line string and manage ellipsis
// @param {Number} exp_length The expected length of the result
Code.prototype._slice_content = function(content, start, exp_length) {
  var length = content.length
  var slice_length = exp_length
  var result = 'n'

  if (start > 0) {

    // ...(whitespace)
    slice_length -= 4
    result = '... ' + result
  }

  if (start + exp_length > length) {
    slice_length -= 4
    result += ' ...'
  }

  return result.replace('n', content.substr(start, slice_length))
}


Code.prototype.print = function() {
  this.print_line()
  this._output('\n')
}


Code.prototype.print_line = function() {
  this._output(this.get())
}


Code.prototype._output = function(message) {
  process.stdout.write(message)
}


Code.prototype.highlight = function() {
  this.options.highlight = (this.options.highlight || [])
    .concat(make_array(arguments))
  return this
}


Code.prototype.max_columns = function(max) {
  this.options.max_columns = max
  return this
}


Code.prototype.slice = function() {
  this.options.slice = arguments

  return this
}


Code.prototype.mark = function(line, column) {
  var mark
  if (column >= 0 && column <= this.lines[line].length - 1) {
    mark = {
      line: line,
      column: column
    }
  }

  this.options.mark = mark

  return this
}
