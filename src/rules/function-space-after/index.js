import {
  isWhitespace,
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "function-space-after"

export const messages = ruleMessages(ruleName, {
  expected: "Expected single space after \")\"",
  rejected: "Unexpected whitespace after \")\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      styleSearch({ source: value, target: ")" }, match => {
        checkClosingParen(value, match.startIndex, decl)
      })
    })

    function checkClosingParen(source, index, node) {
      const nextChar = source[index + 1]
      if (expectation === "always") {
        // Allow for the next character to be a single empty space,
        // another closing parenthesis, a comma, or the end of the value
        if (nextChar === " " && !isWhitespace(source[index + 2])) { return }
        if ([ ")", ",", undefined ].indexOf(nextChar) !== -1) { return }
        report({
          message: messages.expected,
          node: node,
          result,
          ruleName,
        })
      } else if (expectation === "never") {
        if (isWhitespace(nextChar)) {
          report({
            message: messages.rejected,
            node: node,
            result,
            ruleName,
          })
        }
      }
    }
  }
}
