import React, { useEffect, useState } from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, View } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import { colors, scaleMultiplier } from '../constants'
import MessageModal from '../modals/MessageModal'
import { setAreMobilizationToolsUnlocked } from '../redux/actions/areMobilizationToolsUnlockedActions'
import {
  setMTUnlockAttempts,
  setMTUnlockTimeout
} from '../redux/actions/securityActions'
import { logUnlockMobilizationTools } from '../redux/LogEventFunctions'
function PasscodeScreen (props) {
  //+ STATE
  const [passcode, setPasscode] = useState('')
  const [pinRef, setPinRef] = useState()
  // const [passcodeStatusText, setPasscodeStatusText] = useState('')
  const [unlockSuccessModal, setUnlockSuccessModal] = useState(false)
  // const [numAttempts, setNumAttempts] = useState(0)

  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  //+ NAV OPTIONS
  function getNavOptions () {
    return {
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  useEffect(() => {
    if (props.mtUnlockAttempts === 5) {
      props.setMTUnlockAttempts(0)
      props.setMTUnlockTimeout(Date.now() + 1800000)
    }
  }, [props.mtUnlockAttempts])

  //+ FUNCTIONS

  function checkPasscode (passcode) {
    if (passcode === '281820') {
      Keyboard.dismiss()
      logUnlockMobilizationTools(props.activeGroup.language)
      setUnlockSuccessModal(true)
      props.setAreMobilizationToolsUnlocked(true)
    } else {
      props.setMTUnlockAttempts(props.mtUnlockAttempts + 1)
      pinRef.shake().then(() => setPasscode(''))
      Alert.alert(
        props.translations.passcode.popups.unlock_unsucessful_title,
        props.translations.passcode.popups.unlock_unsucessful_message,
        [
          {
            text: props.translations.general.ok,
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
          Typography(props, 'h3', 'regular', 'center', colors.shark),
          {
            marginVertical: 30 * scaleMultiplier,
            paddingHorizontal: 20
          }
        ]}
      >
        {props.translations.passcode.enter_passcode_text}
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
          props.security.mtUnlockTimeout
            ? Date.now() - props.security.mtUnlockTimeout > 0
              ? true
              : false
            : true
        }
      />
      <Text
        style={[
          Typography(props, 'h3', 'regular', 'center', colors.red),
          {
            marginTop: 30 * scaleMultiplier,
            paddingHorizontal: 20
          }
        ]}
      >
        {/* conditional text based on how many attempts user has left / if they're currently locked out */}
        {Date.now() - props.security.mtUnlockTimeout < 0
          ? props.translations.passcode.too_many_attempts_label +
            ' ' +
            Math.round((props.security.mtUnlockTimeout - Date.now()) / 60000) +
            ' ' +
            props.translations.passcode.minutes_label
          : props.mtUnlockAttempts === 3
          ? props.translations.passcode.two_attempt_remaining_label
          : props.mtUnlockAttempts === 4
          ? props.translations.passcode.one_attempt_remaining_label
          : ''}
      </Text>
      <MessageModal
        isVisible={unlockSuccessModal}
        hideModal={() => {
          setUnlockSuccessModal(false)
          props.navigation.goBack()
        }}
        title={props.translations.passcode.popups.unlock_successful_title}
        body={props.translations.passcode.popups.unlock_successful_message}
        confirmText={props.translations.general.got_it}
        confirmOnPress={() => {
          setUnlockSuccessModal(false)
          props.navigation.goBack()
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup,
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

export default connect(mapStateToProps, mapDispatchToProps)(PasscodeScreen)
