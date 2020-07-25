import React, { useEffect, useState } from 'react'
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import KeyLabel from '../components/KeyLabel'
import Piano from '../components/Piano'
import { colors, keyColors, scaleMultiplier } from '../constants'
import { setCode, setSecurityEnabled } from '../redux/actions/securityActions'
function KeyOrderSetScreen (props) {
  //// STATE

  const [keyOrder, setKeyOrder] = useState('')
  const [instructionText, setInstructionText] = useState('')
  //// CONSTRUCTOR

  useEffect(() => {
    console.log(props.route.name)
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
    console.log(keyOrder)

    if (keyOrder.length === 8) {
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

  var keyLabel1 = keyOrder[1] ? (
    <KeyLabel
      backgroundColor={keyColors[keyOrder.substr(0, 2).replace(/^0+/, '')]}
      number={keyOrder.substr(0, 2).replace(/^0+/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel2 = keyOrder[3] ? (
    <KeyLabel
      backgroundColor={keyColors[keyOrder.substr(2, 2).replace(/^0+/, '')]}
      number={keyOrder.substr(2, 2).replace(/^0+/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel3 = keyOrder[5] ? (
    <KeyLabel
      backgroundColor={keyColors[keyOrder.substr(4, 2).replace(/^0+/, '')]}
      number={keyOrder.substr(4, 2).replace(/^0+/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  var keyLabel4 = keyOrder[7] ? (
    <KeyLabel
      backgroundColor={keyColors[keyOrder.substr(6, 2).replace(/^0+/, '')]}
      number={keyOrder.substr(6, 2).replace(/^0+/, '')}
      style={{ alignSelf: null, marginBottom: 0 }}
    />
  ) : null

  //// RENDER

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ width: '100%' }}>
        <View style={{ width: '100%' }}>
          <Text
            style={{
              color: colors.shark,
              fontFamily: props.font + '-medium',
              fontSize: 24 * scaleMultiplier,
              textAlign: 'center'
            }}
          >
            {instructionText}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <View style={styles.keyPlaceholder}>{keyLabel1}</View>
          <View style={styles.keyPlaceholder}>{keyLabel2}</View>
          <View style={styles.keyPlaceholder}>{keyLabel3}</View>
          <View style={styles.keyPlaceholder}>{keyLabel4}</View>
        </View>
        <TouchableOpacity
          style={{
            marginHorizontal: 100,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.shark,
            padding: 20
          }}
          onPress={() => setKeyOrder('')}
        >
          <Text
            style={{
              color: colors.shark,
              textAlign: 'center',
              fontFamily: props.font + '-regular'
            }}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      <Piano setPattern={setKeyOrder} />
    </SafeAreaView>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  keyPlaceholder: {
    width: 80 * scaleMultiplier,
    height: 80 * scaleMultiplier,
    borderRadius: 40 * scaleMultiplier,
    backgroundColor: colors.white,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setCode: code => dispatch(setCode(code))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyOrderSetScreen)
