import React from 'react'
import { scaleMultiplier } from '../constants'

import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'

const Tab = createMaterialTopTabNavigator()

function TabNavigator (props) {
  return (
    //global navigation options
    <Tab.Navigator
      initialRouteName='Core'
      screenOptions={{
        headerStyle: {
          height: 90 * scaleMultiplier
        },
        gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
        gestureResponseDistance: {
          horizontal: 50 * scaleMultiplier,
          vertical: 135
        },
        headerTitleAlign: 'center'
      }}
    >
      {/* Study Set Screen */}
      <Tab.Screen
        name='Core'
        component={SetScreen}
        options={{
          headerStyle: {
            backgroundColor: '#EAEEF0'
          },
          headerTitleAlign: 'center'
        }}
      />

      {/* Lesson List Screen */}
      <Tab.Screen
        name='Topical'
        component={LessonListScreen}
        options={{
          //gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
          headerStyle: {
            backgroundColor: '#F7F9FA'
          },
          headerTitleAlign: 'center'
        }}
      />

      {/* Play Screen */}
      <Tab.Screen
        name='Toolkit'
        component={PlayScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFFFFF'
          },
          headerTitleStyle: {
            color: '#82868D',
            fontFamily: props.font + '-medium'
          },
          gestureEnabled: false
        }}
      />
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
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(TabNavigator)
