import React, { useEffect } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  AppState
} from 'react-native'
import { scaleMultiplier } from '../constants'
import * as FileSystem from 'expo-file-system'
import i18n from 'i18n-js'
import en from '../translations/en.json'
import fr from '../translations/fr.json'
import ar from '../translations/ar.json'
import LessonListScreen from '../screens/LessonListScreen'
import PlayScreen from '../screens/PlayScreen'
import GroupsScreen from '../screens/GroupsScreen'
import AddEditGroupScreen from '../screens/AddEditGroupScreen'
import LanguageSelectScreen from '../screens/LanguageSelectScreen'
import StorageScreen from '../screens/StorageScreen'
import MTScreen from '../screens/MTScreen'
import PasscodeScreen from '../screens/PasscodeScreen'
import SecurityScreen from '../screens/SecurityScreen'
import GameScreen from '../screens/GameScreen'
import SetTabNavigator from './SetTabs'
import { createStackNavigator } from '@react-navigation/stack'
import { connect } from 'react-redux'
import SetsRoot from './SetsRoot'
import BackButton from '../components/BackButton'

i18n.translations = {
  en,
  fr,
  ar
}
const Stack = createStackNavigator()

function MainStack (props) {
  function handleAppStateChange (change) {
    if (change === 'inactive' || change === 'background') {
      if (props.securityEnabled) props.navigation.navigate('Game')
    }
  }

  useEffect(() => {
    const appStateUnsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange
    )

    return function cleanup () {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [props.securityEnabled])

  return (
    //global navigation options
    <Stack.Navigator
      initialRouteName={props.securityEnabled ? 'Game' : 'SetsRoot'}
      screenOptions={{
        gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal',
        gestureResponseDistance: {
          horizontal: 50 * scaleMultiplier,
          vertical: 135
        },
        headerTitleAlign: 'center'
      }}
      mode='card'
    >
      {/* Study Set Screen */}
      <Stack.Screen
        name='SetsRoot'
        component={SetsRoot}
        options={{ headerShown: false }}
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
        name='AddGroup'
        component={AddEditGroupScreen}
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
        name='AddLanguage'
        component={LanguageSelectScreen}
        options={{
          headerStyle: {
            backgroundColor: '#F7F7F7'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          },
          headerRight: props.isRTL
            ? () => <BackButton onPress={() => props.navigation.goBack()} />
            : () => <View></View>,
          headerLeft: props.isRTL
            ? () => <View></View>
            : () => <BackButton onPress={() => props.navigation.goBack()} />
        }}
      />
      <Stack.Screen
        name='EditGroup'
        component={AddEditGroupScreen}
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
      <Stack.Screen
        name='MT'
        component={MTScreen}
        options={{
          headerTitle: props.translations.navigation.headers.mtScreen,
          headerStyle: {
            backgroundColor: '#F7F9FA'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Passcode'
        component={PasscodeScreen}
        options={{
          headerTitle: props.translations.navigation.headers.mtScreen,
          headerStyle: {
            backgroundColor: '#F7F9FA'
          },
          headerTitleStyle: {
            color: '#000000',
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Security'
        component={SecurityScreen}
        options={{
          headerTitle: props.translations.navigation.headers.SecurityScreen,
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
        name='Game'
        component={GameScreen}
        options={{ headerShown: false }}
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
    activeGroup: activeGroup,
    securityEnabled: state.securityEnabled
  }
}

export default connect(mapStateToProps)(MainStack)
