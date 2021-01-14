import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import {
  colors,
  getLanguageFont,
  getSetInfo,
  scaleMultiplier
} from '../../constants'
import {
  addSet,
  setShouldShowMobilizationToolsTab
} from '../../redux/actions/groupsActions'
import { logEnableMobilizationToolsForAGroup } from '../../redux/LogEventFunctions'
import { StandardTypography } from '../../styles/typography'
import GroupAvatar from '../GroupAvatar'
// variant of group list item that shows only avatar image, group name, and a switch to enable MTs

function GroupItemMT ({
  // passed from parent
  group,
  // passed from redux
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
          emoji={group.emoji}
          isActive={activeGroup.name === group.name}
        />
      </View>
      <View style={styles.groupNameContainer}>
        <Text
          style={StandardTypography(
            {
              font: getLanguageFont(group.language),
              isRTL: isRTL
            },
            'h3',
            'Bold',
            'left',
            colors.shark
          )}
        >
          {group.name}
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
              group.name,
              !group.shouldShowMobilizationToolsTab
            )

            // if we're toggling MTs on for the first time, add the first 2 MT sets
            if (!group.shouldShowMobilizationToolsTab) {
              logEnableMobilizationToolsForAGroup(activeGroup.language)
              for (const set of database[group.language].sets) {
                if (
                  getSetInfo('category', set.id) === 'mobilization tools' &&
                  (getSetInfo('index', set.id) === 1 ||
                    getSetInfo('index', set.id) === 2)
                ) {
                  addSet(group.name, set)
                }
              }
            }
          }}
          value={group.shouldShowMobilizationToolsTab}
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

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    isRTL: state.database[activeGroup.language].isRTL,
    groups: state.groups,
    font: getLanguageFont(activeGroup.language),
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setShouldShowMobilizationToolsTab: (groupName, toSet) => {
      dispatch(setShouldShowMobilizationToolsTab(groupName, toSet))
    },
    addSet: (groupName, set) => {
      dispatch(addSet(groupName, set))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupItemMT)
