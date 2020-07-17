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
import { setSecurityEnabled } from '../redux/actions/securityEnabledActions'

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
          alignItems: 'center',
          marginVertical: 50
        }}
      >
        <View
          style={[
            styles.unlockButton,
            { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <Text
            style={{
              fontFamily: props.font + '-medium',
              fontSize: 18 * scaleMultiplier
            }}
          >
            {props.translations.labels.securityMode}
          </Text>
          <Switch
            trackColor={{ false: '#DEE3E9', true: '#60C239' }}
            thumbColor='#FFFFFF'
            ios_backgroundColor='#DEE3E9'
            onValueChange={() => {
              // toggle security mode on or off for the active group
              if (props.securityEnabled) props.setSecurityEnabled(false)
              else setShowSecurityWarningModal(true)
            }}
            value={props.securityEnabled}
          />
        </View>
      </View>
      <MessageModal
        isVisible={showSecurityWarningModal}
        hideModal={() => setShowSecurityWarningModal(false)}
        title={props.translations.modals.securityWarning.header}
        body={props.translations.modals.securityWarning.text}
        confirmText={props.translations.modals.securityWarning.confirm}
        confirmOnPress={() => {
          props.setSecurityEnabled(true)
          setShowSecurityWarningModal(false)
        }}
        cancelText={props.translations.modals.securityWarning.cancel}
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
    height: 80 * scaleMultiplier,
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
    securityEnabled: state.securityEnabled
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityScreen)
