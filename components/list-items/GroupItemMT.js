import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { getSetInfo, scaleMultiplier } from '../../constants'
import { logEnableMobilizationToolsForAGroup } from '../../LogEventFunctions'
import {
  addSet,
  setShouldShowMobilizationToolsTab
} from '../../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'
import GroupAvatar from '../GroupAvatar'

function mapStateToProps (state) {
  return {
    database: state.database,
    isRTL: activeDatabaseSelector(state).isRTL,
    groups: state.groups,
    font: getLanguageFont(activeGroupSelector(state).language),
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    activeGroup: activeGroupSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setShouldShowMobilizationToolsTab: (groupName, toSet) => {
      dispatch(setShouldShowMobilizationToolsTab(groupName, toSet))
    },
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    }
  }
}

/**
 * A pressable item used on the MobilizationTools screen to display a group. Similar to the GroupItem component, but a lot simpler. It still displays the group name, but just allows the user to enable the Mobilization Tools for a specific group.
 * @param {Object} thisGroup - The object for the group that we're displaying in this component.
 */
function GroupItemMT ({
  // Props passed from a parent component.
  thisGroup,
  // Props passed from redux.
  database,
  isRTL,
  groups,
  font,
  areMobilizationToolsUnlocked,
  activeGroup,
  setShouldShowMobilizationToolsTab,
  addSet
}) {
  // FUNCTIONS
  return (
    <View
      style={[
        styles.groupListItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row'
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
          emoji={thisGroup.emoji}
          isActive={activeGroup.name === thisGroup.name}
        />
      </View>
      <View style={styles.groupNameContainer}>
        <Text
          style={StandardTypography(
            {
              font: getLanguageFont(thisGroup.language),
              isRTL: isRTL
            },
            'h3',
            'Bold',
            'left',
            colors.shark
          )}
        >
          {thisGroup.name}
        </Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <Switch
          trackColor={{ false: colors.chateau, true: colors.apple }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.chateau}
          onValueChange={() => {
            // toggle MTs on or off
            setShouldShowMobilizationToolsTab(
              thisGroup.name,
              !thisGroup.shouldShowMobilizationToolsTab
            )

            // if we're toggling MTs on for the first time, add the first 2 MT sets
            if (!thisGroup.shouldShowMobilizationToolsTab) {
              logEnableMobilizationToolsForAGroup(
                activeGroup.language,
                thisGroup.id,
                groups.indexOf(thisGroup) + 1
              )
              for (const set of database[thisGroup.language].sets) {
                if (
                  getSetInfo('category', set.id) === 'mobilization tools' &&
                  (getSetInfo('index', set.id) === 1 ||
                    getSetInfo('index', set.id) === 2)
                ) {
                  addSet(thisGroup.name, thisGroup.id, set)
                }
              }
            }
          }}
          value={thisGroup.shouldShowMobilizationToolsTab}
          disabled={areMobilizationToolsUnlocked ? false : true}
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupItemMT)
