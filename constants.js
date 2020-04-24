import { Dimensions } from 'react-native'
import * as FileSystem from 'expo-file-system';

export const scaleMultiplier = (Dimensions.get('window').width / 430)

export const setImages = {
   1: 'tree',
   2: 'book',
}

export const languageT2S = {
   en: require('./assets/languageT2S/en.mp3'),
   te: require('./assets/languageT2S/te.mp3')
}