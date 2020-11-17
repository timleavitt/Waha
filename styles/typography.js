import i18n from 'i18n-js'
import {
  getSystemFont,
  getSystemIsRTL,
  languages,
  scaleMultiplier
} from '../constants'

export function BrandTypography (
  props,
  fontSize,
  fontFamily,
  textAlign,
  color
) {
  const families = {
    regular: props.font + '-regular',
    medium: props.font + '-medium',
    black: props.font + '-black'
  }

  const sizes = {
    d: 12 * scaleMultiplier,
    p: 14 * scaleMultiplier,
    h4: 16 * scaleMultiplier,
    h3: 18 * scaleMultiplier,
    h2: 24 * scaleMultiplier,
    h1: 36 * scaleMultiplier
  }

  const alignments = {
    left: props.isRTL ? 'right' : 'left',
    center: 'center'
  }

  return {
    fontSize: sizes[fontSize],
    fontFamily: props.font ? families[fontFamily] : null,
    textAlign: alignments[textAlign],
    color: color
  }
}

export function SystemTypography (
  isHeader,
  fontSize,
  fontFamily,
  textAlign,
  color,
  overrideFont
) {
  const sizes = {
    d: 12 * scaleMultiplier,
    p: 14 * scaleMultiplier,
    h4: 16 * scaleMultiplier,
    h3: 18 * scaleMultiplier,
    h2: 24 * scaleMultiplier,
    h1: 36 * scaleMultiplier
  }

  languages.forEach(languageFamily => {
    if (i18n.locale.slice(0, 2) === languageFamily.languageCode) {
      defaultFont = languageFamily.font
      defaultIsRTL = languageFamily.isRTL
    }
  })

  const alignments = {
    left: getSystemIsRTL() ? 'right' : 'left',
    center: 'center'
  }

  return {
    fontSize: isHeader ? null : sizes[fontSize],
    fontFamily: overrideFont
      ? overrideFont + '-' + fontFamily
      : getSystemFont() + '-' + fontFamily,
    textAlign: alignments[textAlign],
    color: color
  }
}
