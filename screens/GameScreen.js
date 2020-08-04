import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, SafeAreaView, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import Piano from '../components/Piano'
import { colors } from '../constants'

function GameScreen (props) {
  //// STATE

  const [pattern, setPattern] = useState('')
  const [isMuted, setIsMuted] = useState(false)

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
      <Piano setPattern={setPattern} isMuted={isMuted} />
      <View
        style={{
          width: Dimensions.get('window').width,
          alignItems: 'flex-end'
        }}
      >
        <TouchableOpacity
          onPress={() => setIsMuted(old => !old)}
          style={{
            margin: 20
          }}
        >
          <Icon
            name={isMuted ? 'volume-off' : 'volume'}
            size={50}
            color={colors.tuna}
          />
        </TouchableOpacity>
      </View>
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
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    security: state.security,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(GameScreen)
