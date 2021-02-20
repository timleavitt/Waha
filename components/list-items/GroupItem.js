import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getLessonInfo, scaleMultiplier } from '../../constants'
import { changeActiveGroup } from '../../redux/actions/activeGroupActions'
import { deleteGroup } from '../../redux/actions/groupsActions'
import {
  activeGroupLanguageSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'
import GroupAvatar from '../GroupAvatar'

function mapStateToProps (state) {
  return {
    database: state.database,
    activeDatabase: state.database[activeGroupLanguageSelector(state)],
    isRTL: state.database[activeGroupLanguageSelector(state)].isRTL,
    groups: state.groups,
    activeGroup: activeGroupSelector(state),
    font: getLanguageFont(activeGroupLanguageSelector(state)),
    translations:
      state.database[activeGroupLanguageSelector(state)].translations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    }
  }
}

/**
 * A pressable item used on the GroupScreen to display a group. It shows the name of the group, the icon, whether it's active or not, and the current bookmark, and allows for editing and deleting.
 * @param {Object} thisGroup - The object for the group that we're displaying in this component.
 * @param {boolean} isEditing - Whether we're in "editing" mode or not.
 * @param {Function} openEditModal - A function that opens the modal that allows us to edit the information for a group.
 */
function GroupItem ({
  // Props passed from a parent component.
  thisGroup,
  isEditing,
  openEditModal,
  // Props passed from redux.
  database,
  activeDatabase,
  isRTL,
  groups,
  activeGroup,
  font,
  translations,
  deleteGroup,
  changeActiveGroup
}) {
  // gets a formatted string of this the bookmark lesson for this group
  // the bookmark lesson is the earliest uncompleted lesson of the active set
  //  for this group, and the text displays the subtitle and the name

  /**
   * Gets the bookmark for this group and returns it in a nicely formatted string.
   * @return {string} - The bookmarked lesson.
   */
  function getBookmarkLesson () {
    // If for some reason no group got passed, return an empty string.
    if (thisGroup) {
      // Get the object for the currently bookmarked set.
      var bookmarkSet = database[thisGroup.language].sets.filter(
        set => set.id === thisGroup.setBookmark
      )[0]

      // Get the index of the bookmarked lesson within the bookmarked set.
      var bookmarkSetBookmarkLesson = thisGroup.addedSets.filter(
        addedSet => addedSet.id === bookmarkSet.id
      )[0].bookmark

      // Finally, get the object for the bookmarked lesson. This will be the most useful information to see on the group item.
      var bookmarkLesson = bookmarkSet.lessons.filter(
        lesson =>
          getLessonInfo('index', lesson.id) === bookmarkSetBookmarkLesson
      )[0]

      // If everything is good, return the bookmark lesson. Otherwise, return an empty string.
      return bookmarkLesson && bookmarkSet
        ? `${getLessonInfo('subtitle', bookmarkLesson.id)} ${
            bookmarkLesson.title
          }`
        : ''
    } else return ''
  }

  var deleteButton
  // if we're editing and not in the active group, show tappable delete button
  if (isEditing && activeGroup.name != thisGroup.name) {
    deleteButton = (
      <TouchableOpacity
        style={styles.minusButtonContainer}
        onPress={() => {
          Alert.alert(
            translations.groups.popups.delete_group_title,
            translations.groups.popups.delete_group_message,
            [
              {
                text: translations.general.cancel,
                onPress: () => {}
              },
              {
                text: translations.general.ok,
                onPress: () => deleteGroup(thisGroup.name)
              }
            ]
          )
        }}
      >
        <Icon
          name='minus-filled'
          size={24 * scaleMultiplier}
          color={colors.red}
        />
      </TouchableOpacity>
    )
    // if we're editing and in the active group, show an untappable check
  } else if (isEditing && activeGroup.name === thisGroup.name) {
    deleteButton = (
      <View style={styles.minusButtonContainer}>
        <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
      </View>
    )
  }

  // render right button conditionally; can be either right arrow when in edit mode,
  // checkmark if in edit mode and this group is active, or an empty view
  var rightButton
  if (isEditing) {
    rightButton = (
      <View style={styles.iconContainer} onPress={() => {}}>
        <Icon
          name={isRTL ? 'arrow-left' : 'arrow-right'}
          size={36 * scaleMultiplier}
          color={colors.chateau}
        />
      </View>
    )
  } else if (activeGroup.name === thisGroup.name) {
    rightButton = (
      <View style={styles.iconContainer}>
        <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
      </View>
    )
  } else {
    rightButton = (
      <View style={[styles.iconContainer, { width: 24 * scaleMultiplier }]} />
    )
  }

  return (
    <View
      style={[
        styles.groupListItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      {deleteButton}
      {/* main tappable area */}
      <TouchableOpacity
        style={[
          styles.touchableContainer,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            paddingLeft: isEditing ? 0 : 20
          }
        ]}
        onPress={
          isEditing
            ? () => openEditModal()
            : () => {
                changeActiveGroup(thisGroup.name)
              }
        }
      >
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          size={50 * scaleMultiplier}
          emoji={thisGroup.emoji}
          isActive={activeGroup.name === thisGroup.name}
        />
        {/* text portion includes group name and bookmark text */}
        <View
          style={[
            styles.groupNameContainer,
            {
              marginLeft: isRTL ? 0 : 20,
              marginRight: isRTL ? 20 : 0
            }
          ]}
        >
          <Text
            style={StandardTypography(
              {
                font: getLanguageFont(thisGroup.language),
                isRTL: isRTL
              },
              'h3',
              'Black',
              'left',
              colors.shark
            )}
            numberOfLines={1}
          >
            {thisGroup.name}
          </Text>
          {getBookmarkLesson() === '' ? null : (
            <Text
              style={[
                StandardTypography(
                  {
                    font: getLanguageFont(thisGroup.language),
                    isRTL: isRTL
                  },
                  'd',
                  'Regular',
                  'left',
                  colors.chateau
                )
              ]}
              numberOfLines={1}
            >
              {getBookmarkLesson()}
            </Text>
          )}
        </View>
        {rightButton}
      </TouchableOpacity>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  groupListItemContainer: {
    height: 80 * scaleMultiplier,
    // aspectRatio: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  touchableContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  minusButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20
  },
  groupNameContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    flexWrap: 'nowrap'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupItem)
