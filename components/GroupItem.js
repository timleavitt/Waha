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

const animatedPositions = {
  EDITING: 0,
  ISRTL: 24 * scaleMultiplier + 25,
  ISNOTRTL: -24 * scaleMultiplier - 25
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
  /** Keeps track of the components for the left button and the right icon of the group item. These get switched when isRTL is true. */
  const [leftButton, setLeftButton] = useState(null)
  const [rightIcon, setRightIcon] = useState(null)

  /** Keeps track of whether this group is the last group in a language instance. */
  const [
    isLastGroupInLanguageInstance,
    setIsLastGroupInLanguageInstance
  ] = useState(false)

  /** Keeps track of the animated position of the left icon of the group item component, in this case the delete button. */
  const [groupItemXPos, setGroupItemXPos] = useState(
    new Animated.Value(
      isEditing
        ? animatedPositions.EDITING
        : isRTL
        ? animatedPositions.ISRTL
        : animatedPositions.ISNOTRTL
    )
  )

  /** Animated the position of the delete icon whenever isEditing, isRTL, or isLastGroupInLanguageInstance changes. This pushes the whole component over to the right or left to reveal the hidden buttons. */
  useEffect(() => {
    animateGroupItem()
  }, [isEditing, isLastGroupInLanguageInstance, isRTL])

  /** Animates the X position of the group item. */
  const animateGroupItem = () => {
    // If a group is the last in a language instance and isn't the active group, it should always stay in the non-edit-mode position.
    if (isLastGroupInLanguageInstance && activeGroup.name !== thisGroup.name) {
      Animated.spring(groupItemXPos, {
        toValue: isRTL ? animatedPositions.ISRTL : animatedPositions.ISNOTRTL
      }).start()
      // Otherwise, animate the group item based off whether edit mode is active or not.
    } else {
      if (isEditing) {
        Animated.spring(groupItemXPos, {
          toValue: animatedPositions.EDITING
        }).start()
      } else if (!isEditing) {
        Animated.spring(groupItemXPos, {
          toValue: isRTL ? animatedPositions.ISRTL : animatedPositions.ISNOTRTL
        }).start()
      }
    }
  }

  /** useEffect function that determines whether this group is the last in a language instance. */
  useEffect(() => {
    if (
      groups.filter(group => group.language === thisGroup.language).length === 1
    )
      setIsLastGroupInLanguageInstance(true)
    else setIsLastGroupInLanguageInstance(false)
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

  /** useEffect function that sets the left and right buttons of the group item appropriately when necessary. */
  useEffect(() => {
    // Determine what to render for the delete button. This button shows up next to groups in editing mode if that group is able to be deleted. Exceptions are that you can't delete the active group and that you can't delete a group that's the last in a language instance.
    if (activeGroup.name !== thisGroup.name && !isLastGroupInLanguageInstance)
      setLeftButton(
        <Animated.View style={{ transform: [{ translateX: groupItemXPos }] }}>
          <TouchableOpacity
            style={styles.minusButtonContainer}
            onPress={() => {
              Alert.alert(
                t.groups && t.groups.delete_group_title,
                t.groups && t.groups.delete_group_message,
                [
                  {
                    text: t.general && t.general.cancel,
                    onPress: () => {},
                    style: 'cancel'
                  },
                  {
                    text: t.general && t.general.ok,
                    onPress: () => deleteGroup(thisGroup.name),
                    style: 'destructive'
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
    else if (activeGroup.name === thisGroup.name)
      setLeftButton(
        <Animated.View
          style={[
            styles.minusButtonContainer,
            {
              transform: [{ translateX: groupItemXPos }]
            }
          ]}
        >
          <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
        </Animated.View>
      )
    else if (isLastGroupInLanguageInstance)
      setLeftButton(
        <View
          style={{
            // Make the width such that the group avatar/text doesn't change position in editing mode. This width makes up for the padding that is lost in editing mode.
            width: 24 * scaleMultiplier + 40
          }}
        />
      )

    // Determine what to render for the 'right' button. This button highlights the active group with a blue checkmark while in regular mode and switches to a right arrow for all groups while in edit mode.
    if (isEditing)
      setRightIcon(
        <View style={styles.iconContainer}>
          <Icon
            name={isRTL ? 'arrow-left' : 'arrow-right'}
            size={36 * scaleMultiplier}
            color={colors.chateau}
          />
        </View>
      )
    else if (activeGroup.name === thisGroup.name)
      setRightIcon(
        <View style={styles.iconContainer}>
          <Icon name='check' size={24 * scaleMultiplier} color={colors.blue} />
        </View>
      )
    else
      setRightIcon(
        <View style={[styles.iconContainer, { width: 24 * scaleMultiplier }]} />
      )
  }, [isEditing, activeGroup, isLastGroupInLanguageInstance])

  return (
    <View
      style={[
        styles.groupItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          borderLeftWidth: isRTL ? 0 : 5,
          borderRightWidth: isRTL ? 5 : 0,
          borderColor:
            groups.filter(item => item.name === thisGroup.name).length !== 0
              ? database[
                  groups.filter(item => item.name === thisGroup.name)[0]
                    .language
                ].primaryColor
              : null
        }
      ]}
    >
      {leftButton}
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
            transform: [{ translateX: groupItemXPos }]
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
        {rightIcon}
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
