import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import { connect } from 'react-redux'
import {
  deleteGroup,
  changeActiveGroup,
  setShowToolkit,
  addSet
} from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
import AvatarImage from './AvatarImage'

// variant of group list item that shows only avatar image, group name, and a switch to enable MTs
function GroupItemMT (props) {
  // FUNCTIONS

  return (
    <View
      style={[
        styles.groupListItemContainer,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      <View
        style={{
          marginHorizontal: 20,
          tintColor: props.toolkitEnabled ? null : '#DEE3E9'
        }}
      >
        <AvatarImage
          size={50 * scaleMultiplier}
          source={props.group.imageSource}
          isActive={props.activeGroup === props.group.name}
        />
      </View>
      <View style={styles.groupNameContainer}>
        <Text
          style={[
            styles.groupNameText,
            {
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-medium',
              color: props.toolkitEnabled ? '#1D1E20' : '#DEE3E9'
            }
          ]}
        >
          {props.group.name}
        </Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Switch
          trackColor={{ false: '#DEE3E9', true: '#60C239' }}
          thumbColor='#FFFFFF'
          ios_backgroundColor='#DEE3E9'
          onValueChange={() => {
            // toggle MTs on or off
            props.setShowToolkit(props.group.name, !props.group.showToolkit)

            // if we're toggling MTs on for the first time, add the MT sets
            if (!props.group.showToolkit)
              for (const set of props.database[props.group.language].sets) {
                if (set.category === 'mt') {
                  props.addSet(props.group.name, set.id)
                }
              }
          }}
          value={props.group.showToolkit}
          disabled={props.toolkitEnabled ? false : true}
        />
      </View>
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
    borderWidth: 1,
    borderColor: '#EFF2F4'
  },
  groupNameContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    flexWrap: 'nowrap'
  },
  groupNameText: {
    color: '#9FA5AD',
    fontSize: 18 * scaleMultiplier,
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
    font: state.database[activeGroup.language].font,
    toolkitEnabled: state.toolkitEnabled
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setShowToolkit: (groupName, toSet) => {
      dispatch(setShowToolkit(groupName, toSet))
    },
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupItemMT)
