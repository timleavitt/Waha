import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import { connect } from 'react-redux'
import WahaBackButton from '../components/WahaBackButton'
import WahaBlurb from '../components/WahaBlurb'
import WahaHero from '../components/WahaHero'
import WahaItem from '../components/WahaItem'
import WahaSeparator from '../components/WahaSeparator'
import { scaleMultiplier } from '../constants'
import SecurityTimeoutPickerModal from '../modals/SecurityTimeoutPickerModal'
import {
  setSecurityEnabled,
  setTimeoutDuration
} from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    showPasscodeSetSnackbar: state.popups.showPasscodeSetSnackbar,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setTimeoutDuration: ms => dispatch(setTimeoutDuration(ms))
  }
}

/**
 * A screen that displays the configuration options for security mode. Allows for turning it on/off, changing the timeout, and updating your passcode.
 */
const SecurityModeScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, navigate },
  // Props passed from redux.
  isRTL,
  t,
  font,
  showPasscodeSetSnackbar,
  security,
  setSecurityEnabled,
  setTimeoutDuration
}) => {
  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <WahaBackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <WahaBackButton onPress={() => goBack()} />
    })
  }, [])

  /** Keeps track of whether the change timeout modal is visible. */
  const [showChangeTimeoutModal, setShowChangeTimeoutModal] = useState(false)

  /**
   * Converts milliseconds into a label that says how long the security timeout is.
   * @return {string} - The label to display next to the timeout button that says how long the current security timeout is.
   */
  const getTimeoutText = () => {
    if (security.timeoutDuration === 60000)
      return t.security && t.security.one_minute
    else if (security.timeoutDuration === 300000)
      return t.security && t.security.five_minutes
    else if (security.timeoutDuration === 900000)
      return t.security && t.security.fifteen_minutes
    else if (security.timeoutDuration === 3600000)
      return t.security && t.security.one_hour
    else if (security.timeoutDuration === 0)
      return t.security && t.security.instant
  }

  return (
    <View style={styles.screen}>
      {/* Inside a ScrollView in case a user's phone can't fit all of the controls on their screen. */}
      <ScrollView bounces={false}>
        <WahaHero source={require('../assets/lotties/security_mode.json')} />
        <WahaBlurb text={t.security && t.security.security_mode_blurb} />
        <WahaSeparator />
        <WahaItem title={t.security && t.security.security_mode}>
          <Switch
            trackColor={{ false: colors.chateau, true: colors.apple }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.chateau}
            onValueChange={() => {
              // If we have never enabled security mode before (meaning we have never set a code), then navigate to the security onboarding slides. Otherwise, toggle security mode on or off.
              if (security.code)
                if (security.securityEnabled) setSecurityEnabled(false)
                else setSecurityEnabled(true)
              else navigate('SecurityOnboardingSlides')
            }}
            value={security.securityEnabled}
          />
        </WahaItem>
        <WahaSeparator />
        <View style={{ height: 20 * scaleMultiplier }} />
        {/* If the user has already gone through the security onboarding (i.e. has created a code), then we show the controls. */}
        {security.code && (
          <View style={{ width: '100%' }}>
            {/* Control item one allows the user to change the security mode timeout. */}
            <WahaSeparator />
            <WahaItem
              title={t.security && t.security.change_timeout}
              onPress={() => setShowChangeTimeoutModal(true)}
            >
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={StandardTypography(
                    { font, isRTL },
                    'h4',
                    'Regular',
                    'left',
                    colors.chateau
                  )}
                >
                  {getTimeoutText()}
                </Text>
                <Icon
                  name={isRTL ? 'arrow-left' : 'arrow-right'}
                  color={colors.tuna}
                  size={50 * scaleMultiplier}
                />
              </View>
            </WahaItem>
            {/* Control item two allows the user to update their passcode. */}
            <WahaSeparator />
            <WahaItem
              title={t.security && t.security.change_passcode}
              onPress={() => navigate('PianoPasscodeChange')}
            >
              <Icon
                name={isRTL ? 'arrow-left' : 'arrow-right'}
                color={colors.tuna}
                size={50 * scaleMultiplier}
              />
            </WahaItem>
            <WahaSeparator />
          </View>
        )}
      </ScrollView>
      {/* Modals */}
      <SecurityTimeoutPickerModal
        isVisible={showChangeTimeoutModal}
        hideModal={() => setShowChangeTimeoutModal(false)}
      />
      <SnackBar
        visible={showPasscodeSetSnackbar}
        textMessage={t.security && t.security.passcode_confirmation_title}
        messageStyle={{
          color: colors.white,
          fontSize: 24 * scaleMultiplier,
          fontFamily: font + '-Black',
          textAlign: 'center'
        }}
        backgroundColor={colors.apple}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SecurityModeScreen)
