import * as ScreenOrientation from 'expo-screen-orientation'
import i18n from 'i18n-js'
import { Dimensions, PixelRatio } from 'react-native'
import { languages } from './languages'

/**
 * This file contains a bunch of constants and a few miscellaneous functions that are used globally throughout Waha.
 */

/** Set the max font scaling allowed. This is based on the system font scaling that the user sets in their phone's accessibility settings. We limit it so that the text in the app isn't allowed scale above 1.2 times normal size, which would not be good for the UI. */
const fontScale =
  PixelRatio.getFontScale() >= 1.2 ? 1.2 : PixelRatio.getFontScale()

/** If the font scaling is larger than 1, we need to increase the heights of a few components to be able to fit the larger text. This variable acts as a multiplier for the height of those components. */
const heightScaleModifier = 1 + (fontScale - 1) / 2

/**
 * This object stores the heights of a few specific components in Waha that react particularly badly to large font scaling. We need to declare the height of these dynamically, otherwise the text would never fit between a variety of fonts and font scaling. We have separate heights for each font in Waha as well as adding the heightScaleModifier we declared earlier.
 * @export
 * */
export const itemHeights = {
  Roboto: {
    LessonItem: 60 * heightScaleModifier,
    SetItem: 95 * heightScaleModifier
  },
  NotoSansArabic: {
    LessonItem: 83 * heightScaleModifier,
    SetItem: 108 * heightScaleModifier
  }
}

/**
 * This variable stores a multiplier value that we use to scale the dimensions of components throughout the app. It's based on the size of the phone screen. Basically, it shrinks components on smaller phones so that we're able to fit everything we need to on the screen.
 * @export
 * */
export const scaleMultiplier =
  Dimensions.get('window').width > 400
    ? 1
    : Dimensions.get('window').width / 400

/**
 * This object stores the default group names for every language instance. Upon installing a language instance, a group is automatically created with the corresponding group name below.
 * @export
 * */
export const groupNames = {
  en: 'Group 1',
  ga: 'المجموعة الأولى',
  ar: 'المجموعة الأولى',
  te: 'Group 1',
  tt: 'Group 2'
}

/**
 * Gets whether the current system language is right-to-left or not.
 * @export
 * @return {boolean} - Whether the current system is RTL.
 */
export function getSystemIsRTL () {
  systemIsRTL = false
  languages.forEach(languageFamily => {
    if (i18n.locale.slice(0, 2) === languageFamily.languageCode) {
      systemIsRTL = languageFamily.isRTL
    }
  })
  return systemIsRTL
}

/**
 * Gives information about a lesson based off its ID.
 * @export
 * @param {string} type - The type of information you want to get. Possible options are:
 * 1. "language": The ID of the language instance that this lesson is a part of.
 * 2. "index": The number of this lesson within a set.
 * 3. "setID": The ID of the set that the lesson is a part of.
 * 4. "subtitle": The ID of the lesson without the language ID in it, which is displayed below the lesson title on the Lessons screen.
 * 5. "category": The tab of the set thats this lesson is a part of.
 * 6. "audioSource": The URL for the lesson's Story chapter mp3 if it has one.
 * 7. "videoSource": The URL for the lesson's Training chapter mp4 if it has one.
 * @param {string} lessonID - The ID of the lesson that you want information for.
 * @return {*} - The information you want about the lesson.
 */
export function getLessonInfo (type, lessonID) {
  // Split the ID up into separate sections.
  var idComponents = lessonID.split('.')

  // An example lessonID is "en.1.1.1".
  switch (type) {
    case 'language':
      return idComponents[0]
      break
    case 'index':
      return parseInt(idComponents[3])
      break
    case 'setID':
      return idComponents[0] + '.' + idComponents[1] + '.' + idComponents[2]
      break
    case 'subtitle':
      return idComponents[1] + '.' + idComponents[2] + '.' + idComponents[3]
      break
    case 'category':
      switch (idComponents[1]) {
        case '1':
          return 'Foundational'
          break
        case '2':
          return 'Topical'
          break
        case '3':
          return 'MobilizationTools'
          break
      }
      break
    case 'audioSource':
      return `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${
        idComponents[0]
      }%2Fsets%2F${idComponents[1] +
        '.' +
        idComponents[2]}%2F${lessonID}.mp3?alt=media`
      break
    case 'videoSource':
      return `https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/${
        idComponents[0]
      }%2Fsets%2F${idComponents[1] + '.' + idComponents[2]}%2F${lessonID +
        'v'}.mp4?alt=media`
      break
  }
}

/**
 * Gives information about a set based off its ID.
 * @export
 * @param {string} type - The type of information you want to get. Possible options are:
 * 1. "language": The ID of the language instance that this set is a part of.
 * 2. "index": The number of this set within its category.
 * 3. "setID": The ID of the set that the lesson is a part of.
 * 4. "category": The category (or tab) that this set is a part of.
 * @param {string} setID - The ID of the set that you want information for.
 * @return {*} - The information you want about the set.
 */
export function getSetInfo (type, setID) {
  // Split the ID up into separate sections.
  var idComponents = setID.split('.')

  // An example setID is "en.1.1".
  switch (type) {
    case 'language':
      return idComponents[0]
      break
    case 'index':
      return parseInt(idComponents[2])
      break
    case 'category':
      switch (idComponents[1]) {
        case '1':
          return 'Foundational'
          break
        case '2':
          return 'Topical'
          break
        case '3':
          return 'MobilizationTools'
          break
      }
      break
  }
}

/**
 * Locks Waha's orientation to portrait. If it's available, it locks to "PORTRAIT", which allows for regular and upside-down portrait. If it's not, it locks to "PORTRAIT_UP", which allows only regular portrait. Upside-down portrait generally isn't supported on phones with notches.
 * @export
 * @param {function} thenFunction - A function to call after the orientation lock finishes.
 */
export function lockPortrait (thenFunction) {
  ScreenOrientation.supportsOrientationLockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT
  ).then(isSupported => {
    if (isSupported) {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      ).then(() => {
        thenFunction()
      })
    } else {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).then(() => {
        thenFunction()
      })
    }
  })
}

/**
 * Locks Waha's orientation to landscape.
 * @export
 */
export function lockLandscape () {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
}
