import { Dimensions } from 'react-native'

export const scaleMultiplier = (Dimensions.get('window').width / 430)

export const headerImages = {
   en: require('./assets/headerPNGs/english.png'),
   kl: require('./assets/headerPNGs/klingon.png'),
}