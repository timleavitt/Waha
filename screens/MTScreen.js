import React, { useEffect, useState } from 'react'
import {
  Alert,
  Clipboard,
  Image,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import Blurb from '../components/Blurb'
import GroupItemMT from '../components/GroupItemMT'
import GroupListHeaderMT from '../components/GroupListHeaderMT'
import MessageModal from '../components/MessageModal'
import Separator from '../components/Separator'
import WahaItem from '../components/WahaItem'
import { colors, scaleMultiplier } from '../constants'

function MTScreen (props) {
  //// STATE
  const [showHowMTsWorkModal, setShowHowMTsWorkModal] = useState(false)

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

  // get the list of installed languages and all the groups with that language
  //  to populate section list
  function getLanguageAndGroupData () {
    var installedLanguageInstances = []
    for (key in props.database) {
      if (key.length === 2) {
        var languageObject = {}
        languageObject['title'] = props.database[key].displayName
        languageObject['languageID'] = key

        // get groups for that language
        languageObject['data'] = props.groups.filter(
          group => group.language === key
        )
        installedLanguageInstances.push(languageObject)
      }
    }
    return installedLanguageInstances
  }

  //// RENDER

  // section list render functions
  function renderLanguageInstanceItem (section) {
    return (
      <GroupListHeaderMT
        languageName={section.title}
        languageID={section.languageID}
        toolkitEnabled={props.toolkitEnabled}
      />
    )
  }

  function renderGroupItem (group) {
    return <GroupItemMT group={group} />
  }

  // list of all the groups with options to turn MTs on or off for each

  return (
    <View style={styles.screen}>
      <Blurb
        text={
          props.toolkitEnabled
            ? 'Some vision for mobilization tools! This will probably be bigger when the vision is fully written.'
            : 'Enabling Mobilization Tools adds additional content. The passcode is passed from user to user, so you’ll need to find a user with the passcode to unlock this content.'
        }
      />
      <Separator />
      <WahaItem
        title={
          props.toolkitEnabled
            ? props.translations.mobilization_tools.view_code_button_label
            : props.translations.mobilization_tools.unlock_mt_button_label
        }
        onPress={
          props.toolkitEnabled
            ? () =>
                Alert.alert(
                  props.translations.mobilization_tools.mt_code_title,
                  '281820',
                  [
                    {
                      text: props.translations.general.copy_to_clipboard,
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
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator />

      {/* how enabling MTs work button */}
      {props.toolkitEnabled ? (
        <WahaItem
          title={
            props.translations.mobilization_tools
              .how_mobilization_tools_work_label
          }
          onPress={() => setShowHowMTsWorkModal(true)}
        >
          <Icon
            name={props.isRTL ? 'arrow-left' : 'arrow-right'}
            color={colors.tuna}
            size={50 * scaleMultiplier}
          />
        </WahaItem>
      ) : null}
      {props.toolkitEnabled ? <Separator /> : null}
      <View style={{ width: '100%', height: 20 }} />

      {/* list of groups with option to enable MTs for each group */}
      <View style={{ width: '100%', flex: 1 }}>
        {props.toolkitEnabled ? (
          <SectionList
            sections={getLanguageAndGroupData()}
            renderItem={({ item, section }) => {
              return props.database[section.languageID].hasToolkit ? (
                renderGroupItem(item)
              ) : (
                <View
                  style={{
                    height: 80 * scaleMultiplier,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.white,
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      fontFamily: props.font + '-regular',
                      fontSize: 14 * scaleMultiplier,
                      color: colors.chateau,
                      textAlign: 'center'
                    }}
                  >
                    {
                      props.translations.mobilization_tools
                        .no_mobilization_tools_content_text
                    }
                  </Text>
                </View>
              )
            }}
            renderSectionHeader={({ section }) =>
              renderLanguageInstanceItem(section)
            }
            renderSectionFooter={() => (
              <View style={{ height: 20, width: '100%' }} />
            )}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={() => <Separator />}
            SectionSeparatorComponent={() => <Separator />}
          />
        ) : null}
      </View>

      {/* modals */}
      <MessageModal
        isVisible={showHowMTsWorkModal}
        hideModal={() => setShowHowMTsWorkModal(false)}
        title={
          props.translations.mobilization_tools.popups
            .how_to_enable_mt_content_title
        }
        body={
          props.translations.mobilization_tools.popups
            .how_to_enable_mt_content_message
        }
        confirmText={props.translations.general.got_it}
        confirmOnPress={() => setShowHowMTsWorkModal(false)}
      >
        <Image
          source={require('../assets/gifs/unlock_mob_tools.gif')}
          style={{
            height: 200 * scaleMultiplier,
            margin: 20,
            // padding: 20,
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
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
    groups: state.groups
  }
}

export default connect(mapStateToProps)(MTScreen)
