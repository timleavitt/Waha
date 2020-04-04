import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { scaleMultiplier } from '../constants'

import LessonListScreen from '../screens/LessonListScreen';
import PlayScreen from '../screens/PlayScreen'
import SettingsScreen from '../screens/SettingsScreen'
import StudySetScreen from '../screens/StudySetScreen';
import GroupsScreen from '../screens/GroupsScreen';
import AddNewGroupScreen from '../screens/AddNewGroupScreen';
import AddNewLanguageScreen from '../screens/AddNewLanguageScreen';
import EditGroupScreen from '../screens/EditGroupScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux'

const Stack = createStackNavigator();

const styles = StyleSheet.create({
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})

function StackNavigator(props) {
  
      return (
         //global navigation options
         <Stack.Navigator
            initialRouteName='StudySet'
            screenOptions={{
               headerStyle: {
                  height: 90 * scaleMultiplier,
               },
               gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal'
            }}>

            {/* Study Set Screen */}
            <Stack.Screen
               name="StudySet"
               component={StudySetScreen}
               options={{
                  headerTitle: () => <Image style={styles.headerImage} source={require('../assets/headerLogo.png')} />,
                  headerStyle: {
                     backgroundColor: "#EAEEF0",
                  },
                  headerTitleAlign: "center",
                  gestureEnabled: 'true'
               }}
            />

            {/* Lesson List Screen */}
            <Stack.Screen
               name="LessonList"
               component={LessonListScreen}
               options={{
                  //gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
                  headerTitle: () => <Image style={styles.headerImage} source={require('../assets/headerLogo.png')} />,
                  headerStyle: {
                     backgroundColor: "#F7F9FA",
                  },
                  headerTitleAlign: "center",
               }}
            />

            {/* Play Screen */}
            <Stack.Screen
               name="Play"
               component={PlayScreen}
               options={{
                  headerStyle: {
                     backgroundColor: "#FFFFFF",
                  },
                  headerTitleStyle: {
                     color: "#82868D",
                     fontFamily: 'bold'
                  },
                  gestureEnabled: false
               }}
            />
            <Stack.Screen
               name="Settings"
               component={SettingsScreen}
               options={{
                  headerTitle: "Settings",
                  headerStyle: {
                     backgroundColor: "#F7F7F7",
                  },
                  headerTitleStyle: {
                     //color: props.colors.primaryColor,
                     fontFamily: 'bold'
                  },
               }}
            />
            <Stack.Screen
               name="Groups"
               component={GroupsScreen}
               options={{
                  headerTitle: "Groups & Languages",
                  headerStyle: {
                     backgroundColor: "#F7F7F7",
                  },
                  headerTitleStyle: {
                     color: "#000000",
                     fontFamily: 'bold'
                  },
               }}
            />
            <Stack.Screen
               name="AddNewGroup"
               component={AddNewGroupScreen}
               options={{
                  headerTitle: "Add New Group",
                  headerStyle: {
                     backgroundColor: "#F7F7F7",
                  },
                  headerTitleStyle: {
                     color: "#000000",
                     fontFamily: 'bold'
                  },
               }}
            />
            <Stack.Screen
               name="AddNewLanguage"
               component={AddNewLanguageScreen}
               options={{
                  headerTitle: "Add New Language",
                  headerStyle: {
                     backgroundColor: "#F7F7F7",
                  },
                  headerTitleStyle: {
                     color: "#000000",
                     fontFamily: 'bold'
                  },
               }}
            />
            <Stack.Screen
               name="EditGroup"
               component={EditGroupScreen}
               options={{
                  headerTitle: "Edit Group",
                  headerStyle: {
                     backgroundColor: "#F7F7F7",
                  },
                  headerTitleStyle: {
                     color: "#000000",
                     fontFamily: 'bold'
                  },
               }}
            />
         </Stack.Navigator>
      )
}

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(StackNavigator);