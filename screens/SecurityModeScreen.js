import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import Blurb from '../components/standard/Blurb'
import Hero from '../components/standard/Hero'
import Separator from '../components/standard/Separator'
import WahaItem from '../components/standard/WahaItem'
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
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
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
 * A screen that displays the configuration options for security mode. Allows for turning it on/off, changing the timeout, and updating your key code.
 */
function SecurityModeScreen ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, navigate },
  // Props passed from redux.
  isRTL,
  translations,
  font,
  security,
  setSecurityEnabled,
  setTimeoutDuration
}) {
  /** Keeps track of whether the change timeout modal is visible. */
  const [showChangeTimeoutModal, setShowChangeTimeoutModal] = useState(false)

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  /**
   * Returns the navigation options for this screen.
   * @return {Object} - The navigation options.
   */
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

  /**
   * Converts milliseconds into a label that says how long the security timeout is.
   * @return {string} - The label to display next to the timeout button that says how long the current security timeout is.
   */
  function getTimeoutText () {
    if (security.timeoutDuration === 60000)
      return translations.security.one_minute_label
    else if (security.timeoutDuration === 300000)
      return translations.security.five_minutes_label
    else if (security.timeoutDuration === 900000)
      return translations.security.fifteen_minutes_label
    else if (security.timeoutDuration === 1800000)
      return translations.security.thirty_minutes_label
    else if (security.timeoutDuration === 3600000)
      return translations.security.one_hour_label
    else if (security.timeoutDuration === 0)
      return translations.security.instant_label
  }

  // Determines what to render for the security controls. If the user has already gone through the security onboarding (i.e. has created a code), then we show the controls. Otherwise, hide them.
  var securityControls = security.code ? (
    <View style={{ width: '100%' }}>
      {/* Control item one allows the user to change the security mode timeout. */}
      <Separator />
      <WahaItem
        title={translations.security.change_timeout_button_label}
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
      <Separator />
      <WahaItem
        title={translations.security.change_key_order_button_label}
        onPress={() => navigate('KeyOrderChange_Initial')}
      >
        <Icon
          name={isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator />
    </View>
  ) : null

  return (
    <View style={styles.screen}>
      <ScrollView bounces={false}>
        <Hero source={require('../assets/gifs/piano_unlock.gif')} />
        <Blurb text={translations.security.security_mode_description_text} />
        <Separator />
        <WahaItem title={translations.security.security_mode_picker_label}>
          <Switch
            trackColor={{ false: colors.chateau, true: colors.apple }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.chateau}
            onValueChange={() => {
              // If we have never enabled security mode before (meaning we have never set a code), then navigate to the security onboarding slides. Otherwise, toggle security mode on or off.
              if (security.code) {
                if (security.securityEnabled) {
                  setSecurityEnabled(false)
                } else setSecurityEnabled(true)
              } else {
                navigate('SecurityOnboardingSlides')
              }
            }}
            value={security.securityEnabled}
          />
        </WahaItem>
        <Separator />
        <View style={{ height: 20 * scaleMultiplier }} />
        {securityControls}
      </ScrollView>
      {/* Modals */}
      <SecurityTimeoutPickerModal
        isVisible={showChangeTimeoutModal}
        hideModal={() => setShowChangeTimeoutModal(false)}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SecurityModeScreen)
