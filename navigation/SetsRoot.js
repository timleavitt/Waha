import React from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
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
        // headerStyle: {
        //   height: Dimensions.get('screen').height / 9
        // },
        headerTitleAlign: 'center',
        headerMode: 'float'
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
                <View style={{ paddingHorizontal: 10 }}>
                  <AvatarImage
                    emoji={props.activeGroup.emoji}
                    size={40}
                    onPress={() => props.navigation.toggleDrawer()}
                    isActive={true}
                  />
                </View>
              ),
          headerRight: props.isRTL
            ? () => (
                <View style={{ paddingHorizontal: 10 }}>
                  <AvatarImage
                    emoji={props.activeGroup.emoji}
                    size={40}
                    onPress={() => props.navigation.toggleDrawer()}
                    isActive={true}
                  />
                </View>
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
