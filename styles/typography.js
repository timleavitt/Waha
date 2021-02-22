import i18n from 'i18n-js'
import { getSystemIsRTL, scaleMultiplier } from '../constants'
import { languages } from '../languages'

/**
 * Takes in some text style settings and returns a filled out text style object. This is used simply to save space in components and simplify things overall. Used within the style prop of a text component. For example:
 * <Text style={StandardTypography(
 *  props,
 *  'p',
 *  'Regular',
 *  'left',
 *  colors.shark
 * )}/>
 * @export
 * @param {Object} props - The props from the component that calls this function. Notably includes the font name for the active group and whether the active group's language is RTL.
 * @param {string} fontSize - The size of the font. Can be "d" (for detail), "p" (for paragraph), "h4" (for header 4), "h3" (for header 3), "h2" (for header 2), or "h1" (for header 1).
 * @param {string} fontFamily - The family, or weight, of the font. Can be "Regular", "Bold", or "Black".
 * @param {string} textAlign - The alignment of the text. Can be "center" which aligns text center or "left" which aligns text left or right depending on whether we need to be RTL.
 * @param {string} color - The color of the font. Can be any color for the colors object in ./colors.js.
 * @return {Object} - The completed style object.
 */
export function StandardTypography (
  props,
  fontSize,
  fontFamily,
  textAlign,
  color
) {
  // A font size modifier that makes all Arabic script a point smaller.
  const fontSizeModifier = props.font === 'NotoSansArabic' ? -1 : 0

  // The options for font families.
  const families = {
    Regular: props.font + '-Regular',
    Bold: props.font + '-Bold',
    Black: props.font + '-Black'
  }

  // The options for font sizes.
  const sizes = {
    d: 12 * scaleMultiplier,
    p: 14 * scaleMultiplier,
    h4: 16 * scaleMultiplier,
    h3: 18 * scaleMultiplier,
    h2: 24 * scaleMultiplier,
    h1: 36 * scaleMultiplier
  }

  // The options for font alignments.
  const alignments = {
    left: props.isRTL ? 'right' : 'left',
    center: 'center'
  }

  // Return the completed style object.
  return {
    fontSize: sizes[fontSize] + fontSizeModifier,
    fontFamily: props.font ? families[fontFamily] : null,
    textAlign: alignments[textAlign],
    color: color
  }
}

/**
 * Similar to the StandardTypography function, except this is used with the system language, not the language of the active group. It's used on screens where no active group has yet been declared, or when we just want to use the system language. As an example, on the language select screen, we haven't declared an active group yet, so we need to display the system language in the font that goes with that language. In that case, we'd use this function to style any text on that screen.
 * @export
 * @param {boolean} isHeader - Whether this style object will be used for a header or not.
 * @param {string} fontSize - The size of the font. Can be "d" (for detail), "p" (for paragraph), "h4" (for header 4), "h3" (for header 3), "h2" (for header 2), or "h1" (for header 1).
 * @param {string} fontFamily - The family, or weight, of the font. Can be "Regular", "Bold", or "Black".
 * @param {string} textAlign - The alignment of the text. Can be "center" which aligns text center or "left" which aligns text left or right depending on whether we need to be RTL.
 * @param {string} color - The color of the font. Can be any color for the colors object in ./colors.js.
 * @param {string} overrideFont - If we want to override the system language font with the active group's language's font, we can include this parameter.
 * @return {Object} - The completed style object.
 */
export function SystemTypography (
  isHeader,
  fontSize,
  fontFamily,
  textAlign,
  color,
  overrideFont
) {
  // The options for font sizes.
  const sizes = {
    d: 12 * scaleMultiplier,
    p: 14 * scaleMultiplier,
    h4: 16 * scaleMultiplier,
    h3: 18 * scaleMultiplier,
    h2: 24 * scaleMultiplier,
    h1: 36 * scaleMultiplier
  }

  // The options for alignments.
  const alignments = {
    left: getSystemIsRTL() ? 'right' : 'left',
    center: 'center'
  }

  // If the text style is for a header, we don't want to set a text size, as the react navigation library does that for us.
  if (isHeader) {
    return {
      // If we have an override font, use that instead of the system font.
      fontFamily: overrideFont
        ? overrideFont + '-' + fontFamily
        : getSystemFont() + '-' + fontFamily,
      textAlign: alignments[textAlign],
      color: color
    }
  } else {
    return {
      fontSize: sizes[fontSize],
      // If we have an override font, use that instead of the system font.
      fontFamily: overrideFont
        ? overrideFont + '-' + fontFamily
        : getSystemFont() + '-' + fontFamily,
      textAlign: alignments[textAlign],
      color: color
    }
  }
}

/**
 * Get the font used for whatever language the user's phone is set to. If the system is not included in the languages object declared in languages.js, the font defaults to Roboto. For example, if the user has the English language instance installed but their phone is set to Arabic, this function will return the name of the font used for Arabic.
 * @export
 * @return {string} - The name of the font to use.
 */
export function getSystemFont () {
  var systemFont = 'Roboto'
  languages.forEach(languageFamily => {
    if (i18n.locale.slice(0, 2) === languageFamily.languageCode) {
      systemFont = languageFamily.font
    }
  })
  return systemFont
}

/**
 * Get the font used for whatever language is associated with the active group. For example, if the user has the English language instance installed but their phone is set to Arabic, this function will return the name of the font used for English.
 * @export
 * @return {string} - The name of the font to use.
 */
export function getLanguageFont (languageID) {
  var languageFont
  languages.forEach(languageFamily => {
    if (languageFamily.data.some(language => language.wahaID === languageID))
      languageFont = languageFamily.font
  })
  return languageFont
}
