import React from 'react'
import { scaleMultiplier } from '../constants'
import SetScreen from '../screens/SetScreen'
import { connect } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

function AddNewSetTabNavigator (props) {
  return (
    //global navigation options
    <Tab.Navigator
      initialRouteName='Core'
      swipeEnabled={false}
      screenOptions={{}}
    >
      {/* Study Set Screen */}
      <Tab.Screen name='core' component={SetScreen} />

      {/* Lesson List Screen */}
      <Tab.Screen name='folder' component={SetScreen} options={{}} />

      {/* Play Screen */}
      <Tab.Screen name='toolkit' component={SetScreen} options={{}} />
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

export default connect(mapStateToProps)(AddNewSetTabNavigator)
