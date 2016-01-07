'use strict';

module.exports = code
code.Code = Code
code.generate = generate

const chalk = require('chalk')
const set = require('set-options')
const make_array = require('make-array')


// @param {Object} options
// - line: [from, to]
// - mark: []
// - highlight: []
function generate (content, options) {
  var lines = content.split('\n')
  

  

  var MAX_COLUMNS = options.column_max
  
  var message = 
    lines
    .slice(line_start, line_end)
    .map(function (line, index) {
      // line number
      var no = index + line_start
      var no_length = (no + '').length
      var mark = ''
      var column = matched.column
      var start = 0
      var length = line.length
      var end = length

      if (length > MAX_COLUMNS) {
        // If is the current line, 
        if (matched.line === no) {
          // at least, we should display `url(url)`
          //                              ----
          start = Math.max(0, matched.column - 4)
        } else {
          start = 0
        }

        end = Math.min(
          line.length,
          Math.max(
            matched.column + matched.match.length + 4,
            length
          )
        )
      }

      // Handle ellipsis
      end = Math.min(
        end,
        // ... url
        MAX_COLUMNS + start - (
            start === 0
              ? 0
              // ...(whitespace)
              : 4
          ) - (
            end === length
              ? 0
              : 4
          )
      )

      var caret = start === 0
        ? column
        // '... url('
        : 8

      var line_string = (
          start === 0
           ? ''
           : '... '
        ) 
      + line.slice(start, end)
      + (
          end === length
            ? ''
            : ' ...'
        )

      if (matched.line === no) {
        mark = '\n'
          // -------^
          // 5: line no
          // 1: |
          // 1: whitespace
          + Array(7 + 1 + caret).join('-') + '^  '
          + 'column: ' + column
      }

      
    })
    .join('\n')

  return message
}


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

  return lines.map(
      line => this._format_line(line.index, line.code)
    )
}


const DEFAULT_COLOR_PALETTE = {
  highlight_no: function (str) {
    return chalk.red(str)
  }
}

Code.prototype._clean_options = function() {
  this.options.colors = set(this.options.colors, DEFAULT_COLOR_PALETTE)
}


Code.prototype._format_line = function(no, content) {
  const options = this.options
  const max_columns = options.max_columns || process.stdout.columns - 1

  // 5: line no
  // 1: |
  // 1: whitespace  
  const max_content = max_columns - 7
  var length = content.length

  if (!options.mark) {
    
  }

  


}


function whitespaces (n) {
  return Array(n + 1).join(' ')
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


// format line number
Code.prototype._format_line_no = function(no) {
  var highlight = this.options.highlight

  if (!highlight || !~highlight.indexOf(no)) {
    return no
  }

  return this.options.colors.highlight_no(no)
}


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
