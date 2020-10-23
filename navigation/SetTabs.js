import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { connect } from 'react-redux'
import { colors, getSetInfo, scaleMultiplier } from '../constants'
import SetScreen from '../screens/SetScreen'
const Tab = createMaterialTopTabNavigator()

function SetTabs (props) {
  var toolkit = props.activeGroup.showToolkit ? (
    <Tab.Screen
      name='Mobilization Tools'
      component={SetScreen}
      options={{
        title: props.translations.sets.mobilization_tools_sets_tab_label
      }}
    />
  ) : null

  var bookmarkSetCategory = getSetInfo(
    'category',
    props.activeDatabase.sets.filter(
      set => set.id === props.activeGroup.setBookmark
    )[0].id
  )
  var initialRouteName

  switch (bookmarkSetCategory) {
    case 'core':
      initialRouteName = 'Core'
      break
    case 'topical':
      initialRouteName = 'Topical'
      break
    case 'mt':
      initialRouteName = 'Mobilization Tools'
      break
    default:
      initialRouteName = 'Core'
  }

  var tabs = props.isRTL ? (
    <Tab.Navigator
      initialRouteName={initialRouteName}
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
      {toolkit}
      <Tab.Screen
        name='Topical'
        component={SetScreen}
        options={{
          title: props.translations.sets.topical_sets_tab_label
        }}
      />
      <Tab.Screen
        name='Core'
        component={SetScreen}
        options={{
          title: props.translations.sets.foundational_story_sets_tab_label
        }}
      />
    </Tab.Navigator>
  ) : (
    <Tab.Navigator
      initialRouteName={initialRouteName}
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
      <Tab.Screen
        name='Core'
        component={SetScreen}
        options={{
          title: props.translations.sets.foundational_story_sets_tab_label
        }}
      />

      <Tab.Screen
        name='Topical'
        component={SetScreen}
        options={{
          title: props.translations.sets.topical_sets_tab_label
        }}
      />
      {toolkit}
    </Tab.Navigator>
  )

  return tabs
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
