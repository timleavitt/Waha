import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { connect } from 'react-redux'
import { getSetInfo, scaleMultiplier } from '../constants'
import StorySetsScreen from '../screens/StorySetsScreen'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

const Tab = createMaterialTopTabNavigator()

function StorySetTabs ({
  activeGroup,
  translations,
  activeDatabase,
  font,
  primaryColor,
  isRTL
}) {
  var MobilizationToolsScreen = activeGroup.shouldShowMobilizationToolsTab ? (
    <Tab.Screen
      name='MobilizationTools'
      component={StorySetsScreen}
      options={{
        title: translations.sets.mobilization_tools_sets_tab_label
      }}
    />
  ) : null

  var FoundationalScreen = (
    <Tab.Screen
      name='Foundational'
      component={StorySetsScreen}
      options={{
        title: translations.sets.foundational_story_sets_tab_label
      }}
    />
  )

  var TopicalScreen = (
    <Tab.Screen
      name='Topical'
      component={StorySetsScreen}
      options={{
        title: translations.sets.topical_sets_tab_label
      }}
    />
  )

  // get the initial tab, which is whatever the category of the bookmarked set
  //  is
  function getInitialRouteName () {
    var bookmarkSetCategory = getSetInfo(
      'category',
      activeDatabase.sets.filter(set => set.id === activeGroup.setBookmark)[0]
        .id
    )

    var initialRouteName

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
      initialRouteName={getInitialRouteName()}
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
      {isRTL ? MobilizationToolsScreen : FoundationalScreen}
      {TopicalScreen}
      {isRTL ? FoundationalScreen : MobilizationToolsScreen}
    </Tab.Navigator>
  )
}

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  // console.log(`sets: ${state.database[activeGroup.language].sets}`)

  return {
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    primaryColor: state.database[activeGroup.language].primaryColor,
    activeGroup: activeGroup,
    activeDatabase: state.database[activeGroup.language]
  }
}

export default connect(mapStateToProps)(StorySetTabs)
