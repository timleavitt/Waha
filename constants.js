import * as ScreenOrientation from 'expo-screen-orientation'
import i18n from 'i18n-js'
import { Dimensions, PixelRatio } from 'react-native'
import { languages } from './languages'

const fontScale =
  PixelRatio.getFontScale() >= 1.2 ? 1.2 : PixelRatio.getFontScale()
const heightScaleModifier = 1 + (fontScale - 1) / 2

export const scaleMultiplier =
  Dimensions.get('window').width > 400
    ? 1
    : Dimensions.get('window').width / 400

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

export const groupNames = {
  en: 'Group 1',
  ga: 'المجموعة الأولى',
  te: 'Group 1',
  tt: 'Group 2'
}

export function getSystemIsRTL () {
  systemIsRTL = false
  languages.forEach(languageFamily => {
    if (i18n.locale.slice(0, 2) === languageFamily.languageCode) {
      systemIsRTL = languageFamily.isRTL
    }
  })
  return systemIsRTL
}

// get various information about a lesson based off its id
// this is neat :)
export function getLessonInfo (type, lessonID) {
  var idComponents = lessonID.split('.')

  switch (type) {
    // lesson ids are in format en.1.1.1
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
          return 'foundational'
          break
        case '2':
          return 'topical'
          break
        case '3':
          return 'mobilization tools'
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

// get various information about a set based off its id
export function getSetInfo (type, setID) {
  var idComponents = setID.split('.')

  switch (type) {
    // set ids are in format en.1.1
    case 'language':
      return idComponents[0]
      break
    case 'index':
      return parseInt(idComponents[2])
      break
    case 'category':
      switch (idComponents[1]) {
        case '1':
          return 'foundational'
          break
        case '2':
          return 'topical'
          break
        case '3':
          return 'mobilization tools'
          break
      }
      break
  }
}

export function lockPortrait (thenFunction) {
  ScreenOrientation.supportsOrientationLockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT
  ).then(isSupported => {
    if (isSupported) {
      console.log('locking portrait')
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      ).then(() => {
        thenFunction()
      })
    } else {
      console.log('locking portrait up')
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).then(() => {
        thenFunction()
      })
    }
  })
}

export function lockLandscape () {
  console.log('locking landscape')
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
}
