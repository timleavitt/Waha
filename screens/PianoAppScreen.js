import { useBackHandler } from '@react-native-community/hooks'
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
import Piano from '../components/piano-stuff/Piano'
import { scaleMultiplier } from '../constants'
import { setIsMuted, setIsTimedOut } from '../redux/actions/securityActions'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function PianoAppScreen ({
  // Props passed from navigation.
  navigation: { canGoBack, goBack, reset },
  // Props passed from redux.
  security,
  font,
  activeGroup,
  translations,
  isRTL,
  setIsMuted,
  setIsTimedOut
}) {
  //+ STATE

  const [pattern, setPattern] = useState('')
  const [countdown, setCountdown] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  //+ CONSTRUCTOR

  useEffect(() => {
    Keyboard.dismiss()

    if (pattern.includes(security.code)) {
      if (!security.isMuted) {
        var note = new Audio.Sound()
        note
          .loadAsync(
            require('../assets/securityMode/unlock_security_mode_sound.mp3')
          )
          .then(() => note.playAsync())
      }
      setIsTimedOut(false)
      if (canGoBack()) {
        if (Platform.OS === 'ios') goBack()
        goBack()
      } else
        reset({
          index: 0,
          routes: [{ name: 'SetsTabs' }]
        })
    }
  }, [pattern])

  // disable back button on this screen
  useBackHandler(() => {
    return true
  })

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
          source={require('../assets/icons/waha_icon.png')}
          style={{
            resizeMode: 'contain',
            width: 50,
            height: 50,
            borderRadius: 10
          }}
        />
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'h1',
              'Bold',
              'center',
              colors.shark
            ),
            { paddingHorizontal: 10 }
          ]}
        >
          {translations.security.game_screen_title}
        </Text>
      </View>
      <View>
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
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
              // security.isMuted
              //   ? () => setIsMuted(false)
              //   : () => setIsMuted(true)
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
                style={StandardTypography(
                  { font, isRTL },
                  'h2',
                  'Regular',
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
            source={require('../assets/securityMode/piano.png')}
          />
          <Piano setPattern={setPattern} isMuted={security.isMuted} />
        </View>
        <View
          style={{
            width: Dimensions.get('window').width,
            flexDirection: isRTL ? 'row-reverse' : 'row',
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
              security.isMuted
                ? () => setIsMuted(false)
                : () => setIsMuted(true)
            }
            style={{
              margin: 20
            }}
          >
            <Icon
              name={security.isMuted ? 'volume-off' : 'volume'}
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
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    isRTL: state.database[activeGroup.language].isRTL
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

export default connect(mapStateToProps, mapDispatchToProps)(PianoAppScreen)
