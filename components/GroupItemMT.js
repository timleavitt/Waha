import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { connect } from 'react-redux'
import GroupAvatar from '../components/GroupAvatar'
import { scaleMultiplier } from '../constants'
import { setShouldShowMobilizationToolsTab } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

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
const GroupItemMT = ({
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
}) => {
  return (
    <View
      style={[
        styles.groupListItemContainer,
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
            'Regular',
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
            // Toggle the visibility of the Mobilization Tools tab for this group on or off.
            setShouldShowMobilizationToolsTab(
              thisGroup.name,
              !thisGroup.shouldShowMobilizationToolsTab
            )
          }}
          value={thisGroup.shouldShowMobilizationToolsTab}
          disabled={areMobilizationToolsUnlocked ? false : true}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  groupListItemContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    width: '100%',
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
