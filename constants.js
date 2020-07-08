import { Dimensions } from 'react-native'
import * as FileSystem from 'expo-file-system'
import i18n from 'i18n-js'

export const scaleMultiplier = Dimensions.get('window').width / 430

export const languageT2S = {
  en: require('./assets/languageT2S/en.mp3'),
  da: require('./assets/languageT2S/te.mp3'),
  english: require('./assets/languageT2S/en.mp3')
}

export const groupIcons = {}

export const languages = [
  {
    i18nName: 'english',
    languageCode: 'en',
    data: [
      {
        nativeName: 'English (Global)',
        wahaID: 'en',
        i18nName: 'englishGlobal',
        logoSource:
          'https://res.cloudinary.com/waha/image/upload/v1594243650/English/Discovering_God_eorblz.png'
      }
      // {
      //   nativeName: 'English (UK)',
      //   wahaID: 'uk',
      //   i18nName: 'englishUK',
      //   logoSource:
      //     'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
      // },
      // {
      //   nativeName: 'English (Australia)',
      //   wahaID: 'as',
      //   i18nName: 'englishAustralia',
      //   logoSource:
      //     'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
      // }
    ]
  }
  // {
  //   i18nName: 'arabic',
  //   languageCode: 'ar',
  //   data: [
  //     {
  //       nativeName: 'اللهجة المغربية',
  //       wahaID: 'da',
  //       i18nName: 'darija',
  //       logoSource:
  //         'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
  //     },
  //     {
  //       nativeName: 'ليبي‎',
  //       wahaID: 'la',
  //       i18nName: 'laarbia',
  //       logoSource:
  //         'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
  //     }
  //   ]
  // },
  // {
  //   i18nName: 'french',
  //   languageCode: 'fr',
  //   data: [
  //     {
  //       nativeName: 'Français',
  //       wahaID: 'fr',
  //       i18nName: 'french',
  //       logoSource:
  //         'https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png'
  //     }
  //   ]
  // }
]
