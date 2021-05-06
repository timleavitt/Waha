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
import { setCode, setSecurityEnabled } from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    security: state.security,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setCode: code => dispatch(setCode(code))
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
  translations,
  font,
  security,
  isRTL,
  activeGroup,
  setSecurityEnabled,
  setCode
}) => {
  /** Keeps track of the passcode that the user is entering into the piano. */
  const [localPasscode, setLocalPasscode] = useState('')

  /** The text to display above the piano telling the user what to do. */
  const instructionText = {
    PianoPasscodeSet: translations.security.choose_key_order_label,
    PianoPasscodeSetConfirm: translations.security.confirm_key_order_label,
    PianoPasscodeChange: translations.security.choose_new_key_order_label,
    PianoPasscodeChangeConfirm:
      translations.security.confirm_new_key_order_label
  }

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      title: routeName.includes('Set')
        ? translations.security.header_set_key_order
        : translations.security.header_change_key_order,
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
            Alert.alert(
              translations.security.popups.key_order_set_confirmation_title,
              translations.security.popups.key_order_set_confirmation_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
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
              translations.security.popups.no_match_title,
              translations.security.popups.no_match_message,
              [{ text: translations.general.ok, onPress: () => {} }]
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
            Alert.alert(
              translations.security.popups.key_order_set_confirmation_title,
              translations.security.popups.key_order_set_confirmation_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
            setSecurityEnabled(true)
            setCode(localPasscode)
            goBack()
            goBack()
          } // Otherwise, show an alert that the passcodes don't match.
          else {
            Alert.alert(
              translations.security.popups.no_match_title,
              translations.security.popups.no_match_message,
              [{ text: translations.general.ok, onPress: () => {} }]
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
          label={translations.security.clear_button_label}
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
