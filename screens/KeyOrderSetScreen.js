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
import { logEnableSecurityMode } from '../LogEventFunctions'
import { setCode, setSecurityEnabled } from '../redux/actions/securityActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    security: state.security,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setCode: code => dispatch(setCode(code))
  }
}

function KeyOrderSetScreen ({
  // Props passed from navigation.
  navigation: { setOptions, navigate, goBack },
  route: {
    name: routeName,
    // Props passed from previous screen.
    params: { keyOrder } = { keyOrder: null }
  },
  // Props passed from redux.
  translations,
  font,
  security,
  isRTL,
  activeGroup,
  setSecurityEnabled,
  setCode
}) {
  const [localKeyOrder, setLocalKeyOrder] = useState('')
  const [instructionText, setInstructionText] = useState('')
  //+ CONSTRUCTOR

  useEffect(() => {
    switch (routeName) {
      case 'KeyOrderSet_Initial':
        setInstructionText(translations.security.choose_key_order_label)
        break
      case 'KeyOrderSet_Confirm':
        setInstructionText(translations.security.confirm_key_order_label)
        break
      case 'KeyOrderChange_Old':
        setInstructionText(translations.security.enter_old_key_order_label)
        break
      case 'KeyOrderChange_Initial':
        setInstructionText(translations.security.choose_new_key_order_label)
        break
      case 'KeyOrderChange_Confirm':
        setInstructionText(translations.security.confirm_new_key_order_label)
        break
    }
    setOptions(getNavOptions())
  }, [])

  useEffect(() => {
    if (localKeyOrder.length === 12) {
      switch (routeName) {
        case 'KeyOrderSet_Initial':
          navigate('KeyOrderSet_Confirm', {
            keyOrder: localKeyOrder
          })
          setLocalKeyOrder('')
          break
        case 'KeyOrderSet_Confirm':
          if (localKeyOrder === keyOrder) {
            Alert.alert(
              translations.security.popups.key_order_set_confirmation_title,
              translations.security.popups.key_order_set_confirmation_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
            // Log the enabling of Security Mode in Firebase analytics.
            logEnableSecurityMode(activeGroup.id)

            setSecurityEnabled(true)
            setCode(keyOrder)
            goBack()
            goBack()
            goBack()
          } else {
            Alert.alert(
              translations.security.popups.no_match_title,
              translations.security.popups.no_match_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
            goBack()
          }
          break
        case 'KeyOrderChange_Old':
          if (localKeyOrder === security.code) {
            navigate('KeyOrderChange_Initial')
          } else {
            setLocalKeyOrder('')
            Alert.alert(
              translations.security.popups.incorrect_key_order_enetered_title,
              translations.security.popups.incorrect_key_order_enetered_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
          }
          break
        case 'KeyOrderChange_Initial':
          navigate('KeyOrderChange_Confirm', {
            keyOrder: localKeyOrder
          })
          setLocalKeyOrder('')
          break
        case 'KeyOrderChange_Confirm':
          if (localKeyOrder === keyOrder) {
            Alert.alert(
              translations.security.popups.key_order_set_confirmation_title,
              translations.security.popups.key_order_set_confirmation_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
            setSecurityEnabled(true)
            setCode(localKeyOrder)
            goBack()
            goBack()
            goBack()
          } else {
            Alert.alert(
              translations.security.popups.no_match_title,
              translations.security.popups.no_match_message,
              [{ text: translations.general.ok, onPress: () => {} }]
            )
            goBack()
          }
          break
      }
    }
  }, [localKeyOrder])

  function getNavOptions () {
    return {
      title: routeName.includes('Set')
        ? translations.security.header_set_key_order
        : translations.security.header_change_key_order,
      headerRight: isRTL
        ? () => (
            <BackButton
              onPress={() => {
                goBack()

                if (
                  routeName === 'KeyOrderSet_Initial' ||
                  routeName === 'KeyOrderChange_Initial'
                )
                  goBack()
              }}
            />
          )
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => (
            <BackButton
              onPress={() => {
                goBack()

                if (
                  routeName === 'KeyOrderSet_Initial' ||
                  routeName === 'KeyOrderChange_Initial'
                )
                  goBack()
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
              { font, isRTL },
              'h2',
              'Bold',
              'center',
              colors.shark
            )}
          >
            {instructionText}
          </Text>
        </View>
        <KeyLabelGroup keyOrder={localKeyOrder} />
        <WahaButton
          type='outline'
          onPress={() => setLocalKeyOrder('')}
          color={colors.red}
          label={translations.security.clear_button_label}
          width={Dimensions.get('window').width / 3}
          style={{ marginVertical: 0 }}
        />
      </View>
      <Piano setPattern={setLocalKeyOrder} />
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

export default connect(mapStateToProps, mapDispatchToProps)(KeyOrderSetScreen)
