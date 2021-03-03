import React, { useEffect, useState } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import AddNewGroupButton from '../components/AddNewGroupButton'
import AddNewLanguageInstanceButton from '../components/AddNewLanguageInstanceButton'
import GroupsScreenEditButton from '../components/GroupsScreenEditButton'
import GroupListHeader from '../components/list-headers/GroupListHeader'
import GroupItem from '../components/list-items/GroupItem'
import BackButton from '../components/standard/BackButton'
import Separator from '../components/standard/Separator'
import AddEditGroupModal from '../modals/AddEditGroupModal'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    database: state.database,
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    isConnected: state.network.isConnected,
    font: getLanguageFont(activeGroupSelector(state).language),
    groups: state.groups,
    activeGroup: activeGroupSelector(state)
  }
}

/**
 * A screen that displays all of the installed language instances and the groups in those language instances. Allows for switching the active group and  editing, deleting, and adding groups & languages.
 */
function GroupsScreen ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, navigate },
  // Props passed from redux.
  database,
  isRTL,
  translations,
  isConnected,
  font,
  groups,
  activeGroup
}) {
  /** Keeps track of whether the screen is in editing mode or not. Editing mode is enabled via a button in the header and switches a lot of functionality on the screen. */
  const [isEditing, setIsEditing] = useState(false)

  /** When adding a new group, this state keeps track of the language instance that the user is adding a group in so it can be passed into the CreateGroup() function. */
  const [languageID, setLanguageID] = useState(activeGroup.languageID)

  /** When editing a specific group, this component stores the object for the group that is being edited. */
  const [editingGroup, setEditingGroup] = useState(activeGroup)

  /** Keeps track of whether the add group modal is visible. */
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)

  /** Keeps track of whether the edit gruop modal is visible. */
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)

  /** useEffect function that sets the navigation options for this screen. Unlock similar functions in other screens, this one is updated more often since the header must update whenever the active group changes and when editingMode changes. */
  useEffect(() => {
    setOptions(getNavOptions())
  }, [isEditing, isRTL, activeGroup])

  /**
   * Returns the navigation options for this screen.
   * @return {Object} - The navigation options.
   */
  function getNavOptions () {
    return {
      headerStyle: {
        // Switch the background color of the header in editing mode to reflect that we're in a non-standard screen view.
        backgroundColor: isEditing ? colors.blue : colors.aquaHaze
      },
      headerTitleStyle: {
        // Update the header text color to go with the background color changes.
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
            <GroupsScreenEditButton
              onPress={() => setIsEditing(old => !old)}
              isEditing={isEditing}
            />
          ),
      headerLeft: isRTL
        ? () => (
            <GroupsScreenEditButton
              onPress={() => setIsEditing(old => !old)}
              isEditing={isEditing}
            />
          )
        : () => (
            <BackButton
              color={isEditing ? colors.white : null}
              onPress={() => goBack()}
            />
          )
    }
  }

  /**
   * Gets an array of all the installed language instances and their groups. This is used as the data for the section list of all the groups on this screen and on the MobilizationTools screen.
   * @return {Object[]} - A list of the installed language instances and their groups.
   * @return {Object[].title} - The name of the language.
   * @return {Object[].languageID} - The ID of the language instance.
   * @return {Object[].data[]} - An array of the groups that are a part of this language instance.
   */
  function getLanguageAndGroupData () {
    var installedLanguageInstances = []
    for (key in database) {
      // Because there are other redux variables stored in the database object, filter for just the language objects (which all have a length of 2).
      if (key.length === 2) {
        var languageObject = {}
        languageObject['languageName'] = database[key].displayName
        languageObject['languageID'] = key

        // Get all the groups that are a part of this language instance.
        languageObject['data'] = groups.filter(group => group.language === key)

        console.log(database[key].installTime)

        // Add all of this to the installedLanguageInstances array.
        installedLanguageInstances.push(languageObject)
      }
    }
    console.log('-------------------------------')

    return installedLanguageInstances.some(
      key => database[key.languageID].installTime === null
    )
      ? installedLanguageInstances
      : installedLanguageInstances.sort(
          (a, b) =>
            database[a.languageID].installTime -
            database[b.languageID].installTime
        )
  }

  /**
   * Renders a GroupListHeader component used for the Groups SectionList section header.
   * @param {Object} languageInstance - The object for the language instance to render.
   * @return {Component} - The GroupListHeader component.
   */
  function renderGroupListHeader (languageInstance) {
    return (
      <GroupListHeader
        languageName={languageInstance.languageName}
        languageID={languageInstance.languageID}
        isEditing={isEditing}
      />
    )
  }

  /**
   * Renders a GroupItem component used for the Groups SectionList item.
   * @param {Object} group - The object for the group to render.
   * @return {Component} - The GroupItem component.
   */
  function renderGroupItem (group) {
    return (
      <GroupItem
        thisGroup={group}
        isEditing={isEditing}
        openEditModal={() => {
          setEditingGroup(group)
          setShowEditGroupModal(true)
        }}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <SectionList
        sections={getLanguageAndGroupData()}
        renderItem={({ item }) => renderGroupItem(item)}
        renderSectionHeader={({ section }) => renderGroupListHeader(section)}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={() => <Separator />}
        SectionSeparatorComponent={() => <Separator />}
        renderSectionFooter={({ section }) => (
          <AddNewGroupButton
            section={section}
            setLanguageID={languageID => setLanguageID(languageID)}
            setShowAddGroupModal={toSet => setShowAddGroupModal(toSet)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={{ height: 10, width: '100%' }} />
        )}
        ListFooterComponent={
          <AddNewLanguageInstanceButton
            navigate={(screen, params) => navigate(screen, params)}
            languageAndGroupData={getLanguageAndGroupData()}
          />
        }
      />
      {/* Modals */}
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
        group={editingGroup}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps)(GroupsScreen)
