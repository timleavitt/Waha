import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { scaleMultiplier } from '../constants'

import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import AddSetScreen from '../screens/AddSetScreen'
import SetInfoScreen from '../screens/SetInfoScreen'

const Stack = createStackNavigator()

function AddSetStack (props) {
  return (
    <Stack.Navigator
      initialRouteName='AddSet'
      screenOptions={{
        headerStyle: {
          height: 90 * scaleMultiplier
        },
        headerTitleAlign: 'center',
        gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal'
      }}
      mode='card'
    >
      <Stack.Screen
        name='AddSet'
        component={AddSetScreen}
        options={{
          title: ''
        }}
      />
      <Stack.Screen
        name='SetInfo'
        component={SetInfoScreen}
        options={{
          title: ''
        }}
      />
    </Stack.Navigator>
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
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(AddSetStack)
