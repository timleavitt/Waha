import i18n from 'i18n-js'
import { getSystemIsRTL, scaleMultiplier } from '../constants'
import { languages } from '../languages'

export function StandardTypography (
  props,
  fontSize,
  fontFamily,
  textAlign,
  color
) {
  const fontSizeModifier = props.font === 'NotoSansArabic' ? -1 : 0

  const families = {
    Regular: props.font + '-Regular',
    Bold: props.font + '-Bold',
    Black: props.font + '-Black'
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
    fontSize: sizes[fontSize] + fontSizeModifier,
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
      color: color
    }
  }
}

export function getSystemFont () {
  systemFont = 'Roboto'
  languages.forEach(languageFamily => {
    if (i18n.locale.slice(0, 2) === languageFamily.languageCode) {
      systemFont = languageFamily.font
    }
  })
  return systemFont
}

export function getLanguageFont (languageID) {
  var languageFont
  languages.forEach(languageFamily => {
    if (languageFamily.data.some(language => language.wahaID === languageID))
      languageFont = languageFamily.font
  })
  return languageFont
}
