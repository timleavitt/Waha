import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import Piano from '../components/Piano'
import { colors, scaleMultiplier } from '../constants'
import { setIsMuted, setIsTimedOut } from '../redux/actions/securityActions'

function GameScreen (props) {
  //+ STATE

  const [pattern, setPattern] = useState('')
  const [countdown, setCountdown] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  //+ CONSTRUCTOR

  useEffect(() => {
    Keyboard.dismiss()

    if (pattern.includes(props.security.code)) {
      if (!props.security.isMuted) {
        var note = new Audio.Sound()
        note
          .loadAsync(require('../assets/notes/Success.mp3'))
          .then(() => note.playAsync())
      }
      props.setIsTimedOut(false)
      if (props.navigation.canGoBack()) {
        if (Platform.OS === 'ios') props.navigation.goBack()
        props.navigation.goBack()
      } else
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'SetTabs' }]
        })
    }
  }, [pattern])

  //+ RENDER

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
          style={[
            Typography(props, 'h1', 'medium', 'center', colors.shark),
            { paddingHorizontal: 10 }
          ]}
        >
          {props.translations.security.game_screen_title}
        </Text>
      </View>
      <View>
        <View
          style={{
            flexDirection: props.isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={
              countdown === ''
                ? () => {
                    setCountdown('3')
                    setTimeout(() => setCountdown('2'), 1000)
                    setTimeout(() => setCountdown('1'), 2000)
                    setTimeout(() => setCountdown('!'), 3000)
                  }
                : () => {
                    setCountdown('')
                  }
              // props.security.isMuted
              //   ? () => props.setIsMuted(false)
              //   : () => props.setIsMuted(true)
            }
            style={{
              margin: 20
            }}
          >
            <View
              style={{
                backgroundColor: colors.red,
                width: 50 * scaleMultiplier,
                height: 50 * scaleMultiplier,
                borderRadius: (50 * scaleMultiplier) / 2,
                borderWidth: 2,
                borderColor: colors.tuna,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={Typography(
                  props,
                  'h2',
                  'regular',
                  'center',
                  colors.white
                )}
              >
                {countdown}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              isPlaying ? () => setIsPlaying(false) : () => setIsPlaying(true)
            }
            style={{
              margin: 20
            }}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={60 * scaleMultiplier}
              color={colors.tuna}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Image
            style={{
              resizeMode: 'contain',
              width: Dimensions.get('window').width,
              height: 60 * scaleMultiplier,
              borderRadius: 10
            }}
            source={require('../assets/piano.png')}
          />
          <Piano setPattern={setPattern} isMuted={props.security.isMuted} />
        </View>
        <View
          style={{
            width: Dimensions.get('window').width,
            flexDirection: props.isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              margin: 20
            }}
          >
            <Icon name={'settings'} size={50} color={colors.tuna} />
          </TouchableOpacity>
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

//+ STYLES

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
    },
    setIsTimedOut: toSet => {
      dispatch(setIsTimedOut(toSet))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen)
