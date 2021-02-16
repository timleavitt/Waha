import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getLessonInfo, scaleMultiplier } from '../../constants'
import { changeActiveGroup } from '../../redux/actions/activeGroupActions'
import { deleteGroup } from '../../redux/actions/groupsActions'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'
import GroupAvatar from '../GroupAvatar'

function GroupItem ({
  // passed from parent
  groupName,
  isEditing,
  goToEditGroupScreen,
  emoji,
  // passed from redux
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
  // FUNCTIONS

  const [thisGroup, setThisGroup] = useState(
    groups.filter(group => group.name === groupName)[0]
  )

  // gets a formatted string of this the bookmark lesson for this group
  // the bookmark lesson is the earliest uncompleted lesson of the active set
  //  for this group, and the text displays the subtitle and the name
  function getBookmarkText () {
    if (thisGroup) {
      // get the currently bookmarked set object
      var bookmarkSet = database[thisGroup.language].sets.filter(
        set => set.id === thisGroup.setBookmark
      )[0]

      // get the id of the bookmarked lesson from the bookmarked set
      var bookmarkSetBookmarkLesson = thisGroup.addedSets.filter(
        addedSet => addedSet.id === bookmarkSet.id
      )[0].bookmark

      // get the bookmrarked lesson object
      var bookmarkLesson = bookmarkSet.lessons.filter(
        lesson =>
          getLessonInfo('index', lesson.id) === bookmarkSetBookmarkLesson
      )[0]

      // if both those exist, return them to display the bookmarks
      if (bookmarkLesson && bookmarkSet) {
        return {
          lesson:
            getLessonInfo('subtitle', bookmarkLesson.id) +
            ' ' +
            bookmarkLesson.title,
          set: bookmarkSet.subtitle
        }
      } else {
        return ''
      }
    } else return ''
  }

  // RENDER

  // render the delete button
  var deleteButton
  // if we're editing and not in the active group, show tappable delete button
  if (isEditing && activeGroup.name != groupName) {
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
                onPress: () => deleteGroup(groupName)
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
  } else if (isEditing && activeGroup.name === groupName) {
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
  } else if (activeGroup.name === groupName) {
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
            ? () => goToEditGroupScreen(groupName)
            : () => {
                changeActiveGroup(groupName)
              }
        }
      >
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          size={50 * scaleMultiplier}
          emoji={emoji}
          isActive={activeGroup.name === groupName}
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
            {groupName}
          </Text>
          {/* {getBookmarkText() === '' ? null : (
            <Text
              maxFontSizeMultiplier={1.2}
              style={StandardTypography(
                {
                  font: database[thisGroup.language].font,
                  isRTL: isRTL
                },
                'd',
                'Regular',
                'left',
                colors.chateau
              )}
              numberOfLines={1}
            >
              {getBookmarkText().set}
            </Text>
          )} */}
          {getBookmarkText() === '' ? null : (
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
                ),
                {
                  // lineHeight: 12 * scaleMultiplier
                }
              ]}
              numberOfLines={1}
            >
              {getBookmarkText().lesson}
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

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    groups: state.groups,
    activeGroup: activeGroup,
    font: getLanguageFont(activeGroup.language),
    translations: state.database[activeGroup.language].translations
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupItem)
