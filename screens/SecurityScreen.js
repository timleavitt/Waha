import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Switch, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import Blurb from '../components/Blurb'
import KeyLabels from '../components/KeyLabels'
import MessageModal from '../components/MessageModal'
import Piano from '../components/Piano'
import Separator from '../components/Separator'
import WahaItem from '../components/WahaItem'
import WahaItemDescription from '../components/WahaItemDescription'
import { colors, scaleMultiplier } from '../constants'
import {
  setActivateOnSwitch,
  setSecurityEnabled
} from '../redux/actions/securityActions'
function SecurityScreen (props) {
  //// STATE
  const [showSecurityWarningModal, setShowSecurityWarningModal] = useState(
    false
  )

  const [showViewKeyOrderModal, setShowViewKeyOrderModal] = useState(false)
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

  // extra controls for if security mode is enabled
  var securityControls = props.security.code ? (
    <View style={{ width: '100%', marginTop: 20 * scaleMultiplier }}>
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
      <WahaItem
        title={props.translations.security.view_key_order_button_label}
        onPress={() => setShowViewKeyOrderModal(true)}
      >
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator />
    </View>
  ) : null

  //// RENDER

  return (
    <ScrollView style={styles.screen}>
      <Separator />
      <View style={styles.topPortion}>
        <Image
          style={styles.topImage}
          source={require('../assets/gifs/piano_unlock.gif')}
        />
      </View>
      <Separator />
      <View
        style={{
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Blurb
          text={props.translations.security.security_mode_description_text}
        />
        <Separator />
        <WahaItem
          title={props.translations.security.security_mode_picker_label}
        >
          <View
            style={{
              flexDirection: props.isRTL ? 'row-reverse' : 'row',
              alignItems: 'center'
            }}
          >
            <Icon
              name='error-filled'
              size={40 * scaleMultiplier}
              color={colors.red}
              style={{ marginHorizontal: 20 }}
            />
            <Switch
              trackColor={{ false: colors.chateau, true: colors.apple }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.chateau}
              onValueChange={() => {
                // toggle security mode on or off for the active group
                if (props.security.code) {
                  if (props.security.securityEnabled) {
                    props.setSecurityEnabled(false)
                    props.setActivateOnSwitch(false)
                  } else props.setSecurityEnabled(true)
                } else {
                  props.navigation.navigate('SecurityOnboarding')
                }
              }}
              value={props.security.securityEnabled}
            />
          </View>
        </WahaItem>
        <Separator />
        <WahaItemDescription
          text={props.translations.security.security_mode_picker_blurb}
        />
        {securityControls}
      </View>
      <MessageModal
        isVisible={showViewKeyOrderModal}
        hideModal={() => setShowViewKeyOrderModal(false)}
        title={props.translations.security.your_key_order_label}
        body={props.translations.security.security_mode_description_text}
        confirmText={props.translations.general.close}
        confirmOnPress={() => setShowViewKeyOrderModal(false)}
      >
        <Piano setPattern={() => {}} />
        <KeyLabels keyOrder={props.security.code} />
      </MessageModal>
    </ScrollView>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  },
  topPortion: {
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    resizeMode: 'contain',
    height: 175 * scaleMultiplier,
    alignSelf: 'center'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  console.log(state.security)
  return {
    database: state.database,
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup,
    toolkitEnabled: state.toolkitEnabled,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setActivateOnSwitch: toSet => dispatch(setActivateOnSwitch(toSet))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityScreen)

{
  /* <MessageModal
        isVisible={showSecurityWarningModal}
        hideModal={() => setShowSecurityWarningModal(false)}
        title={
          props.translations.security.popups
            .activate_security_mode_confirmation_title
        }
        body={
          props.translations.security.popups
            .activate_security_mode_confirmation_message
        }
        confirmText={props.translations.general.i_understand}
        confirmOnPress={() => {
          props.setSecurityEnabled(true)
          setShowSecurityWarningModal(false)
        }}
        cancelText={props.translations.general.cancel}
        cancelOnPress={() => setShowSecurityWarningModal(false)}
        imageSource={require('../assets/gifs/unlock_mob_tools.gif')}
      /> */
}

{
  /* <WahaItem
        title={props.translations.security.activate_on_switch_picker_label}
      >
        <Switch
          trackColor={{ false: colors.chateau, true: colors.apple }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.chateau}
          onValueChange={() => {
            // toggle security mode on or off
            if (props.security.activateOnSwitch)
              props.setActivateOnSwitch(false)
            else props.setActivateOnSwitch(true)
          }}
          value={props.security.activateOnSwitch}
          disabled={props.security.securityEnabled ? false : true}
        />
      </WahaItem>
      <Separator /> */
}
