import React, { useEffect, useState } from 'react'
import {
  Alert,
  Clipboard,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import GroupListHeaderMT from '../components/list-headers/GroupListHeaderMT'
import GroupItemMT from '../components/list-items/GroupItemMT'
import BackButton from '../components/standard/BackButton'
import Blurb from '../components/standard/Blurb'
import Hero from '../components/standard/Hero'
import Separator from '../components/standard/Separator'
import WahaItem from '../components/standard/WahaItem'
import { colors, scaleMultiplier } from '../constants'

function MobilizationToolsScreen (props) {
  //+ STATE
  const [showHowMTsWorkModal, setShowHowMTsWorkModal] = useState(false)

  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  //+ NAV OPTIONS
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

  //+ RENDER

  // section list render functions
  function renderLanguageInstanceItem (section) {
    return (
      <GroupListHeaderMT
        languageName={section.title}
        languageID={section.languageID}
        areMobilizationToolsUnlocked={props.areMobilizationToolsUnlocked}
      />
    )
  }

  function renderGroupItem (group) {
    return <GroupItemMT group={group} />
  }

  // list of all the groups with options to turn MTs on or off for each

  return (
    <View style={styles.screen}>
      {props.areMobilizationToolsUnlocked ? (
        <Hero source={require('../assets/gifs/unlock_mob_tools.gif')} />
      ) : null}
      <Blurb
        text={
          props.areMobilizationToolsUnlocked
            ? props.translations.mobilization_tools.mobilization_tools_vision
            : props.translations.mobilization_tools
                .mobilization_tools_pre_unlock
        }
      />

      {props.areMobilizationToolsUnlocked ? null : (
        <View style={{ width: '100%' }}>
          <Separator />
          <WahaItem
            title={props.translations.mobilization_tools.unlock_mt_button_label}
            onPress={() => props.navigation.navigate('Passcode')}
          >
            <Icon
              name={props.isRTL ? 'arrow-left' : 'arrow-right'}
              color={colors.tuna}
              size={50 * scaleMultiplier}
            />
          </WahaItem>
          <Separator />
        </View>
      )}

      {/* list of groups with option to enable MTs for each group */}
      <View style={{ width: '100%', flex: 1 }}>
        {props.areMobilizationToolsUnlocked ? (
          <SectionList
            sections={getLanguageAndGroupData()}
            renderItem={({ item, section }) => {
              return props.database[section.languageID].sets.some(set => {
                return /[a-z]{2}.3.[0-9]+/.test(set.id)
              }) ? (
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
                    style={Typography(
                      props,
                      'p',
                      'regular',
                      'center',
                      colors.chateau
                    )}
                  >
                    {
                      props.translations.mobilization_tools
                        .no_mobilization_tools_content_text
                    }
                  </Text>
                </View>
              )
            }}
            ListHeaderComponent={() => (
              <View>
                <Separator />
                <WahaItem
                  title={
                    props.areMobilizationToolsUnlocked
                      ? props.translations.mobilization_tools
                          .view_code_button_label
                      : props.translations.mobilization_tools
                          .unlock_mt_button_label
                  }
                  onPress={
                    props.areMobilizationToolsUnlocked
                      ? () =>
                          Alert.alert(
                            props.translations.mobilization_tools.mt_code_title,
                            '281820',
                            [
                              {
                                text:
                                  props.translations.general.copy_to_clipboard,
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
                <View style={{ width: '100%', height: 20 * scaleMultiplier }} />
              </View>
            )}
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
    </View>
  )
}

//+ STYLES

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

//+ REDUX

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
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    groups: state.groups
  }
}

export default connect(mapStateToProps)(MobilizationToolsScreen)
