import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getSetInfo, scaleMultiplier } from '../constants'
import { addSet, setShowToolkit } from '../redux/actions/groupsActions'
import { logEnableMobilizationToolsForAGroup } from '../redux/LogEventFunctions'
import GroupAvatar from './GroupAvatar'
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
          marginHorizontal: 20
        }}
      >
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          size={50 * scaleMultiplier}
          emoji={props.group.emoji}
          isActive={props.activeGroup.name === props.group.name}
        />
      </View>
      <View style={styles.groupNameContainer}>
        <Text style={Typography(props, 'h3', 'medium', 'left', colors.shark)}>
          {props.group.name}
        </Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Switch
          trackColor={{ false: colors.chateau, true: colors.apple }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.chateau}
          onValueChange={() => {
            // toggle MTs on or off
            props.setShowToolkit(props.group.name, !props.group.showToolkit)

            // if we're toggling MTs on for the first time, add the first 2 MT sets
            if (!props.group.showToolkit) {
              logEnableMobilizationToolsForAGroup(props.activeGroup.language)
              for (const set of props.database[props.group.language].sets) {
                if (
                  getSetInfo('category', set.id) === 'mt' &&
                  (getSetInfo('index', set.id) === 1 ||
                    getSetInfo('index', set.id) === 2)
                ) {
                  props.addSet(props.group.name, set)
                }
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
    // aspectRatio: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
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
    isRTL: state.database[activeGroup.language].isRTL,
    groups: state.groups,
    font: state.database[activeGroup.language].font,
    toolkitEnabled: state.toolkitEnabled,
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setShowToolkit: (groupName, toSet) => {
      dispatch(setShowToolkit(groupName, toSet))
    },
    addSet: (groupName, set) => {
      dispatch(addSet(groupName, set))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupItemMT)
