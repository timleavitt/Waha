import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { scaleMultiplier } from '../constants'

import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import AddSetScreen from '../screens/AddSetScreen'

const Stack = createStackNavigator()

function AddSetStack (props) {
  return (
    <Stack.Navigator
      initialRouteName='AddSet'
      screenOptions={{
        headerStyle: {
          height: 90 * scaleMultiplier
        },
        headerTitleAlign: 'center'
      }}
      mode='card'
    >
      <Stack.Screen
        name='AddSet'
        component={AddSetScreen}
        options={{
          title: '',
          headerLeft: props.isRTL
            ? () => <View></View>
            : () => (
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                  <Icon name='cancel' size={50} color='#3A3C3F' />
                </TouchableOpacity>
              ),
          headerRight: props.isRTL
            ? () => (
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                  <Icon name='cancel' size={50} color='#3A3C3F' />
                </TouchableOpacity>
              )
            : () => <View></View>
        }}
      />
      <Stack.Screen
        name='AddSetFolder'
        component={AddSetScreen}
        options={{
          title: '',
          headerLeft: props.isRTL
            ? () => <View></View>
            : () => (
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                  <Icon name='arrow-left' size={50} color='#3A3C3F' />
                </TouchableOpacity>
              ),
          headerRight: props.isRTL
            ? () => (
                <TouchableOpacity onPress={() => props.navigation.pop()}>
                  <Icon name='arrow-right' size={50} color='#3A3C3F' />
                </TouchableOpacity>
              )
            : () => <View></View>
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
