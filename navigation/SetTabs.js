import React from 'react'
import { scaleMultiplier } from '../constants'
import SetScreen from '../screens/SetScreen'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

function SetTabs (props) {
  var toolkit = props.activeGroup.showToolkit ? (
    <Tab.Screen
      name='Mobilization Tools'
      component={SetScreen}
      options={{ title: props.translations.navigation.tabs.mobilization }}
    />
  ) : null

  var bookmarkSetCategory = props.activeDatabase.sets.filter(
    set => set.id === props.activeGroup.setBookmark
  )[0].category
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
        labelStyle: {
          fontSize: 14 * scaleMultiplier,
          fontFamily: props.font + '-medium',
          textTransform: 'none'
        },
        activeTintColor: props.primaryColor,
        inactiveTintColor: '#9FA5AD',
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
          title: props.translations.navigation.tabs.topics
        }}
      />
      <Tab.Screen
        name='Core'
        component={SetScreen}
        options={{
          title: props.translations.navigation.tabs.foundations
        }}
      />
    </Tab.Navigator>
  ) : (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      swipeEnabled={true}
      tabBarOptions={{
        labelStyle: {
          fontSize: 14 * scaleMultiplier,
          fontFamily: props.font + '-medium',
          textTransform: 'none'
        },
        activeTintColor: props.primaryColor,
        inactiveTintColor: '#9FA5AD',
        indicatorStyle: {
          backgroundColor: props.primaryColor
        }
      }}
    >
      <Tab.Screen
        name='Core'
        component={SetScreen}
        options={{
          title: props.translations.navigation.tabs.foundations
        }}
      />

      <Tab.Screen
        name='Topical'
        component={SetScreen}
        options={{
          title: props.translations.navigation.tabs.topics
        }}
      />
      {toolkit}
    </Tab.Navigator>
  )

  return tabs
}

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
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
