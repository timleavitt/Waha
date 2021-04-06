// Some old stuff down here. May delete later.

// <View style={{ width: '100%', flex: 1 }}>
//   {areMobilizationToolsUnlocked ? (
//     <SectionList
//       bounces={false}
//       sections={getLanguageAndGroupData()}
//       renderSectionHeader={({ section }) => renderLanguageInstanceItem(section)}
//       renderItem={({ item, section }) =>
//         // If a language instance has no Mobilization Tools sets, don't render any group items. We show a placeholder message in the section footer in that case. Otherwise, render the group item as normal.
//         checkForMTContent(section) ? renderGroupItem(item) : null
//       }
//       ListHeaderComponent={() => headerComponent}
//       renderSectionFooter={({ section }) =>
//         // Similarly, if a language instance has no Mobilization Tools sets, render the filler component that tells the user they can't enable Mobilization Tools for any groups in this language instance.
//         checkForMTContent(section) ? (
//           <View style={{ width: '100%', height: 20 }} />
//         ) : (
//           noMTContentComponent
//         )
//       }
//       keyExtractor={item => item.name}
//       SectionSeparatorComponent={({ section }) =>
//         checkForMTContent(section) ? <Separator /> : null
//       }
//       ItemSeparatorComponent={({ section }) =>
//         checkForMTContent(section) ? <Separator /> : null
//       }
//     />
//   ) : null}
// </View>

// /**
//  * Renders the GroupListHeaderMT component used for the SectionList section header.
//  * @param {Object} languageInstance - The object for the language instance to render.
//  * @return {Component} - The GroupListHeaderMT component.
//  */
// function renderLanguageInstanceItem (languageInstance) {
//   return (
//     <GroupListHeaderMT
//       languageName={languageInstance.languageName}
//       languageID={languageInstance.languageID}
//       areMobilizationToolsUnlocked={areMobilizationToolsUnlocked}
//     />
//   )
// }

// /**
//  * Renders the GroupItemMT component used for the Groups SectionList item.
//  * @param {Object} group - The object for the group to render.
//  * @return {Component} - The GroupItemMT component.
//  */
// function renderGroupItem (group) {
//   return <GroupItemMT thisGroup={group} />
// }

// The header component for the SectionList.
// var headerComponent = (
//   <View>
//     {areMobilizationToolsUnlocked ? (
//       <Hero source={require('../assets/gifs/unlock_mob_tools.gif')} />
//     ) : null}
//     <Blurb text={translations.mobilization_tools.mobilization_tools_vision} />
//     <Separator />
//     <WahaItem
//       title={
//         areMobilizationToolsUnlocked
//           ? translations.mobilization_tools.view_code_button_label
//           : translations.mobilization_tools.unlock_mt_button_label
//       }
//       onPress={
//         areMobilizationToolsUnlocked
//           ? () =>
//               Alert.alert(
//                 translations.mobilization_tools.mt_code_title,
//                 '281820',
//                 [
//                   {
//                     text: translations.general.copy_to_clipboard,
//                     onPress: () => Clipboard.setString('281820')
//                   },
//                   {
//                     text: translations.general.close,
//                     onPress: () => {}
//                   }
//                 ]
//               )
//           : () => navigate('MobilizationToolsUnlock')
//       }
//     >
//       <Icon
//         name={isRTL ? 'arrow-left' : 'arrow-right'}
//         color={colors.tuna}
//         size={50 * scaleMultiplier}
//       />
//     </WahaItem>
//     <Separator />
//     <View style={{ width: '100%', height: 40 * scaleMultiplier }} />
//     <View style={{ width: '100%', paddingHorizontal: 20 }}>
//       <Text
//         style={StandardTypography(
//           { font, isRTL },
//           'h2',
//           'Black',
//           'left',
//           colors.shark
//         )}
//       >
//         {translations.mobilization_tools.mobilization_tools_status_label}
//       </Text>
//     </View>
//   </View>
// )

// /**
//    * Gets an array of all the installed language instances and their groups. This is used as the data for the section list of all the groups on this screen and on the MobilizationTools screen.
//    * @return {Object[]} - A list of the installed language instances and their groups.
//    * @return {Object[].title} - The name of the language.
//    * @return {Object[].languageID} - The ID of the language instance.
//    * @return {Object[].data[]} - An array of the groups that are a part of this language instance.
//    */
// function getLanguageAndGroupData () {
//   var installedLanguageInstances = []
//   for (key in database) {
//     // Because there are other redux variables stored in the database object, filter for just the language objects (which all have a length of 2).
//     if (key.length === 2) {
//       var languageObject = {}
//       languageObject['languageName'] = database[key].displayName
//       languageObject['languageID'] = key

//       // Get all the groups that are a part of this language instance.
//       languageObject['data'] = groups.filter(group => group.language === key)

//       // Add all of this to the installedLanguageInstances array.
//       installedLanguageInstances.push(languageObject)
//     }
//   }
//   return installedLanguageInstances
// }

// function checkForMTContent (section) {
//   var hasMTContent = database[section.languageID].sets.some(set => {
//     return /[a-z]{2}.3.[0-9]+/.test(set.id)
//   })
//   return hasMTContent
// }

// // A component that displays a simple message that there's no MT content available for a language instance. Used as a section footer for language instances that have no MT content.
// var noMTContentComponent = (
//   <View>
//     <Separator />
//     <View
//       style={{
//         height: 80 * scaleMultiplier,
//         justifyContent: 'flex-start',
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.white,
//         justifyContent: 'center',
//         paddingHorizontal: 20
//       }}
//     >
//       <Text
//         style={StandardTypography(
//           { font, isRTL },
//           'p',
//           'Regular',
//           'center',
//           colors.chateau
//         )}
//       >
//         {translations.mobilization_tools.no_mobilization_tools_content_text}
//       </Text>
//     </View>
//     <Separator />
//     <View style={{ width: '100%', height: 20 }} />
//   </View>
// )

import * as FileSystem from 'expo-file-system'
import { default as React, default as React } from 'react'
import { Image, StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { getSetInfo, scaleMultiplier } from '../../constants'
import { logEnableMobilizationToolsForAGroup } from '../../LogEventFunctions'
import {
  addSet,
  setShouldShowMobilizationToolsTab
} from '../../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import {
  getLanguageFont,
  StandardTypography,
  SystemTypography
} from '../../styles/typography'
import GroupAvatar from '../GroupAvatar'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    database: state.database
  }
}

/**
 * The header for the groups section list used on the Mobilization Tools screen. Displays the name of the language in the active group's language and the language instance's logo.
 * @param {string} languageID - The ID for the language instance.
 */
const GroupListHeaderMT = ({
  // Props passed from a parent component.
  languageID,
  // Props passed from redux.
  isRTL,
  translations,
  font,
  database
}) => {
  return (
    <View
      style={[
        styles.groupListHeaderMTContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <View>
        <Text
          style={SystemTypography(
            false,
            'h3',
            'Bold',
            'left',
            colors.chateau,
            getLanguageFont(languageID)
          )}
        >
          {database[languageID].displayName}
        </Text>
      </View>
      <Image
        style={styles.languageLogo}
        source={{
          uri: FileSystem.documentDirectory + languageID + '-header.png'
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  groupListHeaderMTContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.aquaHaze
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(GroupListHeaderMT)

function mapStateToProps (state) {
  return {
    database: state.database,
    isRTL: activeDatabaseSelector(state).isRTL,
    groups: state.groups,
    font: getLanguageFont(activeGroupSelector(state).language),
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    activeGroup: activeGroupSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setShouldShowMobilizationToolsTab: (groupName, toSet) => {
      dispatch(setShouldShowMobilizationToolsTab(groupName, toSet))
    },
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    }
  }
}

/**
 * A pressable item used on the MobilizationTools screen to display a group. Similar to the GroupItem component, but a lot simpler. It still displays the group name, but just allows the user to enable the Mobilization Tools for a specific group.
 * @param {Object} thisGroup - The object for the group that we're displaying in this component.
 */
const GroupItemMT = ({
  // Props passed from a parent component.
  thisGroup,
  // Props passed from redux.
  database,
  isRTL,
  groups,
  font,
  areMobilizationToolsUnlocked,
  activeGroup,
  setShouldShowMobilizationToolsTab,
  addSet
}) => {
  return (
    <View
      style={[
        styles.groupListItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      <View
        style={{
          marginHorizontal: 20
        }}
      >
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          size={50 * scaleMultiplier}
          emoji={thisGroup.emoji}
          isActive={activeGroup.name === thisGroup.name}
        />
      </View>
      <View style={styles.groupNameContainer}>
        <Text
          style={StandardTypography(
            {
              font: getLanguageFont(thisGroup.language),
              isRTL: isRTL
            },
            'h3',
            'Bold',
            'left',
            colors.shark
          )}
        >
          {thisGroup.name}
        </Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Switch
          trackColor={{ false: colors.chateau, true: colors.apple }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.chateau}
          onValueChange={() => {
            // Toggle the visibility of the Mobilization Tools tab for this group on or off.
            setShouldShowMobilizationToolsTab(
              thisGroup.name,
              !thisGroup.shouldShowMobilizationToolsTab
            )

            // If we're toggling the Mobilization Tools on for this group, log the event and add the first 2 Mobilization Tools sets to this group.
            if (!thisGroup.shouldShowMobilizationToolsTab) {
              logEnableMobilizationToolsForAGroup(
                activeGroup.language,
                thisGroup.id,
                groups.indexOf(thisGroup) + 1
              )
              for (const set of database[thisGroup.language].sets) {
                if (
                  getSetInfo('category', set.id) === 'mobilization tools' &&
                  (getSetInfo('index', set.id) === 1 ||
                    getSetInfo('index', set.id) === 2)
                ) {
                  addSet(thisGroup.name, thisGroup.id, set)
                }
              }
            }
          }}
          value={thisGroup.shouldShowMobilizationToolsTab}
          disabled={areMobilizationToolsUnlocked ? false : true}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  groupListItemContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  groupNameContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    flexWrap: 'nowrap'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupItemMT)
