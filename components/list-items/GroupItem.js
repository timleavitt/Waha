import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLessonInfo, scaleMultiplier } from '../../constants'
import {
  changeActiveGroup,
  deleteGroup
} from '../../redux/actions/groupsActions'
import { StandardTypography } from '../../styles/typography'
import GroupAvatar from '../GroupAvatar'
function GroupItem (props) {
  // FUNCTIONS

  const [thisGroup, setThisGroup] = useState(
    props.groups.filter(group => group.name === props.groupName)[0]
  )

  // gets a formatted string of this the bookmark lesson for this group
  // the bookmark lesson is the earliest uncompleted lesson of the active set
  //  for this group, and the text displays the subtitle and the name
  function getBookmarkText () {
    if (thisGroup) {
      // get the currently bookmarked set object
      var bookmarkSet = props.database[thisGroup.language].sets.filter(
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
  if (props.isEditing && props.activeGroup.name != props.groupName) {
    deleteButton = (
      <TouchableOpacity
        style={styles.minusButtonContainer}
        onPress={() => {
          Alert.alert(
            props.translations.groups.popups.delete_group_title,
            props.translations.groups.popups.delete_group_message,
            [
              {
                text: props.translations.general.cancel,
                onPress: () => {}
              },
              {
                text: props.translations.general.ok,
                onPress: () => props.deleteGroup(props.groupName)
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
  } else if (props.isEditing && props.activeGroup.name === props.groupName) {
    deleteButton = (
      <View style={styles.minusButtonContainer}>
        <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
      </View>
    )
  }

  // render right button conditionally; can be either right arrow when in edit mode,
  // checkmark if in edit mode and this group is active, or an empty view
  var rightButton
  if (props.isEditing) {
    rightButton = (
      <View style={styles.iconContainer} onPress={() => {}}>
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          size={36 * scaleMultiplier}
          color={colors.chateau}
        />
      </View>
    )
  } else if (props.activeGroup.name === props.groupName) {
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
          flexDirection: props.isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      {deleteButton}
      {/* main tappable area */}
      <TouchableOpacity
        style={[
          styles.touchableContainer,
          {
            flexDirection: props.isRTL ? 'row-reverse' : 'row',
            paddingLeft: props.isEditing ? 0 : 20
          }
        ]}
        onPress={
          props.isEditing
            ? () => props.goToEditGroupScreen(props.groupName)
            : () => {
                props.changeActiveGroup(props.groupName)
              }
        }
      >
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          size={50 * scaleMultiplier}
          emoji={props.emoji}
          isActive={props.activeGroup.name === props.groupName}
        />
        {/* text portion includes group name and bookmark text */}
        <View
          style={[
            styles.groupNameContainer,
            {
              marginLeft: props.isRTL ? 0 : 20,
              marginRight: props.isRTL ? 20 : 0
            }
          ]}
        >
          <Text
            style={StandardTypography(
              {
                font: props.database[thisGroup.language].font,
                isRTL: props.isRTL
              },
              'h3',
              'black',
              'left',
              colors.shark
            )}
            numberOfLines={1}
          >
            {props.groupName}
          </Text>
          {getBookmarkText() === '' ? null : (
            <Text
              maxFontSizeMultiplier={1.2}
              style={[
                StandardTypography(
                  {
                    font: props.database[thisGroup.language].font,
                    isRTL: props.isRTL
                  },
                  'd',
                  'regular',
                  'left',
                  colors.chateau
                ),
                {
                  lineHeight: 12 * scaleMultiplier
                }
              ]}
              numberOfLines={1}
            >
              {getBookmarkText().set}
            </Text>
          )}
          {getBookmarkText() === '' ? null : (
            <Text
              style={[
                StandardTypography(
                  {
                    font: props.database[thisGroup.language].font,
                    isRTL: props.isRTL
                  },
                  'd',
                  'regular',
                  'left',
                  colors.chateau
                ),
                {
                  lineHeight: 12 * scaleMultiplier
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
    font: state.database[activeGroup.language].font,
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
