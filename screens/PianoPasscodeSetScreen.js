import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import Piano from '../components/Piano'
import PianoPasscodeDisplay from '../components/PianoPasscodeDisplay'
import WahaBackButton from '../components/WahaBackButton'
import WahaButton from '../components/WahaButton'
import { logEnableSecurityMode } from '../LogEventFunctions'
import { setShowPasscodeSetSnackbar } from '../redux/actions/popupsActions'
import { setCode, setSecurityEnabled } from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    security: state.security,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setCode: code => dispatch(setCode(code)),
    setShowPasscodeSetSnackbar: toSet =>
      dispatch(setShowPasscodeSetSnackbar(toSet))
  }
}

/**
 * A screen that allows the user to set/change/confirm their piano passcode.
 * @param {string} passcode - (Optional) If the user is confirming their passcode, this is the passcode already entered so we can verify that they match.
 */
const PianoPasscodeSetScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, navigate, goBack },
  route: {
    name: routeName,
    // Props passed from previous screen.
    params: { passcode } = { passcode: null }
  },
  // Props passed from redux.
  t,
  font,
  security,
  isRTL,
  activeGroup,
  setSecurityEnabled,
  setCode,
  setShowPasscodeSetSnackbar
}) => {
  /** Keeps track of the passcode that the user is entering into the piano. */
  const [localPasscode, setLocalPasscode] = useState('')

  /** The text to display above the piano telling the user what to do. */
  const instructionText = {
    PianoPasscodeSet: t.security && t.security.choose_passcode,
    PianoPasscodeSetConfirm: t.security && t.security.confirm_passcode,
    PianoPasscodeChange: t.security && t.security.choose_passcode,
    PianoPasscodeChangeConfirm: t.security && t.security.confirm_passcode
  }

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      title: t.security && t.security.security,
      headerRight: isRTL
        ? () => (
            <WahaBackButton
              onPress={() => {
                goBack()
                if (routeName === 'PianoPasscodeSet') goBack()
              }}
            />
          )
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => (
            <WahaBackButton
              onPress={() => {
                goBack()
                if (routeName === 'PianoPasscodeSet') goBack()
              }}
            />
          )
    })
  }, [])

  /** useEffect function that triggers whenever the user's passcode input changes and handles all necessary situations. */
  useEffect(() => {
    // If the user has entered in a full 6-digit passcode (each digit takes up 2 characters in the passcode string)...
    if (localPasscode.length === 12)
      switch (routeName) {
        case 'PianoPasscodeSet':
          // After entering in their passcode for the first time, reset the passcode input and navigate to the confirmation screen.
          setLocalPasscode('')
          navigate('PianoPasscodeSetConfirm', {
            passcode: localPasscode
          })
          break
        case 'PianoPasscodeSetConfirm':
          // If passcodes match, pop up an alert, log it, set security enabled, set the passcode in redux, and go back.
          if (localPasscode === passcode) {
            // Alert.alert(
            //   t.security && t.security.passcode_confirmation_title,
            //   t.security && t.security.passcode_confirmation_message,
            //   [{ text: t.general && t.general.ok, onPress: () => {} }]
            // )
            setShowPasscodeSetSnackbar(true)
            setTimeout(() => setShowPasscodeSetSnackbar(false), 2000)
            // Log the enabling of Security Mode in Firebase analytics.
            logEnableSecurityMode(activeGroup.id)

            setSecurityEnabled(true)
            setCode(passcode)
            goBack()
            goBack()
            goBack()
          } // Otherwise, show an alert that the passcodes don't match.
          else {
            Alert.alert(
              t.security && t.security.no_match_title,
              t.security && t.security.no_match_message,
              [{ text: t.general && t.general.ok, onPress: () => {} }]
            )
            goBack()
          }
          break
        case 'PianoPasscodeChange':
          // After entering in their passcode for the first time, reset the passcode input and navigate to the confirmation screen.
          setLocalPasscode('')
          navigate('PianoPasscodeChangeConfirm', {
            passcode: localPasscode
          })
          break
        case 'PianoPasscodeChangeConfirm':
          // If passcodes match, pop up an alert, set the passcode in redux, and go back.
          if (localPasscode === passcode) {
            // Alert.alert(
            //   t.security && t.security.passcode_confirmation_title,
            //   t.security && t.security.passcode_confirmation_message,
            //   [{ text: t.general && t.general.ok, onPress: () => {} }]
            // )
            setShowPasscodeSetSnackbar(true)
            setTimeout(() => setShowPasscodeSetSnackbar(false), 2000)
            setSecurityEnabled(true)
            setCode(localPasscode)
            goBack()
            goBack()
          } // Otherwise, show an alert that the passcodes don't match.
          else {
            Alert.alert(
              t.security && t.security.no_match_title,
              t.security && t.security.no_match_message,
              [{ text: t.general && t.general.ok, onPress: () => {} }]
            )
            goBack()
          }
          break
      }
  }, [localPasscode])

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topContainer}>
        <View style={styles.instructionTextContainer}>
          <Text
            style={StandardTypography(
              { font, isRTL },
              'h2',
              'Bold',
              'center',
              colors.shark
            )}
          >
            {instructionText[routeName]}
          </Text>
        </View>
        <PianoPasscodeDisplay passcode={localPasscode} />
        <WahaButton
          type='outline'
          onPress={() => setLocalPasscode('')}
          color={colors.red}
          label={t.general && t.general.clear}
          width={Dimensions.get('window').width / 3}
          style={{ marginVertical: 0 }}
        />
      </View>
      <Piano setPlayedNotes={setLocalPasscode} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  topContainer: { width: '100%', alignItems: 'center' },
  instructionTextContainer: { width: '100%', paddingHorizontal: 20 }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PianoPasscodeSetScreen)
