import React, { useEffect, useState } from 'react'
import {
  Alert,
  Clipboard,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import GroupListHeaderMT from '../components/GroupListHeaderMT'
import MessageModal from '../components/MessageModal'
import { colors, scaleMultiplier } from '../constants'
function MTScreen (props) {
  //// STATE
  const [showHowMTsWorkModal, setShowHotMTsWorkModal] = useState(false)

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

  var howMTsWork = props.toolkitEnabled ? (
    <TouchableOpacity
      style={[
        styles.unlockButton,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={() => setShowHotMTsWorkModal(true)}
    >
      <Text
        style={{
          color: colors.shark,
          fontFamily: props.font + '-medium',
          fontSize: 18 * scaleMultiplier
        }}
      >
        {
          props.translations.mobilization_tools
            .how_mobilization_tools_work_label
        }
      </Text>
      <Icon
        name={props.isRTL ? 'arrow-left' : 'arrow-right'}
        color={colors.tuna}
        size={50 * scaleMultiplier}
      />
    </TouchableOpacity>
  ) : null

  var groupList = props.toolkitEnabled ? (
    <FlatList
      data={getInstalledLanguageInstances()}
      renderItem={renderLanguageHeader}
      keyExtractor={item => item.languageID}
    />
  ) : null

  function renderLanguageHeader (languageInstances) {
    return (
      <GroupListHeaderMT
        languageName={languageInstances.item.languageName}
        languageID={languageInstances.item.languageID}
        toolkitEnabled={props.toolkitEnabled}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <Text
        style={{
          color: colors.shark,
          fontFamily: props.font + '-regular',
          fontSize: 14 * scaleMultiplier,
          marginTop: 10
        }}
      >
        {props.toolkitEnabled
          ? 'toolkit is currently enabled'
          : 'toolkit is currently disabled'}
      </Text>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginVertical: 50
        }}
      >
        <TouchableOpacity
          style={[
            styles.unlockButton,
            { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
          ]}
          onPress={
            props.toolkitEnabled
              ? () =>
                  Alert.alert(
                    props.translations.mobilization_tools.mt_code_title,
                    '281820',
                    [
                      {
                        text: props.translations.general.clipboard,
                        onPress: () => Clipboard.setString('281820')
                      },
                      {
                        text: props.translations.general.close,
                        onPress: () => {}
                      }
                    ]
                  )
              : () => props.navigation.navigate('Passcode')
          }
        >
          <Text
            style={{
              color: colors.shark,
              fontFamily: props.font + '-medium',
              fontSize: 18 * scaleMultiplier
            }}
          >
            {props.toolkitEnabled
              ? props.translations.mobilization_tools.view_code_button_label
              : props.translations.mobilization_tools.unlock_mt_button_label}
          </Text>
          <Icon
            name={props.isRTL ? 'arrow-left' : 'arrow-right'}
            color={colors.tuna}
            size={50 * scaleMultiplier}
          />
        </TouchableOpacity>
        {howMTsWork}
      </View>
      <View style={{ width: '100%', flex: 1 }}>{groupList}</View>
      <MessageModal
        isVisible={showHowMTsWorkModal}
        hideModal={() => setShowHotMTsWorkModal(false)}
        title={
          props.translations.mobilization_tools.how_to_enable_mt_content_title
        }
        body={
          props.translations.mobilization_tools.how_to_enable_mt_content_message
        }
        confirmText={props.translations.general.got_it}
        confirmOnPress={() => setShowHotMTsWorkModal(false)}
        imageSource={require('../assets/gifs/unlock_mob_tools.gif')}
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    alignItems: 'center'
  },
  unlockButton: {
    width: '100%',
    height: 80 * scaleMultiplier,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.athens,
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
    toolkitEnabled: state.toolkitEnabled
  }
}

export default connect(mapStateToProps)(MTScreen)
