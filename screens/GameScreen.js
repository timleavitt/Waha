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
import { connect } from 'react-redux'

function GameScreen (props) {
  //// STATE

  const [pattern, setPattern] = useState('')

  //// CONSTRUCTOR

  useEffect(() => {
    console.log(pattern)
    if (pattern.includes(props.security.code))
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'SetsRoot' }]
      })
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

function mapStateToProps (state) {
  return {
    security: state.security
  }
}

export default connect(mapStateToProps)(GameScreen)
