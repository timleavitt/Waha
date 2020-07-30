import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import MessageModal from '../components/MessageModal'
import { colors, scaleMultiplier } from '../constants'
import { setToolkitEnabled } from '../redux/actions/toolkitEnabledActions'

function PasscodeScreen (props) {
  //// STATE
  const [passcode, setPasscode] = useState('')
  const [pinRef, setPinRef] = useState()
  const [passcodeStatusText, setPasscodeStatusText] = useState('')
  const [unlockSuccessModal, setUnlockSuccessModal] = useState(false)

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  //// NAV OPTIONS
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

  //// FUNCTIONS

  function checkPasscode (passcode) {
    if (passcode === '281820') {
      setUnlockSuccessModal(true)
      props.setToolkitEnabled(true)
    } else {
      pinRef.shake().then(() => setPasscode(''))
      Alert.alert(
        props.translations.passcode.popups.unlock_unsucessful_message,
        props.translations.passcode.popups.unlock_unsucessful_title,
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

  //// RENDER

  return (
    <View style={styles.screen}>
      <Text
        style={{
          color: colors.shark,
          fontFamily: props.font + '-regular',
          fontSize: 18,
          marginVertical: 30 * scaleMultiplier,
          textAlign: 'center',
          paddingHorizontal: 20
        }}
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
      />
      <Text
        style={{
          fontFamily: props.font + '-regular',
          fontSize: 18 * scaleMultiplier,
          color: colors.red,
          marginTop: 30 * scaleMultiplier,
          paddingHorizontal: 20,
          textAlign: 'center'
        }}
      >
        {passcodeStatusText}
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

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center'
  }
})

//// REDUX

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
    activeGroup: activeGroup
  }
}
function mapDispatchToProps (dispatch) {
  return {
    setToolkitEnabled: toSet => {
      dispatch(setToolkitEnabled(toSet))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasscodeScreen)
