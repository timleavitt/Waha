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
import AvatarImage from '../components/AvatarImage'

function GroupListItemToolkit (props) {
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
      <AvatarImage
        size={50 * scaleMultiplier}
        onPress={() => {}}
        source={props.group.imageSource}
        isActive={props.activeGroup === props.group.name}
      />
      <View style={styles.groupNameContainer}>
        <Text
          style={[
            styles.groupNameText,
            {
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-medium'
            }
          ]}
        >
          {props.group.name}
        </Text>
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <Switch
          trackColor={{ false: '#DEE3E9', true: '#60C239' }}
          thumbColor='#FFFFFF'
          ios_backgroundColor='#DEE3E9'
          onValueChange={() => {
            props.setShowToolkit(props.group.name, !props.group.showToolkit)
            if (!props.group.showToolkit)
              for (const set of props.database[props.group.language].sets) {
                if (set.category === 'toolkit') {
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
    margin: 2
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
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    },
    setShowToolkit: (groupName, toSet) => {
      dispatch(setShowToolkit(groupName, toSet))
    },
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupListItemToolkit)
