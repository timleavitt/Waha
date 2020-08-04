import React, { useEffect, useState } from 'react'
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import GroupItem from '../components/GroupItem'
import GroupListHeader from '../components/GroupListHeader'
import Separator from '../components/Separator'
import { colors, scaleMultiplier } from '../constants'

function GroupsScreen (props) {
  //// STATE

  const [isEditing, setIsEditing] = useState(false)

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [isEditing, props])

  //// NAV OPTIONS

  function getNavOptions () {
    return {
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={() => setIsEditing(old => !old)}
            >
              <Text
                style={[
                  styles.editButtonText,
                  {
                    fontFamily: props.font + '-regular'
                  }
                ]}
              >
                {isEditing
                  ? props.translations.groups.done_button_label
                  : props.translations.groups.edit_button_label}
              </Text>
            </TouchableOpacity>
          ),
      headerLeft: props.isRTL
        ? () => (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={() => setIsEditing(old => !old)}
            >
              <Text
                style={[
                  styles.editButtonText,
                  {
                    fontFamily: props.font + '-regular'
                  }
                ]}
              >
                {isEditing
                  ? props.translations.groups.done_button_label
                  : props.translations.groups.edit_button_label}
              </Text>
            </TouchableOpacity>
          )
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //// FUNCTIONS

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

  function renderLanguageInstanceItem (section) {
    return (
      <GroupListHeader
        languageName={section.title}
        languageID={section.languageID}
        isEditing={isEditing}
      />
    )
  }

  function renderGroupItem (group) {
    return (
      <GroupItem
        groupName={group.name}
        isEditing={isEditing}
        goToEditGroupScreen={groupName =>
          props.navigation.navigate('EditGroup', { groupName: groupName })
        }
        emoji={group.emoji}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <SectionList
        sections={getLanguageAndGroupData()}
        renderItem={({ item }) => renderGroupItem(item)}
        renderSectionHeader={({ section }) =>
          renderLanguageInstanceItem(section)
        }
        keyExtractor={item => item.name}
        ItemSeparatorComponent={() => <Separator />}
        SectionSeparatorComponent={() => <Separator />}
        renderSectionFooter={({ section }) => (
          <View>
            <TouchableOpacity
              style={[
                styles.addGroupContainer,
                { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
              ]}
              onPress={() =>
                props.navigation.navigate('AddGroup', {
                  languageID: section.languageID
                })
              }
            >
              <View
                style={{
                  width: 55 * scaleMultiplier,
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 20
                }}
              >
                <Icon
                  name='group-add'
                  size={40 * scaleMultiplier}
                  color={colors.chateau}
                />
              </View>
              <Text
                style={[
                  styles.addGroupText,
                  {
                    textAlign: props.isRTL ? 'right' : 'left',
                    fontFamily: props.font + '-medium'
                  }
                ]}
              >
                {props.translations.groups.new_group_button_label}
              </Text>
            </TouchableOpacity>
            <Separator />
            <View style={{ height: 20 * scaleMultiplier, width: '100%' }} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={{ height: 10, width: '100%' }} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addNewLanguageContainer}
            onPress={() =>
              props.navigation.navigate('AddLanguage', {
                installedLanguageInstances: getLanguageAndGroupData()
              })
            }
          >
            <Text
              style={[
                styles.addNewLanguageText,
                {
                  textAlign: props.isRTL ? 'right' : 'left',
                  fontFamily: props.font + '-medium'
                }
              ]}
            >
              {props.translations.groups.new_language_button_label}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  },
  addNewLanguageContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  addNewLanguageText: {
    fontSize: 18 * scaleMultiplier,
    color: colors.chateau
  },
  editButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButtonText: {
    color: colors.shark,
    fontSize: 18 * scaleMultiplier
  },
  addGroupContainer: {
    // height: 80 * scaleMultiplier,
    aspectRatio: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  addGroupText: {
    color: colors.blue,
    fontSize: 18 * scaleMultiplier,
    textAlign: 'left'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    isConnected: state.network.isConnected,
    font: state.database[activeGroup.language].font,
    groups: state.groups
  }
}

export default connect(mapStateToProps)(GroupsScreen)
