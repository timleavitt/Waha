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
  Alert
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import AvatarImage from '../components/AvatarImage'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'
import { getStateFromPath } from '@react-navigation/native'
import BackButton from '../components/BackButton'
import LanguageInstanceHeaderToolkit from '../components/LanguageInstanceHeaderToolkit'
function ToolkitEnableScreen (props) {
  //// STATE

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

  function getInstalledLanguageInstances () {
    var installedLanguageInstances = []
    for (key in props.database) {
      if (key.length === 2) {
        var languageObject = {}
        languageObject['languageName'] = props.database[key].displayName
        languageObject['languageID'] = key
        installedLanguageInstances.push(languageObject)
      }
    }
    return installedLanguageInstances
  }

  //// RENDER

  function renderLanguageHeader (languageInstances) {
    return (
      <LanguageInstanceHeaderToolkit
        languageName={languageInstances.item.languageName}
        languageID={languageInstances.item.languageID}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <Text
        style={{
          fontFamily: props.font + '-regular',
          fontSize: 14 * scaleMultiplier,
          marginTop: 10
        }}
      >
        {props.toolkitEnabled
          ? 'toolkit is currently enabled'
          : 'toolkit is currently disabled'}
      </Text>
      <TouchableOpacity
        style={[
          styles.unlockButton,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={
          props.toolkitEnabled
            ? () =>
                Alert.alert('Toolkit Unlock Code:', '281820', [
                  {
                    text: props.translations.alerts.options.clipboard,
                    onPress: () => Clipboard.setString('281820')
                  },
                  {
                    text: props.translations.alerts.options.close,
                    onPress: () => {}
                  }
                ])
            : () => props.navigation.navigate('Passcode')
        }
      >
        <Text
          style={{
            fontFamily: props.font + '-medium',
            fontSize: 18 * scaleMultiplier
          }}
        >
          {props.toolkitEnabled ? 'View code' : 'Unlock toolkit'}
        </Text>
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          color='#3A3C3F'
          size={50 * scaleMultiplier}
        />
      </TouchableOpacity>
      <View style={{ width: '100%', flex: 1 }}>
        <FlatList
          data={getInstalledLanguageInstances()}
          renderItem={renderLanguageHeader}
          keyExtractor={item => item.languageID}
        />
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9FA',
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
    marginVertical: 40 * scaleMultiplier,
    paddingHorizontal: 15,
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
    toolkitEnabled: state.toolkitEnabled
  }
}
function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolkitEnableScreen)
