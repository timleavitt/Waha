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
import { colors, scaleMultiplier } from '../constants'
import OptionsModal from '../modals/OptionsModal'
import {
  setIsTimedOut,
  setSecurityEnabled,
  setTimeoutDuration
} from '../redux/actions/securityActions'

function SecurityScreen (props) {
  //+ STATE
  const [showSecurityWarningModal, setShowSecurityWarningModal] = useState(
    false
  )

  const [showViewKeyOrderModal, setShowViewKeyOrderModal] = useState(false)

  const [showChangeTimeoutModal, setShowChangeTimeoutModal] = useState(false)
  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  function getTimeoutText () {
    if (props.security.timeoutDuration === 60000)
      return props.translations.security.one_minute_label
    else if (props.security.timeoutDuration === 300000)
      return props.translations.security.five_minutes_label
    else if (props.security.timeoutDuration === 900000)
      return props.translations.security.fifteen_minutes_label
    else if (props.security.timeoutDuration === 1800000)
      return props.translations.security.thirty_minutes_label
    else if (props.security.timeoutDuration === 3600000)
      return props.translations.security.one_hour_label
    else if (props.security.timeoutDuration === 0)
      return props.translations.security.instant_label
  }

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

  // extra controls for if security mode is enabled
  var securityControls = props.security.code ? (
    <View style={{ width: '100%' }}>
      {/* <Separator />
      <WahaItem title={props.translations.security.enable_timeout_picker_label}>
        <Switch
          trackColor={{ false: colors.chateau, true: colors.apple }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.chateau}
          onValueChange={() => {
            // toggle security mode on or off
            if (props.security.timeoutDuration === null)
              props.setTimeoutDuration(0)
            else props.setTimeoutDuration(null)
          }}
          value={props.security.timeoutDuration !== null ? true : false}
          disabled={props.security.securityEnabled ? false : true}
        />
      </WahaItem>
      <Separator />
      <WahaItemDescription
        text={props.translations.security.enable_timeout_picker_blurb}
      /> */}
      <Separator />
      <WahaItem
        title={props.translations.security.change_timeout_button_label}
        onPress={() => setShowChangeTimeoutModal(true)}
      >
        <View
          style={{
            flexDirection: props.isRTL ? 'row-reverse' : 'row',
            alignItems: 'center'
          }}
        >
          <Text
            style={Typography(props, 'h4', 'regular', 'left', colors.chateau)}
          >
            {getTimeoutText()}
          </Text>
          <Icon
            name={props.isRTL ? 'arrow-left' : 'arrow-right'}
            color={colors.tuna}
            size={50 * scaleMultiplier}
          />
        </View>
      </WahaItem>
      <Separator />
      <WahaItem
        title={props.translations.security.change_key_order_button_label}
        onPress={() => props.navigation.navigate('KeyOrderChange_Old')}
      >
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator />
      {/* <WahaItem
        title={props.translations.security.view_key_order_button_label}
        onPress={() => setShowViewKeyOrderModal(true)}
      >
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
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
      <Hero source={require('../assets/gifs/piano_unlock.gif')} />

      <Blurb
        text={props.translations.security.security_mode_description_text}
      />
      <ScrollView
        style={{
          width: '100%'
        }}
      >
        <Separator />
        <WahaItem
          title={props.translations.security.security_mode_picker_label}
        >
          <Switch
            trackColor={{ false: colors.chateau, true: colors.apple }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.chateau}
            onValueChange={() => {
              // toggle security mode on or off for the active group
              if (props.security.code) {
                if (props.security.securityEnabled) {
                  props.setSecurityEnabled(false)
                } else props.setSecurityEnabled(true)
              } else {
                props.navigation.navigate('SecurityOnboardingSlides')
              }
            }}
            value={props.security.securityEnabled}
          />
        </WahaItem>
        <Separator />
        <WahaItemDescription
          text={
            props.security.code
              ? props.translations.security.security_mode_picker_blurb_post_code
              : props.translations.security.security_mode_picker_blurb_pre_code
          }
        />
        {securityControls}
      </ScrollView>
      {/* <MessageModal
        isVisible={showViewKeyOrderModal}
        hideModal={() => setShowViewKeyOrderModal(false)}
        title={props.translations.security.your_key_order_label}
        body={props.translations.security.security_mode_description_text}
        confirmText={props.translations.general.close}
        confirmOnPress={() => setShowViewKeyOrderModal(false)}
      >
        <Piano setPattern={() => {}} />
        <KeyLabels keyOrder={props.security.code} />
      </MessageModal> */}
      <OptionsModal
        isVisible={showChangeTimeoutModal}
        hideModal={() => setShowChangeTimeoutModal(false)}
        closeText={props.translations.general.cancel}
      >
        <OptionsModalButton
          title={props.translations.security.instant_label}
          onPress={() => {
            props.setTimeoutDuration(0), setShowChangeTimeoutModal(false)
          }}
        >
          {props.security.timeoutDuration === 0 ? (
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
          title={props.translations.security.one_minute_label}
          onPress={() => {
            props.setTimeoutDuration(60000), setShowChangeTimeoutModal(false)
          }}
        >
          {props.security.timeoutDuration === 60000 ? (
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
          title={props.translations.security.five_minutes_label}
          onPress={() => {
            props.setTimeoutDuration(300000), setShowChangeTimeoutModal(false)
          }}
        >
          {props.security.timeoutDuration === 300000 ? (
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
          title={props.translations.security.fifteen_minutes_label}
          onPress={() => {
            props.setTimeoutDuration(900000), setShowChangeTimeoutModal(false)
          }}
        >
          {props.security.timeoutDuration === 900000 ? (
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
          title={props.translations.security.one_hour_label}
          onPress={() => {
            props.setTimeoutDuration(3600000), setShowChangeTimeoutModal(false)
          }}
        >
          {props.security.timeoutDuration === 3600000 ? (
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
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
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
