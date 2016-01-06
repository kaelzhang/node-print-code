'use strict';

module.exports = code
code.Code = Code


function code (content, options = {}) {
  return new Code(content, options)
}


function Code (content, options) {
  this.content = content
  this.options = options

  ['highlight', 'mark', 'line'].forEach(
    key => this[key](options[key])
  )
}


function format_exception (err, content, matched) {
  var lines = content.split('\n')
  var line_start = Math.max(0, matched.line - 3)
  var line_end = Math.min(lines.length, matched.line + 3)

  var message = 
    lines
    .slice(line_start, line_end)
    .map(function (line, index) {
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

      // spaces
      return Array(5 + 1 - no_length).join(' ')
        + no
        + '| '
        + line_string
        + mark
    })
    .join('\n')

  err.message = err.message + '\n\n' + message + '\n'
  return err
}


Code.prototype.get = function() {
  // body...
}


Code.prototype.print = function() {
  // body...
}


Code.prototype.print_line = function() {
  // body...
}


Code.prototype.highlight = function(first_argument) {
  return this
}


Code.prototype.line = function() {
  return this
}


Code.prototype.mark = function(line, column) {
  return this
}
