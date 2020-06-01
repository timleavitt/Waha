import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  TouchableOpacity
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'
import { setToolkitEnabled } from '../redux/actions/toolkitEnabledActions'
import BackButton from '../components/BackButton'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'

function PasscodeScreen (props) {
  //// STATE
  const [passcode, setPasscode] = useState('')
  const [pinRef, setPinRef] = useState()
  const [passcodeStatusText, setPasscodeStatusText] = useState('')
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
      setPasscodeStatusText(props.translations.labels.passcodeSuccess)
      props.setToolkitEnabled(true)
    } else {
      pinRef.shake().then(() => setPasscode(''))
      setPasscodeStatusText(props.translations.labels.passcodeError)
      setTimeout(() => setPasscodeStatusText(''), 3000)
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
          fontSize: 14 * scaleMultiplier,
          color: '#9FA5AD',
          marginTop: 30 * scaleMultiplier
        }}
      >
        {passcodeStatusText}
      </Text>
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
