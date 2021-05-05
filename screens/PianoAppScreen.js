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
import Piano from '../components/Piano'
import { scaleMultiplier } from '../constants'
import { setIsMuted, setIsTimedOut } from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    security: state.security,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
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

/**
 * A screen that shows a dummy piano app meant to convince non-users who are looking at the app that it's just a harmless piano app and not a Christian disciple making tool >:)
 */
const PianoAppScreen = ({
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
}) => {
  /** Keeps track of the passcode that the user is entering on the piano. */
  const [playedNotes, setPlayedNotes] = useState('')

  /** Keeps track of the countdown that starts "recording" your piano playing (it doesn't actually record). */
  const [countdown, setCountdown] = useState('')

  /** Keeps track of whether your piano "recording" is "playing" (it doesn't actually play). */
  const [isPlaying, setIsPlaying] = useState(false)

  /** useEffect function that dismisses the keyboard on first render in case the user had the keyboard open before exiting the app and enabling security mode. */
  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  /** useEffect function that updates whenever the user plays a piano note. */
  useEffect(() => {
    // If the user has entered in their passcode...
    if (playedNotes.includes(security.code)) {
      // If the user hasn't muted the piano app sounds, play a little sound effect when they enter their passcode correctly.
      if (!security.isMuted) {
        var note = new Audio.Sound()
        note
          .loadAsync(
            require('../assets/securityMode/unlock_security_mode_sound.mp3')
          )
          .then(() => note.playAsync())
      }
      setIsTimedOut(false)
      // Because this screen is on top of all other screens in terms of the navigation stack, the way we get back to what was on the screen before security mode was activated is to simply go back. If we can't go back, then just reset to the starting screen.
      if (canGoBack()) {
        if (Platform.OS === 'ios') goBack()
        goBack()
      } else
        reset({
          index: 0,
          routes: [{ name: 'SetsTabs' }]
        })
    }
  }, [playedNotes])

  /** Disables the back button in this screen */
  useBackHandler(() => true)

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
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
          style={[
            styles.dummyControlsContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
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
            }
            style={{
              margin: 20
            }}
          >
            <View style={styles.recordButton}>
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
          <Piano setPlayedNotes={setPlayedNotes} isMuted={security.isMuted} />
        </View>
        <View
          style={[
            styles.bottomControlsContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  titleContainer: {
    height: '25%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dummyControlsContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordButton: {
    backgroundColor: colors.red,
    width: 50 * scaleMultiplier,
    height: 50 * scaleMultiplier,
    borderRadius: (50 * scaleMultiplier) / 2,
    borderWidth: 2,
    borderColor: colors.tuna,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomControlsContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PianoAppScreen)
