import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import SetTabs from './SetTabs'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import AddSetStack from './AddSetStack'
import AvatarImage from '../components/AvatarImage'
import * as FileSystem from 'expo-file-system'

const Stack = createStackNavigator()

function SetsRoot (props) {
  return (
    //global navigation options
    <Stack.Navigator
      initialRouteName='SetTabs'
      screenOptions={{
        headerStyle: {
          height: 90 * scaleMultiplier
        },
        headerTitleAlign: 'center'
      }}
      mode='modal'
    >
      {/* Study Set Screen */}
      <Stack.Screen
        name='SetTabs'
        component={SetTabs}
        options={{
          headerTitle: () => (
            <Image
              style={styles.headerImage}
              source={{
                uri:
                  FileSystem.documentDirectory +
                  props.activeGroup.language +
                  '-header.png'
              }}
            />
          ),
          headerLeft: props.isRTL
            ? () => <View></View>
            : () => (
                <AvatarImage
                  source={props.activeGroup.imageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
                />
              ),
          headerRight: props.isRTL
            ? () => (
                <AvatarImage
                  source={props.activeGroup.imageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
                />
              )
            : () => <View></View>
        }}
      />
      <Stack.Screen
        name='AddSetStack'
        component={AddSetStack}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

//// STYLES

const styles = StyleSheet.create({
  headerImage: {
    resizeMode: 'contain',
    width: 120,
    height: 40,
    alignSelf: 'center'
  }
})

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

export default connect(mapStateToProps)(SetsRoot)
