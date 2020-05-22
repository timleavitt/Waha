import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { deleteGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
import AvatarImage from '../components/AvatarImage'

function GroupListItem (props) {
  // FUNCTIONS

  // gets a formatted string of this group's bookmark lesson
  function getBookmarkText () {
    // var thisGroup = props.groups.filter(
    //   group => group.name === props.groupName
    // )[0]
    // if (
    //   thisGroup.bookmark ===
    //   props.database[thisGroup.language].lessons.length + 1
    // )
    //   return 'Contact us for more study sets!'
    // var bookmarkLesson = props.database[thisGroup.language].lessons.filter(
    //   lesson => lesson.index === thisGroup.bookmark
    // )[0]
    // return bookmarkLesson.subtitle + ' ' + bookmarkLesson.title
    return 'dummy text'
  }

  // RENDER

  // render the delete button conditionally as we can only delete in edit mode and
  // can't delete the active group
  var deleteButton
  if (props.isEditing && props.activeGroup != props.groupName) {
    deleteButton = (
      <TouchableOpacity
        style={[
          styles.minusButtonContainer,
          {
            marginLeft: props.isRTL ? -5 : 10,
            marginRight: props.isRTL ? 10 : -5
          }
        ]}
        onPress={() => props.deleteGroup(props.groupName)}
      >
        <Icon name='minus-filled' size={24 * scaleMultiplier} color='#FF0800' />
      </TouchableOpacity>
    )
  } else if (props.isEditing && props.activeGroup === props.groupName) {
    deleteButton = (
      <View
        style={[
          styles.minusButtonContainer,
          {
            marginLeft: props.isRTL ? -5 : 10,
            marginRight: props.isRTL ? 10 : -5
          }
        ]}
      >
        <Icon name='check' size={24 * scaleMultiplier} color='#2D9CDB' />
      </View>
    )
  }

  // render right button conditionally; can be either right arrow when in edit mode,
  // checkmark if in edit mode and this group is active, or nothing
  var rightButton
  if (props.isEditing) {
    rightButton = (
      <View style={styles.iconContainer} onPress={() => {}}>
        <Icon
          name={props.isRTL ? 'arrow-left' : 'arrow-right'}
          size={36 * scaleMultiplier}
          color='gray'
        />
      </View>
    )
  } else if (props.activeGroup === props.groupName) {
    rightButton = (
      <View style={styles.iconContainer}>
        <Icon name='check' size={24 * scaleMultiplier} color='#2D9CDB' />
      </View>
    )
  } else {
    rightButton = null
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
      <TouchableOpacity
        style={[
          styles.touchableContainer,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={
          props.isEditing
            ? () => props.goToEditGroupScreen(props.groupName)
            : () => {
                props.changeActiveGroup(props.groupName)
              }
        }
      >
        <AvatarImage
          size={50 * scaleMultiplier}
          onPress={() => {}}
          source={props.avatarSource}
          isActive={props.activeGroup === props.groupName}
        />
        <View style={styles.groupNameContainer}>
          <Text
            style={[
              styles.groupNameText,
              {
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-black'
              }
            ]}
          >
            {props.groupName}
          </Text>
          <Text
            style={[
              styles.checkpointText,
              {
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-regular'
              }
            ]}
          >
            {getBookmarkText()}
          </Text>
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 2
  },
  touchableContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    height: '100%'
  },
  minusButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 30
  },
  groupNameContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    flexWrap: 'nowrap'
  },
  groupNameText: {
    color: '#3A3C3F',
    fontSize: 18 * scaleMultiplier,
    textAlign: 'left'
  },
  checkpointText: {
    fontSize: 12 * scaleMultiplier,
    color: '#9FA5AD',
    textAlign: 'left'
  }
})

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    isRTL: state.database[activeGroup.language].isRTL,
    groups: state.groups,
    activeGroup: state.activeGroup,
    font: state.database[activeGroup.language].font
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupListItem)
