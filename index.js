'use strict';

module.exports = code
code.Code = Code

var chalk = require('chalk')
var set = require('set-options')
var make_array = require('make-array')

/////////////////////////////////////////////////////////////////////////////////////////////
function code (content) {
  return new Code(String(content))
}


function Code (content) {
  this.codes = content
    .split('\n')
    .map(function (code, index) {
      return {
        code: code,
        index: index
      }
    })

  this.options = {}
}


Code.prototype.get = function() {
  this._clean_options()

  var lines = this.codes
  var options = this.options

  if (options.slice) {
    lines = lines.slice.apply(lines, options.slice)
  }

  return lines
    .map(function (line) {
      return this._format_line(line.index, line.code)
    }.bind(this))
    .join('\n')
}


var DEFAULT_COLOR_PALETTE = {
  highlight_no: function (str) {
    return chalk.red(str)
  }
}

// ...(whitespace)
var ELLIPSIS_LENGTH = 4
// 5: line no
// 1: |
// 1: whitespace
var LINE_NO_SPAN_LENGTH = 7
var MAX_NO_LENGTH = 5

Code.prototype._clean_options = function() {
  this.options.colors = set(this.options.colors, DEFAULT_COLOR_PALETTE)
}


Code.prototype._format_line = function(no, content) {
  var options = this.options
  var max_columns = options.max_columns || process.stdout.columns - 1
  var length = content.length

  var max_content_columns = max_columns === -1
    ? length
    : max_columns - LINE_NO_SPAN_LENGTH

  var mark = options.mark

  // if there is no mark, only manage and slice line string
  if (!mark || mark.line !== no) {
    content = this._slice_content(content, 0, max_content_columns)
    return this._format_components(no, content)
  }

  var mark_column = mark.column
  var offset = parseInt(max_content_columns / 2)
  var start = Math.max(0, mark_column - offset)
  var caret_pos = start === 0
    ? mark_column
    : mark_column - offset

  var mark_string = this._draw_caret(caret_pos, mark_column)

  content = this._slice_content(content, 0, max_content_columns)
  return this._format_components(no, content, mark_string)
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
  return whitespaces(MAX_NO_LENGTH - no_length)
    + this._format_line_no(no)
    + '| '
    + content
    + mark
}


// @param {Number} caret 
Code.prototype._draw_caret = function(caret, column) {
  return whitespaces(LINE_NO_SPAN_LENGTH + caret, '-')
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

  function slice () {
    return result.replace('n', content.substr(start, slice_length))
  }

  if (length < exp_length) {
    return slice()
  }

  if (start > 0) {

    // ...(whitespace)
    slice_length -= ELLIPSIS_LENGTH
    result = '... ' + result
  }

  if (start + exp_length > length) {
    slice_length -= ELLIPSIS_LENGTH
    result += ' ...'
  }

  return slice()
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


Code.prototype.arrow_mark = function(line, column) {
  var mark

  if (column >= 0
    && this.codes[line]
    && column <= this.codes[line].code.length - 1
  ) {
    mark = {
      line: line,
      column: column
    }
  }

  this.options.mark = mark

  return this
}
