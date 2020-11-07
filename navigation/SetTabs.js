import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { connect } from 'react-redux'
import { colors, getSetInfo, scaleMultiplier } from '../constants'
import SetScreen from '../screens/SetScreen'

const Tab = createMaterialTopTabNavigator()

function SetTabs (props) {
  var MobilizationToolsScreen = props.activeGroup
    .shouldShowMobilizationToolsTab ? (
    <Tab.Screen
      name='MobilizationTools'
      component={SetScreen}
      options={{
        title: props.translations.sets.mobilization_tools_sets_tab_label
      }}
    />
  ) : null

  var FoundationalScreen = (
    <Tab.Screen
      name='Foundational'
      component={SetScreen}
      options={{
        title: props.translations.sets.foundational_story_sets_tab_label
      }}
    />
  )

  var TopicalScreen = (
    <Tab.Screen
      name='Topical'
      component={SetScreen}
      options={{
        title: props.translations.sets.topical_sets_tab_label
      }}
    />
  )

  // get the initial tab, which is whatever the category of the bookmarked set
  //  is
  function getInitialRouteName () {
    var bookmarkSetCategory = getSetInfo(
      'category',
      props.activeDatabase.sets.filter(
        set => set.id === props.activeGroup.setBookmark
      )[0].id
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
          fontFamily: props.font + '-medium',
          textTransform: 'none'
        },
        activeTintColor: props.primaryColor,
        inactiveTintColor: colors.chateau,
        indicatorStyle: {
          backgroundColor: props.primaryColor
        }
      }}
    >
      {props.isRTL ? MobilizationToolsScreen : FoundationalScreen}
      {TopicalScreen}
      {props.isRTL ? FoundationalScreen : MobilizationToolsScreen}
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
    font: state.database[activeGroup.language].font,
    primaryColor: state.database[activeGroup.language].primaryColor,
    activeGroup: activeGroup,
    activeDatabase: state.database[activeGroup.language]
  }
}

export default connect(mapStateToProps)(SetTabs)
