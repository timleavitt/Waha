import React from 'react'
import { scaleMultiplier } from '../constants'
import SetScreen from '../screens/SetScreen'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

function SetTabs (props) {
  return (
    //global navigation options
    <Tab.Navigator
      initialRouteName='Core'
      swipeEnabled={false}
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
          title: 'Core Story Sets'
        }}
      />

      <Tab.Screen
        name='Topical'
        component={SetScreen}
        options={{
          title: 'Topical Sets'
        }}
      />

      <Tab.Screen name='Toolkit' component={SetScreen} options={{}} />
    </Tab.Navigator>
  )
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
    primaryColor: state.database[activeGroup.language].primaryColor
  }
}

export default connect(mapStateToProps)(SetTabs)
