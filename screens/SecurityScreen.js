import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  TouchableOpacity,
  Clipboard,
  Alert,
  Switch
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'
import { getStateFromPath } from '@react-navigation/native'
import BackButton from '../components/BackButton'
import GroupListHeaderMT from '../components/GroupListHeaderMT'
import MessageModal from '../components/MessageModal'
import {
  setSecurityEnabled,
  setActivateOnSwitch
} from '../redux/actions/securityActions'

function SecurityScreen (props) {
  //// STATE
  const [showSecurityWarningModal, setShowSecurityWarningModal] = useState(
    false
  )

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

  //// RENDER

  return (
    <View style={styles.screen}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderColor: '#EFF2F4',
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
            color: '#1D1E20'
          }}
        >
          {props.translations.security.security_mode_description_text}
        </Text>
        <View
          style={[
            styles.unlockButton,
            { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text
              style={{
                fontFamily: props.font + '-medium',
                fontSize: 18 * scaleMultiplier,
                color: '#1D1E20'
              }}
            >
              {props.translations.security.security_mode_picker_label}
            </Text>
            <Text
              style={{
                fontFamily: props.font + '-regular',
                fontSize: 14 * scaleMultiplier,
                color: '#82868D'
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
              color='#FF0800'
              style={{ marginHorizontal: 20 }}
            />
            <Switch
              trackColor={{ false: '#DEE3E9', true: '#60C239' }}
              thumbColor='#FFFFFF'
              ios_backgroundColor='#DEE3E9'
              onValueChange={() => {
                // toggle security mode on or off for the active group
                if (props.security.securityEnabled) {
                  props.setSecurityEnabled(false)
                  props.setActivateOnSwitch(false)
                } else setShowSecurityWarningModal(true)
              }}
              value={props.security.securityEnabled}
            />
          </View>
        </View>
        <View
          style={[
            styles.unlockButton,
            { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text
              style={{
                fontFamily: props.font + '-medium',
                fontSize: 18 * scaleMultiplier,
                color: '#1D1E20'
              }}
            >
              {props.translations.security.activate_on_switch_picker_label}
            </Text>
            <Text
              style={{
                fontFamily: props.font + '-regular',
                fontSize: 14 * scaleMultiplier,
                color: '#82868D'
              }}
              numberOfLines={2}
            >
              {props.translations.security.activate_on_switch_picker_blurb}
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#DEE3E9', true: '#60C239' }}
            thumbColor='#FFFFFF'
            ios_backgroundColor='#DEE3E9'
            onValueChange={() => {
              // toggle security mode on or off for the active group
              if (props.security.activateOnSwitch)
                props.setActivateOnSwitch(false)
              else props.setActivateOnSwitch(true)
            }}
            value={props.security.activateOnSwitch}
            disabled={props.security.securityEnabled ? false : true}
          />
        </View>
      </View>
      <MessageModal
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
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center'
  },
  unlockButton: {
    width: '100%',
    height: 100 * scaleMultiplier,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EFF2F4',
    flexDirection: 'row',
    alignItems: 'center',
    //marginVertical: 40 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  }
})

//// REDUX

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
