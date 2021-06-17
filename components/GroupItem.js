import React, { useEffect, useState } from 'react'
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { getLessonInfo, scaleMultiplier } from '../constants'
import { changeActiveGroup } from '../redux/actions/activeGroupActions'
import { deleteGroup } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import GroupAvatar from './GroupAvatar'

function mapStateToProps (state) {
  return {
    database: state.database,
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    groups: state.groups,
    activeGroup: activeGroupSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),
    primaryColor: activeDatabaseSelector(state).primaryColor,
    t: activeDatabaseSelector(state).translations
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
 * A pressable item used on the Group screen to display a group in the groups section list. It shows the name of the group, the icon, whether it's active or not, and the current bookmark, and allows for editing and deleting.
 * @param {Object} thisGroup - The object for the group that we're displaying in this component.
 * @param {boolean} isEditing - Whether we're in "editing" mode or not.
 * @param {Function} openEditModal - A function that opens the modal that allows us to edit the information for a group.
 */
const GroupItem = ({
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
  primaryColor,
  t,
  deleteGroup,
  changeActiveGroup
}) => {
  /** Keeps track of whether this group is the last group in a language instance. */
  const [
    isLastGroupInLanguageInstance,
    setIsLastGroupInLanguageInstance
  ] = useState(false)

  /** Keeps track of the animated position of the left icon of the group item component, in this case the delete button. */
  const [leftIconXPos, setLeftIconXPos] = useState(
    new Animated.Value(
      isRTL ? 24 * scaleMultiplier + 25 : -24 * scaleMultiplier - 25
    )
  )

  /** useEffect function used to update the animated value of the left icon position. The default value must update whenever isRTL changes.*/
  useEffect(() => {
    setLeftIconXPos(
      new Animated.Value(
        isRTL ? 24 * scaleMultiplier + 25 : -24 * scaleMultiplier - 25
      )
    )
  }, [isRTL])

  /** Animated the position of the delete icon whenever isEditing changes. This pushes the whole component over to the right. */
  useEffect(() => {
    if (isEditing) {
      Animated.spring(leftIconXPos, {
        toValue: 0
      }).start()
    } else if (!isEditing) {
      Animated.spring(leftIconXPos, {
        toValue: isRTL ? 24 * scaleMultiplier + 25 : -24 * scaleMultiplier - 25
      }).start()
    }
  }, [isEditing])

  /**
   * useEffect function that determines whether this group is the last in a language instance.
   * @function
   */
  useEffect(() => {
    if (
      groups.filter(group => group.language === thisGroup.language).length === 1
    ) {
      setIsLastGroupInLanguageInstance(true)
    } else {
      setIsLastGroupInLanguageInstance(false)
    }
  }, [isEditing, groups])

  /**
   * Gets the bookmark for this group and returns it in a nicely formatted string.
   * @return {string} - The bookmarked lesson.
   */
  const getBookmarkLesson = () => {
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

  // Determine what to render for the delete button. This button shows up next to groups in editing mode if that group is able to be deleted. Exceptions are that you can't delete the active group and that you can't delete a group that's the last in a language instance.
  if (activeGroup.name !== thisGroup.name && !isLastGroupInLanguageInstance) {
    var deleteButton = (
      <Animated.View style={{ transform: [{ translateX: leftIconXPos }] }}>
        <TouchableOpacity
          style={styles.minusButtonContainer}
          onPress={() => {
            Alert.alert(
              t.groups && t.groups.delete_group_title,
              t.groups && t.groups.delete_group_message,
              [
                {
                  text: t.general && t.general.cancel,
                  onPress: () => {}
                },
                {
                  text: t.general && t.general.ok,
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
      </Animated.View>
    )
  } else if (activeGroup.name === thisGroup.name) {
    var deleteButton = (
      <Animated.View
        style={[
          styles.minusButtonContainer,
          {
            transform: [{ translateX: leftIconXPos }]
          }
        ]}
      >
        <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
      </Animated.View>
    )
  } else if (isLastGroupInLanguageInstance) {
    var deleteButton = (
      <View
        style={{
          // Make the width such that the group avatar/text doesn't change position in editing mode. This width makes up for the padding that is lost in editing mode.
          width: 20
        }}
      />
    )
  }

  // Determine what to render for the 'right' button. This button highlights the active group with a blue checkmark while in regular mode and switches to a right arrow for all groups while in edit mode.
  if (isEditing) {
    var rightButton = (
      <View style={styles.iconContainer}>
        <Icon
          name={isRTL ? 'arrow-left' : 'arrow-right'}
          size={36 * scaleMultiplier}
          color={colors.chateau}
        />
      </View>
    )
  } else if (activeGroup.name === thisGroup.name) {
    var rightButton = (
      <View style={styles.iconContainer}>
        <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
      </View>
    )
  } else {
    var rightButton = (
      <View style={[styles.iconContainer, { width: 24 * scaleMultiplier }]} />
    )
  }

  return (
    <View
      style={[
        styles.groupItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          borderLeftWidth: isRTL ? 0 : 5,
          borderRightWidth: isRTL ? 5 : 0,
          borderColor:
            database[
              groups.filter(item => item.name === thisGroup.name)[0].language
            ].primaryColor
        }
      ]}
    >
      {deleteButton}
      <TouchableOpacity
        style={[
          styles.touchableAreaContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={
          // Tapping on a group while not in edit mode switches the active group; in edit mode, it opens the edit group modal.
          isEditing
            ? () => openEditModal()
            : () => changeActiveGroup(thisGroup.name)
        }
      >
        <Animated.View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1,
            transform:
              isLastGroupInLanguageInstance &&
              activeGroup.name !== thisGroup.name
                ? []
                : [{ translateX: leftIconXPos }]
          }}
        >
          <GroupAvatar
            style={{ backgroundColor: colors.athens }}
            size={50 * scaleMultiplier}
            emoji={thisGroup.emoji}
            isActive={activeGroup.name === thisGroup.name}
          />
          <View
            style={[
              styles.groupTextContainer,
              {
                marginLeft: isRTL ? 0 : 20,
                marginRight: isRTL ? 20 : 0
              }
            ]}
          >
            <Text
              style={StandardTypography(
                {
                  // Always display the group name in the group's language's font, not the active group's font.
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
                      // Similarly, display the bookmark text in the group's language's font, not the active group's language's font.
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
        </Animated.View>
        {rightButton}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  groupItemContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  touchableAreaContainer: {
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
  groupTextContainer: {
    flex: 1,
    height: '100%',
    // justifyContent: 'center',
    flexWrap: 'nowrap'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupItem)
