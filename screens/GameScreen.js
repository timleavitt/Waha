import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import Piano from '../components/Piano'
import { colors, scaleMultiplier } from '../constants'
import { setIsMuted } from '../redux/actions/securityActions'

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
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Image
          source={require('../assets/wahaIcon.png')}
          style={{
            resizeMode: 'contain',
            width: 50,
            height: 50,
            borderRadius: 10
          }}
        />
        <Text
          style={{
            fontFamily: props.font + '-medium',
            paddingHorizontal: 10,
            fontSize: 32 * scaleMultiplier
          }}
        >
          {props.translations.security.game_screen_title}
        </Text>
      </View>
      <View>
        <Piano setPattern={setPattern} isMuted={props.security.isMuted} />
        <View
          style={{
            width: Dimensions.get('window').width,
            alignItems: 'flex-end'
          }}
        >
          <TouchableOpacity
            onPress={
              props.security.isMuted
                ? () => props.setIsMuted(false)
                : () => props.setIsMuted(true)
            }
            style={{
              margin: 20
            }}
          >
            <Icon
              name={props.security.isMuted ? 'volume-off' : 'volume'}
              size={50}
              color={colors.tuna}
            />
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-around'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    security: state.security,
    font: state.database[activeGroup.language].font,
    translations: state.database[activeGroup.language].translations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setIsMuted: toSet => {
      dispatch(setIsMuted(toSet))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
