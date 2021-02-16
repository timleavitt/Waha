import React, { useEffect, useState } from 'react'
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import GroupListHeader from '../components/list-headers/GroupListHeader'
import GroupItem from '../components/list-items/GroupItem'
import BackButton from '../components/standard/BackButton'
import Separator from '../components/standard/Separator'
import { scaleMultiplier } from '../constants'
import AddEditGroupModal from '../modals/AddEditGroupModal'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function GroupsScreen ({
  navigation: { setOptions, goBack, navigate },
  // passed from redux
  database,
  isRTL,
  translations,
  isConnected,
  font,
  groups,
  activeGroup
}) {
  //+ STATE

  const [isEditing, setIsEditing] = useState(false)
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [groupName, setGroupName] = useState(activeGroup.name)
  const [languageID, setLanguageID] = useState(activeGroup.languageID)

  //+ CONSTRUCTOR

  useEffect(() => {
    setOptions(getNavOptions())
  }, [isEditing, isRTL, activeGroup])

  //+ NAV OPTIONS

  function getNavOptions () {
    return {
      headerStyle: {
        backgroundColor: isEditing ? colors.blue : colors.aquaHaze
      },
      headerTitleStyle: {
        color: isEditing ? colors.white : colors.shark,
        fontFamily: font + '-Bold'
      },
      headerRight: isRTL
        ? () => (
            <BackButton
              color={isEditing ? colors.white : null}
              onPress={() => goBack()}
            />
          )
        : () => (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={() => setIsEditing(old => !old)}
            >
              <Text
                style={[
                  StandardTypography(
                    { font, isRTL },
                    'h3',
                    isEditing ? 'Bold' : 'Regular',
                    'center',
                    isEditing ? colors.white : colors.blue
                  ),
                  {
                    textDecorationLine: isEditing ? 'underline' : null
                  }
                ]}
              >
                {isEditing
                  ? translations.groups.done_button_label
                  : translations.groups.edit_button_label}
              </Text>
            </TouchableOpacity>
          ),
      headerLeft: isRTL
        ? () => (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={() => setIsEditing(old => !old)}
            >
              <Text
                style={StandardTypography(
                  { font, isRTL },
                  'h3',
                  isEditing ? 'Bold' : 'Regular',
                  'center',
                  isEditing ? colors.white : colors.blue
                )}
              >
                {isEditing
                  ? translations.groups.done_button_label
                  : translations.groups.edit_button_label}
              </Text>
            </TouchableOpacity>
          )
        : () => (
            <BackButton
              color={isEditing ? colors.white : null}
              onPress={() => goBack()}
            />
          )
    }
  }

  //+ FUNCTIONS

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
        goToEditGroupScreen={groupName => {
          setGroupName(groupName)
          setShowEditGroupModal(true)
          // navigate('EditGroup', { groupName: groupName })
        }}
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
                { flexDirection: isRTL ? 'row-reverse' : 'row' }
              ]}
              onPress={
                () => {
                  setLanguageID(section.languageID)
                  setShowAddGroupModal(true)
                }
                // navigate('AddGroup', {
                //   languageID: section.languageID
                // })
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
                style={StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'left',
                  colors.blue
                )}
              >
                {translations.groups.new_group_button_label}
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
              navigate('SubsequentlLanguageInstanceInstall', {
                installedLanguageInstances: getLanguageAndGroupData()
              })
            }
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'h3',
                'Bold',
                'left',
                colors.chateau
              )}
            >
              {translations.groups.new_language_button_label}
            </Text>
          </TouchableOpacity>
        }
      />
      <AddEditGroupModal
        isVisible={showAddGroupModal}
        hideModal={() => setShowAddGroupModal(false)}
        type='AddGroup'
        languageID={languageID}
      />
      <AddEditGroupModal
        isVisible={showEditGroupModal}
        hideModal={() => setShowEditGroupModal(false)}
        type='EditGroup'
        groupName={groupName}
      />
    </View>
  )
}

//+ STYLES

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
  editButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addGroupContainer: {
    height: 80 * scaleMultiplier,
    // aspectRatio: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    isConnected: state.network.isConnected,
    font: getLanguageFont(activeGroup.language),
    groups: state.groups,
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(GroupsScreen)
