import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import Piano from '../components/Piano'

function GameScreen (props) {
  //// STATE

  const [pattern, setPattern] = useState('')

  //// CONSTRUCTOR

  useEffect(() => {
    console.log(pattern)
    if (pattern.includes(props.security.code)) {
      var note = new Audio.Sound()
      note
        .loadAsync(require('../assets/notes/Success.mp3'))
        .then(() => note.playAsync())
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'SetsRoot' }]
      })
    }
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
    backgroundColor: colors.aquaHaze,
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
