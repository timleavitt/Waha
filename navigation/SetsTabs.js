import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { connect } from 'react-redux'
import { getSetInfo, scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import SetsScreen from '../screens/SetsScreen'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

// Create the top tab navigator.
const Tab = createMaterialTopTabNavigator()

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    primaryColor: activeDatabaseSelector(state).primaryColor,
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked
  }
}

/**
 * This component renders the tab navigator that is used to display the 3 differnet Story Set tabs.
 */
function SetsTabs ({
  // Props passed from redux.
  activeGroup,
  translations,
  activeDatabase,
  font,
  primaryColor,
  isRTL,
  areMobilizationToolsUnlocked
}) {
  // Only dispaly the Mobilization Tools screen if the Mobilization Tools tab has been enabled for this group from the Mobilization Tools screen.
  var MobilizationToolsScreen = areMobilizationToolsUnlocked ? (
    <Tab.Screen
      name='MobilizationTools'
      component={SetsScreen}
      options={{
        title: translations.sets.mobilization_tools_sets_tab_label
      }}
    />
  ) : null

  // Create the Foundational screen component.
  var FoundationalScreen = (
    <Tab.Screen
      name='Foundational'
      component={SetsScreen}
      options={{
        title: translations.sets.foundational_story_sets_tab_label
      }}
    />
  )

  // Create the Topical screen component.
  var TopicalScreen = (
    <Tab.Screen
      name='Topical'
      component={SetsScreen}
      options={{
        title: translations.sets.topical_sets_tab_label
      }}
    />
  )

  /**
   * Gets the tab that contains the current set bookmark. This is to that we can default to displaying the most relevant tab when the user opens the app.
   * @return {string} - The tab for the bookmarked set.
   */
  function getBookmarkedTab () {
    // Get the category of the bookmarked set.
    var bookmarkSetCategory = getSetInfo(
      'category',
      activeDatabase.sets.filter(set => set.id === activeGroup.setBookmark)[0]
        .id
    )

    // Return the correct name of the tab based on the category of the bookmarked set.
    switch (bookmarkSetCategory) {
      case 'foundational':
        return 'Foundational'
        break
      case 'topical':
        return 'Topical'
        break
      case 'mobilization tools':
        return 'MobilizationTools'
        break
      default:
        return 'Foundational'
    }
  }

  return (
    <Tab.Navigator
      // Set the initial route based on the category of the bookmarked set.
      initialRouteName={getBookmarkedTab()}
      swipeEnabled={true}
      tabBarOptions={{
        style: {
          backgroundColor: colors.aquaHaze
        },
        labelStyle: {
          fontSize: 14 * scaleMultiplier,
          fontFamily: font + '-Bold',
          textTransform: 'none'
        },
        activeTintColor: primaryColor,
        inactiveTintColor: colors.chateau,
        indicatorStyle: {
          backgroundColor: primaryColor
        }
      }}
    >
      {/* The components are declared above but rendered below like this because the tabs need to be in reverse order if the active group's language is RTL. */}
      {isRTL ? MobilizationToolsScreen : FoundationalScreen}
      {TopicalScreen}
      {isRTL ? FoundationalScreen : MobilizationToolsScreen}
    </Tab.Navigator>
  )
}

export default connect(mapStateToProps)(SetsTabs)
