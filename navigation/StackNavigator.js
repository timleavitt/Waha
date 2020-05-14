import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { scaleMultiplier } from '../constants'
import * as FileSystem from 'expo-file-system'

import LessonListScreen from '../screens/LessonListScreen'
import PlayScreen from '../screens/PlayScreen'
import GroupsScreen from '../screens/GroupsScreen'
import AddNewGroupScreen from '../screens/AddNewGroupScreen'
import AddNewLanguageScreen from '../screens/AddNewLanguageScreen'
import EditGroupScreen from '../screens/EditGroupScreen'
import StorageScreen from '../screens/StorageScreen'
import VisibleSetsTabNavigator from '../navigation/VisibleSetsTabNavigator'
import AddNewSetTabNavigator from '../navigation/AddNewSetTabNavigator'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import AvatarImage from '../components/AvatarImage'
const Stack = createStackNavigator()

function StackNavigator (props) {
  return (
    //global navigation options
    <Stack.Navigator
      initialRouteName='StudySet'
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
      <Stack.Screen
        name='Sets'
        component={VisibleSetsTabNavigator}
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
            ? () => (
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('AddNewSet')}
                >
                  <Icon
                    name='playlist-add'
                    size={40 * scaleMultiplier}
                    color='#82868D'
                  />
                </TouchableOpacity>
              )
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
            : () => (
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('AddNewSet')}
                >
                  <Icon
                    name='playlist-add'
                    size={40 * scaleMultiplier}
                    color='#82868D'
                  />
                </TouchableOpacity>
              )
        }}
      />

      <Stack.Screen
        name='AddNewSet'
        component={AddNewSetTabNavigator}
        options={{
          //gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
          headerStyle: {
            backgroundColor: '#F7F9FA'
          },
          headerTitleAlign: 'center'
        }}
      />

      {/* Lesson List Screen */}
      <Stack.Screen
        name='LessonList'
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
      <Stack.Screen
        name='Play'
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
      <Stack.Screen
        name='Groups'
        component={GroupsScreen}
        options={{
          headerTitle: props.translations.navigation.headers.groupScreen,
          headerStyle: {
            backgroundColor: '#EFF2F4'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='AddNewGroup'
        component={AddNewGroupScreen}
        options={{
          headerTitle: props.translations.navigation.headers.addNewGroupScreen,
          headerStyle: {
            backgroundColor: '#FFFFFF'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='AddNewLanguage'
        component={AddNewLanguageScreen}
        options={{
          headerTitle:
            props.translations.navigation.headers.addNewLanguageScreen,
          headerStyle: {
            backgroundColor: '#F7F7F7'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='EditGroup'
        component={EditGroupScreen}
        options={{
          headerTitle: props.translations.navigation.headers.editGroupScreen,
          headerStyle: {
            backgroundColor: '#F7F7F7'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Storage'
        component={StorageScreen}
        options={{
          headerTitle: props.translations.navigation.headers.storageScreen,
          headerStyle: {
            backgroundColor: '#FFFFFF'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
    </Stack.Navigator>
  )
}

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

export default connect(mapStateToProps)(StackNavigator)
