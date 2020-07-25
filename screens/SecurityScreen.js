import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import KeyLabel from '../components/KeyLabel'
import MessageModal from '../components/MessageModal'
import Piano from '../components/Piano'
import { colors, keyColors, scaleMultiplier } from '../constants'
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

  var securityControls = props.security.code ? (
    <View style={{ width: '100%', marginTop: 50 * scaleMultiplier }}>
      {/* activate on switch button */}
      <View
        style={[
          styles.unlockButton,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
      >
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text
            style={{
              color: colors.shark,
              fontFamily: props.font + '-medium',
              fontSize: 18 * scaleMultiplier
            }}
          >
            {props.translations.security.activate_on_switch_picker_label}
          </Text>
          <Text
            style={{
              fontFamily: props.font + '-regular',
              fontSize: 14 * scaleMultiplier,
              color: colors.chateau
            }}
            numberOfLines={2}
          >
            {props.translations.security.activate_on_switch_picker_blurb}
          </Text>
        </View>
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
      </View>
      {/* Change key order button */}
      <TouchableOpacity
        style={[
          styles.unlockButton,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={() => props.navigation.navigate('KeyOrderChange_Old')}
      >
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text
            style={{
              fontFamily: props.font + '-medium',
              fontSize: 18 * scaleMultiplier,
              color: colors.shark
            }}
          >
            {props.translations.security.change_key_order_button_label}
          </Text>
        </View>
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </TouchableOpacity>
      {/* View key order button */}
      <TouchableOpacity
        style={[
          styles.unlockButton,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={() => setShowViewKeyOrderModal(true)}
      >
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text
            style={{
              fontFamily: props.font + '-medium',
              fontSize: 18 * scaleMultiplier,
              color: colors.shark
            }}
          >
            {props.translations.security.view_key_order_button_label}
          </Text>
        </View>
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </TouchableOpacity>
    </View>
  ) : null

  //// RENDER

  return (
    <ScrollView style={styles.screen}>
      <View
        style={{
          backgroundColor: colors.white,
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderColor: colors.athens,
          height: 180 * scaleMultiplier,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text>animation here</Text>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14 * scaleMultiplier,
            fontFamily: props.font + '-regular',
            paddingHorizontal: 20,
            marginVertical: 10,
            color: colors.shark
          }}
        >
          {props.translations.security.security_mode_description_text}
        </Text>
        <View
          style={[
            styles.unlockButton,
            {
              flexDirection: props.isRTL ? 'row-reverse' : 'row',
              marginTop: 50 * scaleMultiplier
            }
          ]}
        >
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text
              style={{
                fontFamily: props.font + '-medium',
                fontSize: 18 * scaleMultiplier,
                color: colors.shark
              }}
            >
              {props.translations.security.security_mode_picker_label}
            </Text>
            <Text
              style={{
                fontFamily: props.font + '-regular',
                fontSize: 14 * scaleMultiplier,
                color: colors.chateau
              }}
              numberOfLines={2}
            >
              {props.translations.security.security_mode_picker_blurb}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
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
        </View>
        {securityControls}
      </View>
      {/* <MessageModal
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
      /> */}
      <MessageModal
        isVisible={showViewKeyOrderModal}
        hideModal={() => setShowViewKeyOrderModal(false)}
        title={props.translations.security.your_key_order_label}
        body={
          props.translations.security.popups
            .activate_security_mode_confirmation_message
        }
        confirmText={props.translations.general.close}
        confirmOnPress={() => setShowViewKeyOrderModal(false)}
        topComponent={
          props.security.code ? (
            <View style={{ justifyContent: 'center' }}>
              <Piano setPattern={() => {}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20
                }}
              >
                <View style={styles.keyPlaceholder}>
                  <KeyLabel
                    backgroundColor={
                      keyColors[
                        props.security.code.substr(0, 2).replace(/^0+/, '')
                      ]
                    }
                    number={props.security.code.substr(0, 2).replace(/^0+/, '')}
                    style={{ alignSelf: null, marginBottom: 0 }}
                  />
                </View>
                <View style={styles.keyPlaceholder}>
                  <KeyLabel
                    backgroundColor={
                      keyColors[
                        props.security.code.substr(2, 2).replace(/^0+/, '')
                      ]
                    }
                    number={props.security.code.substr(2, 2).replace(/^0+/, '')}
                    style={{ alignSelf: null, marginBottom: 0 }}
                  />
                </View>
                <View style={styles.keyPlaceholder}>
                  <KeyLabel
                    backgroundColor={
                      keyColors[
                        props.security.code.substr(4, 2).replace(/^0+/, '')
                      ]
                    }
                    number={props.security.code.substr(4, 2).replace(/^0+/, '')}
                    style={{ alignSelf: null, marginBottom: 0 }}
                  />
                </View>
                <View style={styles.keyPlaceholder}>
                  <KeyLabel
                    backgroundColor={
                      keyColors[
                        props.security.code.substr(6, 2).replace(/^0+/, '')
                      ]
                    }
                    number={props.security.code.substr(6, 2).replace(/^0+/, '')}
                    style={{ alignSelf: null, marginBottom: 0 }}
                  />
                </View>
              </View>
            </View>
          ) : null
        }
      />
    </ScrollView>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
    // alignItems: 'center'
  },
  unlockButton: {
    width: '100%',
    height: 100 * scaleMultiplier,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.athens,
    flexDirection: 'row',
    alignItems: 'center',
    //marginVertical: 40 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  keyPlaceholder: {
    width: 80 * scaleMultiplier,
    height: 80 * scaleMultiplier,
    borderRadius: 40 * scaleMultiplier,
    backgroundColor: colors.chateau,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center'
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
