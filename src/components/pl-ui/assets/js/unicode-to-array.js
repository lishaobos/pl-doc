const rsAstralRange = '\\ud800-\\udfff'
const rsZWJ = '\\u200d'
const rsVarRange = '\\ufe0e\\ufe0f'
const rsComboMarksRange = '\\u0300-\\u036f'
const reComboHalfMarksRange = '\\ufe20-\\ufe2f'
const rsComboSymbolsRange = '\\u20d0-\\u20ff'
const rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange
// eslint-disable-next-line no-misleading-character-class
const reHasUnicode = RegExp(`[${rsZWJ}${rsAstralRange}${rsComboRange}${rsVarRange}]`)

const rsFitz = '\\ud83c[\\udffb-\\udfff]'
const rsOptVar = `[${rsVarRange}]?`
const rsCombo = `[${rsComboRange}]`
const rsModifier = `(?:${rsCombo}|${rsFitz})`
const reOptMod = `${rsModifier}?`
const rsAstral = `[${rsAstralRange}]`
const rsNonAstral = `[^${rsAstralRange}]`
const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}'
const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]'
const rsOptJoin = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join('|')})${rsOptVar}${reOptMod})*`
const rsSeq = rsOptVar + reOptMod + rsOptJoin
const rsSymbol = `(?:${[`${rsNonAstral + rsCombo}?`, rsCombo, rsRegional, rsSurrPair, rsAstral].join('|')})`
const reUnicode = RegExp(`${rsFitz}(?=${rsFitz})|${rsSymbol}${rsSeq}`, 'g')

export const toArray = function(val) {
  return hasUnicode(val)
    ? unicodeToArray(val)
    : asciiToArray(val)
}

export const hasUnicode = function(val) {
  return reHasUnicode.test(val)
}

export const unicodeToArray = function(val) {
  return val.match(reUnicode) || []
}

export const asciiToArray = function(val) {
  return val.split('')
}
