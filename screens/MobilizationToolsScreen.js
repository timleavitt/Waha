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
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    database: state.database,
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    groups: state.groups
  }
}

function MobilizationToolsScreen ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, navigate },
  // Props passed from redux.
  database,
  activeDatabase,
  isRTL,
  translations,
  font,
  activeGroup,
  areMobilizationToolsUnlocked,
  groups
}) {
  //+ STATE
  const [showHowMTsWorkModal, setShowHowMTsWorkModal] = useState(false)

  //+ CONSTRUCTOR

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  //+ NAV OPTIONS
  function getNavOptions () {
    return {
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />
    }
  }

  // get the list of installed languages and all the groups with that language
  //  to populate section list
  function getLanguageAndGroupData () {
    var installedLanguageInstances = []
    for (key in database) {
      if (key.length === 2) {
        var languageObject = {}
        languageObject['title'] = database[key].displayName
        languageObject['languageID'] = key

        // get groups for that language
        languageObject['data'] = groups.filter(group => group.language === key)
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
        areMobilizationToolsUnlocked={areMobilizationToolsUnlocked}
      />
    )
  }

  function renderGroupItem (group) {
    return <GroupItemMT group={group} />
  }

  // list of all the groups with options to turn MTs on or off for each

  return (
    <View style={styles.screen}>
      {areMobilizationToolsUnlocked ? null : (
        <View style={{ width: '100%' }}>
          <Blurb
            text={translations.mobilization_tools.mobilization_tools_pre_unlock}
          />
          <Separator />
          <WahaItem
            title={translations.mobilization_tools.unlock_mt_button_label}
            onPress={() => navigate('MobilizationToolsUnlock')}
          >
            <Icon
              name={isRTL ? 'arrow-left' : 'arrow-right'}
              color={colors.tuna}
              size={50 * scaleMultiplier}
            />
          </WahaItem>
          <Separator />
        </View>
      )}

      {/* list of groups with option to enable MTs for each group */}
      <View style={{ width: '100%', flex: 1 }}>
        {areMobilizationToolsUnlocked ? (
          <SectionList
            sections={getLanguageAndGroupData()}
            renderItem={({ item, section }) => {
              return database[section.languageID].sets.some(set => {
                return /[a-z]{2}.3.[0-9]+/.test(set.id)
              })
                ? renderGroupItem(item)
                : null
            }}
            ListHeaderComponent={() => (
              <View>
                {areMobilizationToolsUnlocked ? (
                  <Hero
                    source={require('../assets/gifs/unlock_mob_tools.gif')}
                  />
                ) : null}
                <Blurb
                  text={
                    translations.mobilization_tools.mobilization_tools_vision
                  }
                />
                <Separator />
                <WahaItem
                  title={
                    areMobilizationToolsUnlocked
                      ? translations.mobilization_tools.view_code_button_label
                      : translations.mobilization_tools.unlock_mt_button_label
                  }
                  onPress={
                    areMobilizationToolsUnlocked
                      ? () =>
                          Alert.alert(
                            translations.mobilization_tools.mt_code_title,
                            '281820',
                            [
                              {
                                text: translations.general.copy_to_clipboard,
                                onPress: () => Clipboard.setString('281820')
                              },
                              {
                                text: translations.general.close,
                                onPress: () => {}
                              }
                            ]
                          )
                      : () => navigate('MobilizationToolsUnlock')
                  }
                >
                  <Icon
                    name={isRTL ? 'arrow-left' : 'arrow-right'}
                    color={colors.tuna}
                    size={50 * scaleMultiplier}
                  />
                </WahaItem>
                <Separator />
                <View style={{ width: '100%', height: 40 * scaleMultiplier }} />
                <View style={{ width: '100%', paddingHorizontal: 20 }}>
                  <Text
                    style={StandardTypography(
                      { font, isRTL },
                      'h2',
                      'Black',
                      'left',
                      colors.shark
                    )}
                  >
                    {
                      translations.mobilization_tools
                        .mobilization_tools_status_label
                    }
                  </Text>
                </View>
              </View>
            )}
            renderSectionHeader={({ section }) =>
              renderLanguageInstanceItem(section)
            }
            renderSectionFooter={({ section }) => {
              var hasMTContent = database[section.languageID].sets.some(set => {
                return /[a-z]{2}.3.[0-9]+/.test(set.id)
              })
              return hasMTContent ? (
                <View style={{ width: '100%', height: 20 }} />
              ) : (
                <View>
                  <Separator />
                  <View
                    style={{
                      height: 80 * scaleMultiplier,
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.white,
                      justifyContent: 'center',
                      paddingHorizontal: 20
                    }}
                  >
                    <Text
                      style={StandardTypography(
                        { font, isRTL },
                        'p',
                        'Regular',
                        'center',
                        colors.chateau
                      )}
                    >
                      {
                        translations.mobilization_tools
                          .no_mobilization_tools_content_text
                      }
                    </Text>
                  </View>
                  <Separator />
                  <View style={{ width: '100%', height: 20 }} />
                </View>
              )
            }}
            keyExtractor={item => item.name}
            SectionSeparatorComponent={({ section }) => {
              var hasMTContent = database[section.languageID].sets.some(set => {
                return /[a-z]{2}.3.[0-9]+/.test(set.id)
              })

              return hasMTContent ? <Separator /> : null
            }}
            ItemSeparatorComponent={({ section }) => {
              var hasMTContent = database[section.languageID].sets.some(set => {
                return /[a-z]{2}.3.[0-9]+/.test(set.id)
              })

              return hasMTContent ? <Separator /> : null
            }}
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

export default connect(mapStateToProps)(MobilizationToolsScreen)
