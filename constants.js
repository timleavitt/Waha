import { Dimensions } from 'react-native'
import * as FileSystem from 'expo-file-system';

export const scaleMultiplier = (Dimensions.get('window').width / 430)