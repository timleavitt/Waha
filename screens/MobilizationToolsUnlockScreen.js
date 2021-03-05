import React, { useEffect, useState } from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, View } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import { scaleMultiplier } from '../constants'
import MessageModal from '../modals/MessageModal'
import { setAreMobilizationToolsUnlocked } from '../redux/actions/areMobilizationToolsUnlockedActions'
import { setMTUnlockAttempts } from '../redux/actions/mtUnlockAttemptsActions'
import { setMTUnlockTimeout } from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    security: state.security,
    mtUnlockAttempts: state.mtUnlockAttempts
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setAreMobilizationToolsUnlocked: toSet => {
      dispatch(setAreMobilizationToolsUnlocked(toSet))
    },
    setMTUnlockTimeout: time => {
      dispatch(setMTUnlockTimeout(time))
    },
    setMTUnlockAttempts: numAttempts => {
      dispatch(setMTUnlockAttempts(numAttempts))
    }
  }
}

/**
 * Screen that shows a simple passcode entry and allows the user to unlock the Mobilization Tools.
 */
function MobilizationToolsUnlockScreen ({
  // Props passed from navigation.
  navigation: { setOptions, goBack },
  // Props passed from redux.
  isRTL,
  translations,
  font,
  security,
  mtUnlockAttempts,
  setAreMobilizationToolsUnlocked,
  setMTUnlockTimeout,
  setMTUnlockAttempts
}) {
  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />
    })
  }, [])

  /** Keeps track of the user input of the passcode entry area. */
  const [passcode, setPasscode] = useState('')

  /** A reference to the passcode entry component. */
  const [pinRef, setPinRef] = useState()

  /** Keeps track of whether the unlock success modal is visible. */
  const [unlockSuccessModal, setUnlockSuccessModal] = useState(false)

  /**
   * useEffect function that updates every time the passcode input changes. If the user gets to 5 attempts without unlocking successfully, the app will lock them out from attempting to unlock again for 30 minutes.
   */
  useEffect(() => {
    if (mtUnlockAttempts === 5) {
      setMTUnlockAttempts(0)
      setMTUnlockTimeout(Date.now() + 1800000)
    }
  }, [mtUnlockAttempts])

  /**
   * Checks if the passcode the user enters is correct. If it is, show the success modal. If not, add one to the attempts tracker and show an alert that the code is incorrect.
   */
  function checkPasscode (fullPasscode) {
    if (fullPasscode === '281820') {
      Keyboard.dismiss()
      setUnlockSuccessModal(true)
      setAreMobilizationToolsUnlocked(true)
    } else {
      setMTUnlockAttempts(mtUnlockAttempts + 1)
      // Make the input component "shake" when they enter in a wrong code.
      pinRef.shake().then(() => setPasscode(''))
      Alert.alert(
        translations.passcode.popups.unlock_unsucessful_title,
        translations.passcode.popups.unlock_unsucessful_message,
        [
          {
            text: translations.general.ok,
            onPress: () => {}
          }
        ]
      )
    }
  }

  /**
   * Gets a string of the amount of attempts the user has left OR, if they're already locked out, the time they have left until they can attempt again.
   * @return {string} - The text to display.
   */
  function getTimeoutText () {
    if (Date.now() - security.mtUnlockTimeout < 0)
      return (
        translations.passcode.too_many_attempts_label +
        ' ' +
        Math.round((security.mtUnlockTimeout - Date.now()) / 60000) +
        ' ' +
        translations.passcode.minutes_label
      )
    else if (mtUnlockAttempts === 3)
      return translations.passcode.two_attempt_remaining_label
    else if (mtUnlockAttempts === 4)
      return translations.passcode.one_attempt_remaining_label
    else return ''
  }

  return (
    <View style={styles.screen}>
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            'Regular',
            'center',
            colors.shark
          ),
          {
            marginTop: 50 * scaleMultiplier,
            marginBottom: 30 * scaleMultiplier,
            paddingHorizontal: 20
          }
        ]}
      >
        {translations.passcode.enter_passcode_text}
      </Text>
      <SmoothPinCodeInput
        ref={ref => setPinRef(ref)}
        value={passcode}
        codeLength={6}
        autoFocus={true}
        restrictToNumbers={true}
        animationFocused=''
        onTextChange={passcode => setPasscode(passcode)}
        onFulfill={fullPasscode => checkPasscode(fullPasscode)}
        onBackspace={() => {}}
        // Disable entry if the user is locked out.
        editable={
          security.mtUnlockTimeout
            ? Date.now() - security.mtUnlockTimeout > 0
              ? true
              : false
            : true
        }
        cellSize={50 * scaleMultiplier}
        cellStyle={{
          borderRadius: 25,
          borderColor: colors.chateau,
          borderWidth: 2,
          marginLeft: 3,
          marginRight: 3
        }}
        cellStyleFocused={{
          borderColor: colors.shark,
          borderRadius: 25,
          borderWidth: 2
        }}
      />
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            'Regular',
            'center',
            colors.red
          ),
          {
            marginTop: 30 * scaleMultiplier,
            paddingHorizontal: 20
          }
        ]}
      >
        {getTimeoutText()}
      </Text>
      {/* Modals */}
      <MessageModal
        isVisible={unlockSuccessModal}
        hideModal={() => {
          setUnlockSuccessModal(false)
          goBack()
        }}
        title={translations.passcode.popups.unlock_successful_title}
        body={translations.passcode.popups.unlock_successful_message}
        confirmText={translations.general.got_it}
        confirmOnPress={() => {
          setUnlockSuccessModal(false)
          goBack()
        }}
      >
        <Image
          source={require('../assets/gifs/unlock_mob_tools.gif')}
          style={{
            height: 200 * scaleMultiplier,
            margin: 20,
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobilizationToolsUnlockScreen)
