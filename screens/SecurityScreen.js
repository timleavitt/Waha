import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import OptionsModalButton from '../components/OptionsModalButton'
import BackButton from '../components/standard/BackButton'
import Blurb from '../components/standard/Blurb'
import Hero from '../components/standard/Hero'
import Separator from '../components/standard/Separator'
import WahaItem from '../components/standard/WahaItem'
import WahaItemDescription from '../components/standard/WahaItemDescription'
import { scaleMultiplier } from '../constants'
import OptionsModal from '../modals/OptionsModal'
import {
  setIsTimedOut,
  setSecurityEnabled,
  setTimeoutDuration
} from '../redux/actions/securityActions'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function SecurityScreen ({
  navigation: { setOptions, goBack, navigate },
  // passed from redux
  database,
  activeDatabase,
  isRTL,
  translations,
  font,
  activeGroup,
  areMobilizationToolsUnlocked,
  security,
  setSecurityEnabled,
  setIsTimedOut,
  setTimeoutDuration
}) {
  //+ STATE
  const [showSecurityWarningModal, setShowSecurityWarningModal] = useState(
    false
  )

  const [showViewKeyOrderModal, setShowViewKeyOrderModal] = useState(false)

  const [showChangeTimeoutModal, setShowChangeTimeoutModal] = useState(false)
  //+ CONSTRUCTOR

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

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

  // extra controls for if security mode is enabled
  var securityControls = security.code ? (
    <View style={{ width: '100%' }}>
      {/* <Separator />
      <WahaItem title={translations.security.enable_timeout_picker_label}>
        <Switch
          trackColor={{ false: colors.chateau, true: colors.apple }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.chateau}
          onValueChange={() => {
            // toggle security mode on or off
            if (security.timeoutDuration === null)
              setTimeoutDuration(0)
            else setTimeoutDuration(null)
          }}
          value={security.timeoutDuration !== null ? true : false}
          disabled={security.securityEnabled ? false : true}
        />
      </WahaItem>
      <Separator />
      <WahaItemDescription
        text={translations.security.enable_timeout_picker_blurb}
      /> */}
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
      <Separator />
      <WahaItem
        title={translations.security.change_key_order_button_label}
        onPress={() => navigate('KeyOrderChange_Old')}
      >
        <Icon
          name={isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator />
      {/* <WahaItem
        title={translations.security.view_key_order_button_label}
        onPress={() => setShowViewKeyOrderModal(true)}
      >
        <Icon
          name={isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator /> */}
    </View>
  ) : null

  //+ RENDER

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{
          width: '100%'
        }}
      >
        <Hero source={require('../assets/gifs/piano_unlock.gif')} />

        <Blurb text={translations.security.security_mode_description_text} />

        <Separator />
        <WahaItem title={translations.security.security_mode_picker_label}>
          <Switch
            trackColor={{ false: colors.chateau, true: colors.apple }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.chateau}
            onValueChange={() => {
              // toggle security mode on or off for the active group
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
        <WahaItemDescription
          text={
            security.code
              ? translations.security.security_mode_picker_blurb_post_code
              : translations.security.security_mode_picker_blurb_pre_code
          }
        />
        {securityControls}
      </ScrollView>
      {/* <MessageModal
        isVisible={showViewKeyOrderModal}
        hideModal={() => setShowViewKeyOrderModal(false)}
        title={translations.security.your_key_order_label}
        body={translations.security.security_mode_description_text}
        confirmText={translations.general.close}
        confirmOnPress={() => setShowViewKeyOrderModal(false)}
      >
        <Piano setPattern={() => {}} />
        <KeyLabels keyOrder={security.code} />
      </MessageModal> */}
      <OptionsModal
        isVisible={showChangeTimeoutModal}
        hideModal={() => setShowChangeTimeoutModal(false)}
        closeText={translations.general.cancel}
      >
        <OptionsModalButton
          title={translations.security.instant_label}
          onPress={() => {
            setTimeoutDuration(0), setShowChangeTimeoutModal(false)
          }}
        >
          {security.timeoutDuration === 0 ? (
            <Icon
              name='check'
              color={colors.apple}
              size={30 * scaleMultiplier}
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                paddingHorizontal: 20
              }}
            />
          ) : null}
        </OptionsModalButton>
        <Separator />
        <OptionsModalButton
          title={translations.security.one_minute_label}
          onPress={() => {
            setTimeoutDuration(60000), setShowChangeTimeoutModal(false)
          }}
        >
          {security.timeoutDuration === 60000 ? (
            <Icon
              name='check'
              color={colors.apple}
              size={30 * scaleMultiplier}
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                paddingHorizontal: 20
              }}
            />
          ) : null}
        </OptionsModalButton>
        <Separator />
        <OptionsModalButton
          title={translations.security.five_minutes_label}
          onPress={() => {
            setTimeoutDuration(300000), setShowChangeTimeoutModal(false)
          }}
        >
          {security.timeoutDuration === 300000 ? (
            <Icon
              name='check'
              color={colors.apple}
              size={30 * scaleMultiplier}
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                paddingHorizontal: 20
              }}
            />
          ) : null}
        </OptionsModalButton>
        <Separator />
        <OptionsModalButton
          title={translations.security.fifteen_minutes_label}
          onPress={() => {
            setTimeoutDuration(900000), setShowChangeTimeoutModal(false)
          }}
        >
          {security.timeoutDuration === 900000 ? (
            <Icon
              name='check'
              color={colors.apple}
              size={30 * scaleMultiplier}
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                paddingHorizontal: 20
              }}
            />
          ) : null}
        </OptionsModalButton>
        <Separator />
        <OptionsModalButton
          title={translations.security.one_hour_label}
          onPress={() => {
            setTimeoutDuration(3600000), setShowChangeTimeoutModal(false)
          }}
        >
          {security.timeoutDuration === 3600000 ? (
            <Icon
              name='check'
              color={colors.apple}
              size={30 * scaleMultiplier}
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                paddingHorizontal: 20
              }}
            />
          ) : null}
        </OptionsModalButton>
      </OptionsModal>
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setIsTimedOut: toSet => dispatch(setIsTimedOut(toSet)),
    setTimeoutDuration: ms => dispatch(setTimeoutDuration(ms))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityScreen)
