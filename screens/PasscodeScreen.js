import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'
import { setToolkitEnabled } from '../redux/actions/toolkitEnabledActions'
import BackButton from '../components/BackButton'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import MessageModal from '../components/MessageModal'
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
        props.translations.alerts.passcodeError.header,
        props.translations.alerts.passcodeError.text,
        [
          {
            text: props.translations.alerts.options.ok,
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
          fontFamily: props.font + '-regular',
          fontSize: 18,
          marginVertical: 30 * scaleMultiplier
        }}
      >
        {props.translations.labels.enterPasscode}
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
          color: '#FF0800',
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
        title={props.translations.modals.mtUnlock.header}
        body={props.translations.modals.mtUnlock.text}
        imageSource={require('../assets/gifs/unlock_mob_tools.gif')}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9FA',
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
