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
import KeyLabelGroup from '../components/piano-stuff/KeyLabelGroup'
import Piano from '../components/piano-stuff/Piano'
import BackButton from '../components/standard/BackButton'
import WahaButton from '../components/standard/WahaButton'
import { colors, getLanguageFont } from '../constants'
import { setCode, setSecurityEnabled } from '../redux/actions/securityActions'
import { logEnableSecurityMode } from '../redux/LogEventFunctions'
import { StandardTypography } from '../styles/typography'

function KeyOrderSetScreen (props) {
  //+ STATE

  const [keyOrder, setKeyOrder] = useState('')
  const [instructionText, setInstructionText] = useState('')
  //+ CONSTRUCTOR

  useEffect(() => {
    switch (props.route.name) {
      case 'KeyOrderSet_Initial':
        setInstructionText(props.translations.security.choose_key_order_label)
        break
      case 'KeyOrderSet_Confirm':
        setInstructionText(props.translations.security.confirm_key_order_label)
        break
      case 'KeyOrderChange_Old':
        setInstructionText(
          props.translations.security.enter_old_key_order_label
        )
        break
      case 'KeyOrderChange_Initial':
        setInstructionText(
          props.translations.security.choose_new_key_order_label
        )
        break
      case 'KeyOrderChange_Confirm':
        setInstructionText(
          props.translations.security.confirm_new_key_order_label
        )
        break
    }
    props.navigation.setOptions(getNavOptions())
  }, [])

  useEffect(() => {
    if (keyOrder.length === 12) {
      switch (props.route.name) {
        case 'KeyOrderSet_Initial':
          props.navigation.navigate('KeyOrderSet_Confirm', {
            keyOrder: keyOrder
          })
          setKeyOrder('')
          break
        case 'KeyOrderSet_Confirm':
          if (keyOrder === props.route.params.keyOrder) {
            Alert.alert(
              props.translations.security.popups
                .key_order_set_confirmation_title,
              props.translations.security.popups
                .key_order_set_confirmation_message,
              [{ text: props.translations.general.ok, onPress: () => {} }]
            )
            // Log the enabling of Security Mode in Firebase analytics.
            logEnableSecurityMode(props.activeGroup.id)

            props.setSecurityEnabled(true)
            props.setCode(keyOrder)
            props.navigation.goBack()
            props.navigation.goBack()
            props.navigation.goBack()
          } else {
            Alert.alert(
              props.translations.security.popups.no_match_title,
              props.translations.security.popups.no_match_message,
              [{ text: props.translations.general.ok, onPress: () => {} }]
            )
            props.navigation.goBack()
          }
          break
        case 'KeyOrderChange_Old':
          if (keyOrder === props.security.code) {
            props.navigation.navigate('KeyOrderChange_Initial')
          } else {
            setKeyOrder('')
            Alert.alert(
              props.translations.security.popups
                .incorrect_key_order_enetered_title,
              props.translations.security.popups
                .incorrect_key_order_enetered_message,
              [{ text: props.translations.general.ok, onPress: () => {} }]
            )
          }
          break
        case 'KeyOrderChange_Initial':
          props.navigation.navigate('KeyOrderChange_Confirm', {
            keyOrder: keyOrder
          })
          setKeyOrder('')
          break
        case 'KeyOrderChange_Confirm':
          if (keyOrder === props.route.params.keyOrder) {
            Alert.alert(
              props.translations.security.popups
                .key_order_set_confirmation_title,
              props.translations.security.popups
                .key_order_set_confirmation_message,
              [{ text: props.translations.general.ok, onPress: () => {} }]
            )
            props.setSecurityEnabled(true)
            props.setCode(keyOrder)
            props.navigation.goBack()
            props.navigation.goBack()
            props.navigation.goBack()
          } else {
            Alert.alert(
              props.translations.security.popups.no_match_title,
              props.translations.security.popups.no_match_message,
              [{ text: props.translations.general.ok, onPress: () => {} }]
            )
            props.navigation.goBack()
          }
          break
      }
    }
  }, [keyOrder])

  function getNavOptions () {
    return {
      title: props.route.name.includes('Set')
        ? props.translations.security.header_set_key_order
        : props.translations.security.header_change_key_order,
      headerRight: props.isRTL
        ? () => (
            <BackButton
              onPress={() => {
                props.navigation.goBack()

                if (
                  props.route.name === 'KeyOrderSet_Initial' ||
                  props.route.name === 'KeyOrderChange_Initial'
                )
                  props.navigation.goBack()
              }}
            />
          )
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => (
            <BackButton
              onPress={() => {
                props.navigation.goBack()

                if (
                  props.route.name === 'KeyOrderSet_Initial' ||
                  props.route.name === 'KeyOrderChange_Initial'
                )
                  props.navigation.goBack()
              }}
            />
          )
    }
  }

  //+ RENDER

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={{ width: '100%', paddingHorizontal: 20 }}>
          <Text
            style={StandardTypography(
              props,
              'h2',
              'Bold',
              'center',
              colors.shark
            )}
          >
            {instructionText}
          </Text>
        </View>
        <KeyLabelGroup keyOrder={keyOrder} />
        <WahaButton
          type='outline'
          onPress={() => setKeyOrder('')}
          color={colors.red}
          label={props.translations.security.clear_button_label}
          width={Dimensions.get('window').width / 3}
          style={{ marginVertical: 0 }}
        />
      </View>
      <Piano setPattern={setKeyOrder} />
    </SafeAreaView>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    security: state.security,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setCode: code => dispatch(setCode(code))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyOrderSetScreen)
