import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, View } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import MessageModal from '../modals/MessageModal'
import { setAreMobilizationToolsUnlocked } from '../redux/actions/areMobilizationToolsUnlockedActions'
import { addSet } from '../redux/actions/groupsActions'
import { setMTUnlockAttempts } from '../redux/actions/mtUnlockAttemptsActions'
import { setShowMTTabAddedSnackbar } from '../redux/actions/popupsActions'
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
    mtUnlockAttempts: state.mtUnlockAttempts,
    groups: state.groups,
    database: state.database
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
    },
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    },
    setShowMTTabAddedSnackbar: toSet => {
      dispatch(setShowMTTabAddedSnackbar(toSet))
    }
  }
}

/**
 * Screen that shows a simple passcode entry and allows the user to unlock the Mobilization Tools.
 */
const MobilizationToolsUnlockScreen = ({
  // Props passed from navigation.
  navigation: { navigate, setOptions, goBack },
  // Props passed from redux.
  isRTL,
  translations,
  font,
  security,
  mtUnlockAttempts,
  groups,
  database,
  setAreMobilizationToolsUnlocked,
  setMTUnlockTimeout,
  setMTUnlockAttempts,
  addSet,
  setShowMTTabAddedSnackbar
}) => {
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
  const pinRef = useRef()

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

  function checkForMTContent (languageID) {
    var hasMTContent = database[languageID].sets.some(set => {
      return /[a-z]{2}.3.[0-9]+/.test(set.id)
    })
    return hasMTContent
  }

  /**
   * Checks if the passcode the user enters is correct. If it is, show the success modal. If not, add one to the attempts tracker and show an alert that the code is incorrect.
   */
  function checkPasscode (fullPasscode) {
    if (fullPasscode === '281820') {
      Keyboard.dismiss()
      setAreMobilizationToolsUnlocked(true)
      // setUnlockSuccessModal(true)
      // navigate('MTUnlockSuccessful')

      // Object.keys(database).forEach(key => {
      //   // Go through each language.
      //   if (key.length === 2) {
      //     // If the language has MT content...
      //     if (checkForMTContent(key)) {
      //       // Get the first 2 MT Sets.
      //       var mobToolsSet1 = database[key].sets.filter(set =>
      //         /[a-z]{2}.3.1/.test(set.id)
      //       )[0]

      //       var mobToolsSet2 = database[key].sets.filter(set =>
      //         /[a-z]{2}.3.2/.test(set.id)
      //       )[0]

      //       // Add the 2 MT Sets to every group in the language.
      //       groups
      //         .filter(group => group.language === key)
      //         .forEach(group => {
      //           addSet(group.name, group.id, mobToolsSet1)
      //           addSet(group.name, group.id, mobToolsSet2)
      //         })
      //     }
      //   }
      // })
      navigate('SetsTabs', { screen: 'MobilizationTools' })
      setTimeout(() => setShowMTTabAddedSnackbar(true), 1000)
    } else {
      setMTUnlockAttempts(mtUnlockAttempts + 1)
      // Make the input component "shake" when they enter in a wrong code.
      pinRef.current.shake().then(() => setPasscode(''))
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
        ref={pinRef}
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
          navigate('SetsTabs', { screen: 'MobilizationTools' })
        }}
        title='Mobilization Tools unlocked successfully!'
        body=''
        confirmText='Check it out'
        confirmOnPress={() => {
          setUnlockSuccessModal(false)
          navigate('SetsTabs', { screen: 'MobilizationTools' })
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
