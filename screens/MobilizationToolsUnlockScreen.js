import React, { useEffect, useState } from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, View } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import { scaleMultiplier } from '../constants'
import MessageModal from '../modals/MessageModal'
import { setAreMobilizationToolsUnlocked } from '../redux/actions/areMobilizationToolsUnlockedActions'
import {
  setMTUnlockAttempts,
  setMTUnlockTimeout
} from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
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

function MobilizationToolsUnlockScreen ({
  // Props passed from navigation.
  navigation: { setOptions, goBack },
  // Props passed from redux.
  activeDatabase,
  isRTL,
  translations,
  font,
  activeGroup,
  security,
  mtUnlockAttempts,
  setAreMobilizationToolsUnlocked,
  setMTUnlockTimeout,
  setMTUnlockAttempts
}) {
  const [passcode, setPasscode] = useState('')
  const [pinRef, setPinRef] = useState()
  // const [passcodeStatusText, setPasscodeStatusText] = useState('')
  const [unlockSuccessModal, setUnlockSuccessModal] = useState(false)
  // const [numAttempts, setNumAttempts] = useState(0)

  //+ CONSTRUCTOR

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  //+ NAV OPTIONS
  function getNavOptions () {
    return {
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />
    }
  }

  useEffect(() => {
    if (mtUnlockAttempts === 5) {
      setMTUnlockAttempts(0)
      setMTUnlockTimeout(Date.now() + 1800000)
    }
  }, [mtUnlockAttempts])

  //+ FUNCTIONS

  function checkPasscode (passcode) {
    if (passcode === '281820') {
      Keyboard.dismiss()
      setUnlockSuccessModal(true)
      setAreMobilizationToolsUnlocked(true)
    } else {
      setMTUnlockAttempts(mtUnlockAttempts + 1)
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
      // setTimeout(() => setPasscodeStatusText(''), 3000)
    }
  }

  //+ RENDER

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
            marginVertical: 30 * scaleMultiplier,
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
        onFulfill={checkPasscode}
        onBackspace={() => {}}
        editable={
          security.mtUnlockTimeout
            ? Date.now() - security.mtUnlockTimeout > 0
              ? true
              : false
            : true
        }
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
        {/* conditional text based on how many attempts user has left / if they're currently locked out */}
        {Date.now() - security.mtUnlockTimeout < 0
          ? translations.passcode.too_many_attempts_label +
            ' ' +
            Math.round((security.mtUnlockTimeout - Date.now()) / 60000) +
            ' ' +
            translations.passcode.minutes_label
          : mtUnlockAttempts === 3
          ? translations.passcode.two_attempt_remaining_label
          : mtUnlockAttempts === 4
          ? translations.passcode.one_attempt_remaining_label
          : ''}
      </Text>
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
            // padding: 20,
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
    </View>
  )
}

//+ STYLES

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
