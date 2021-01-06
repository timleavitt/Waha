import i18n from 'i18n-js'
import {
  getSystemFont,
  getSystemIsRTL,
  languages,
  scaleMultiplier
} from '../constants'

const lineSpacingByFont = {
  roboto: 5,
  tajawal: 7
}

const lineSpacingBySystemLanguage = {
  en: 5,
  ar: 7
}

export function StandardTypography (
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
    color: color,
    lineHeight: sizes[fontSize] + lineSpacingByFont[props.font]
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

  if (isHeader) {
    return {
      fontFamily: overrideFont
        ? overrideFont + '-' + fontFamily
        : getSystemFont() + '-' + fontFamily,
      textAlign: alignments[textAlign],
      color: color
    }
  } else {
    return {
      fontSize: sizes[fontSize],
      fontFamily: overrideFont
        ? overrideFont + '-' + fontFamily
        : getSystemFont() + '-' + fontFamily,
      textAlign: alignments[textAlign],
      color: color,
      lineHeight: lineSpacingBySystemLanguage[i18n.locale.slice(0, 2)]
        ? sizes[fontSize] + lineSpacingBySystemLanguage[i18n.locale.slice(0, 2)]
        : null
    }
  }
}
