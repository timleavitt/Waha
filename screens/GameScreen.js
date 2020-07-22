import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert,
  Switch,
  SafeAreaView
} from 'react-native'
import Piano from '../components/Piano'

function GameScreen (props) {
  //// STATE

  const [pattern, setPattern] = useState('')

  //// CONSTRUCTOR

  useEffect(() => {
    console.log(pattern)
    if (pattern.includes('01020304')) props.navigation.replace('SetsRoot')
  }, [pattern])

  //// RENDER

  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={{
          height: '25%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image source={require('../assets/wahaIcon.png')} />
      </View>
      <Piano setPattern={setPattern} />
    </SafeAreaView>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
})

export default GameScreen
