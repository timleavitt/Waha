import React from 'react';
import { StyleSheet, Image } from 'react-native';
import HeaderButtons from './components/HeaderButtons'
import { scaleMultiplier } from './constants'
import WahaDrawer from './components/WahaDrawer'

import LessonListScreen from './screens/LessonListScreen';
import PlayScreen from './screens/PlayScreen'
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import OnboardingSlidesScreen from './screens/OnboardingSlidesScreen';
import SettingsScreen from './screens/SettingsScreen'
import StudySetScreen from './screens/StudySetScreen';
import GroupsScreen from './screens/GroupsScreen';
import AddNewGroupScreen from './screens/AddNewGroupScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connect } from 'react-redux'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



//allows only accessing hamburger swipe from study set screen
function getGestureEnabled(route) {
   // Access the tab navigator's state using `route.state`
   const routeName = route.state
      ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
      : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'StudySet';
   if (routeName === 'StudySet')
      return true
   else
      return false
}

//Drawer navigator contains stack navigator as only screen
function DrawerNavigator(props) {
   
   //main navigator through all app screens
   function StackNavigator() {
      return (
         //global navigation options
         <Stack.Navigator initialRouteName="Groups" screenOptions={{
            headerStyle: {
               height: 90 * scaleMultiplier,
            },
            gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
         }}>

            {/* Study Set Screen */}
            <Stack.Screen
               name="StudySet"
               component={StudySetScreen}
               options={{
                  headerTitle: <Image style={styles.headerImage} source={require('./assets/headerLogo.png')} />,
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
                  gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
                  headerTitle: () => <Image style={styles.headerImage} source={require('./assets/headerLogo.png')} />,
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

            {/* Language Select Screen (Onboarding) */}
            <Stack.Screen
               name="LanguageSelect"
               component={LanguageSelectScreen}
            />

            {/* Onboarding Slides Screen */}
            <Stack.Screen
               name="OnboardingSlides"
               component={OnboardingSlidesScreen}
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
                     color: props.colors.primaryColor,
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
         </Stack.Navigator>
      )
   }
   return (
      <NavigationContainer>
         <Drawer.Navigator drawerContent={props => <WahaDrawer {...props}/>}>
            <Drawer.Screen options={({ route }) => ({ gestureEnabled: getGestureEnabled(route) })} name="StackNavigator" component={StackNavigator} />
         </Drawer.Navigator>
      </NavigationContainer>
   )
}


const styles = StyleSheet.create({
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})

/////////////
////REDUX////
/////////////

function mapStateToProps(state) {
   if (!state.database.isFetching)
      return {
         database: state.database,
         colors: state.database[state.database.currentLanguage].colors,
         appProgress: state.appProgress,
         isRTL: state.database[state.database.currentLanguage].isRTL,
      }
   else {
      return {
         isFetching: state.database.isFetching,
         isFirstOpen: state.database.isFirstOpen
      }
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNavigator);