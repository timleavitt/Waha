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
import BackButton from '../components/BackButton'
import KeyLabels from '../components/KeyLabels'
import Piano from '../components/Piano'
import WahaButton from '../components/WahaButton'
import { colors } from '../constants'
import { setCode, setSecurityEnabled } from '../redux/actions/securityActions'
function KeyOrderSetScreen (props) {
  //// STATE

  const [keyOrder, setKeyOrder] = useState('')
  const [instructionText, setInstructionText] = useState('')
  //// CONSTRUCTOR

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

  //// RENDER

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={{ width: '100%' }}>
          <Text
            style={Typography(props, 'h2', 'medium', 'center', colors.shark)}
          >
            {instructionText}
          </Text>
        </View>
        <KeyLabels keyOrder={keyOrder} />
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

//// STYLES

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
    font: state.database[activeGroup.language].font,
    security: state.security,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setCode: code => dispatch(setCode(code))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyOrderSetScreen)
