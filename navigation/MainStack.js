import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { AppState, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import { colors, scaleMultiplier } from '../constants'
import { setIsTimedOut, setTimer } from '../redux/actions/securityActions'
import AddEditGroupScreen from '../screens/AddEditGroupScreen'
import GameScreen from '../screens/GameScreen'
import GroupsScreen from '../screens/GroupsScreen'
import KeyOrderSetScreen from '../screens/KeyOrderSetScreen'
import LanguageSelectScreen from '../screens/LanguageSelectScreen'
import LessonListScreen from '../screens/LessonListScreen'
import MTScreen from '../screens/MTScreen'
import PasscodeScreen from '../screens/PasscodeScreen'
import PlayScreen from '../screens/PlayScreen'
import SecurityOnboardingScreen from '../screens/SecurityOnboardingScreen'
import SecurityScreen from '../screens/SecurityScreen'
import SplashScreen from '../screens/SplashScreen'
import StorageScreen from '../screens/StorageScreen'
import en from '../translations/en.json'
import SetsRoot from './SetsRoot'

i18n.translations = {
  en
}
const Stack = createStackNavigator()

function MainStack (props) {
  async function getTime () {
    return Date.now()
  }

  const [appState, setAppState] = useState('')

  function handleAppStateChange (change) {
    setAppState(change)
  }

  useEffect(() => {
    if (appState === 'inactive' || appState === 'background') {
      // hide screen during multitasking / going home
      props.navigation.navigate('Splash')

      // store current time for timeout checking later
      props.setTimer(Date.now())
    }
    if (appState === 'active') {
      if (props.security.securityEnabled) {
        // if we've already timed out, go straight to game
        if (props.security.isTimedOut) {
          props.navigation.navigate('Game')
        } else {
          // check if we are now timed out
          // if we are, set isTimedOut to true and navigate to game
          if (
            Date.now() - props.security.timer >
            props.security.timeoutDuration
          ) {
            props.setIsTimedOut(true)
            props.navigation.navigate('Game')
            // otherwise, if we haven't timed out, just go back to normal screen
          } else {
            props.navigation.goBack()
          }
        }
        // default: go back from splash to whatever screen we were on before
      } else {
        props.navigation.goBack()
      }
    }
  }, [appState])

  useEffect(() => {
    const appStateUnsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange
    )

    return function cleanup () {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [props.security.securityEnabled, props.security.activateOnSwitch])

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress
    }
  })

  return (
    //global navigation options
    <Stack.Navigator
      initialRouteName={props.security.securityEnabled ? 'Game' : 'SetsRoot'}
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
            backgroundColor: colors.aquaHaze
          },
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name='Play'
        component={PlayScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.chateau,
            fontFamily: props.font + '-medium'
          },
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name='Groups'
        component={GroupsScreen}
        options={{
          headerTitle: props.translations.groups.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='AddGroup'
        component={AddEditGroupScreen}
        options={{
          gestureEnabled: false,
          headerTitle: props.translations.add_edit_group.header_add,
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='AddLanguage'
        component={LanguageSelectScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
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
          gestureEnabled: false,
          headerTitle: props.translations.add_edit_group.header_edit,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Storage'
        component={StorageScreen}
        options={{
          headerTitle: props.translations.storage.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='MT'
        component={MTScreen}
        options={{
          headerTitle: props.translations.mobilization_tools.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Passcode'
        component={PasscodeScreen}
        options={{
          headerTitle: props.translations.mobilization_tools.header,
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Security'
        component={SecurityScreen}
        options={{
          headerTitle: props.translations.security.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='SecurityOnboarding'
        component={SecurityOnboardingScreen}
        options={{
          headerTitle: props.translations.security.header,
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='KeyOrderSet_Initial'
        component={KeyOrderSetScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='KeyOrderSet_Confirm'
        component={KeyOrderSetScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='KeyOrderChange_Old'
        component={KeyOrderSetScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='KeyOrderChange_Initial'
        component={KeyOrderSetScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='KeyOrderChange_Confirm'
        component={KeyOrderSetScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-medium'
          }
        }}
      />
      <Stack.Screen
        name='Game'
        component={GameScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: forFade
        }}
      />
      <Stack.Screen
        name='Splash'
        component={SplashScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          // cardStyleInterpolator: forFade
          animationEnabled: false
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setTimer: ms => {
      dispatch(setTimer(ms))
    },
    setIsTimedOut: toSet => {
      dispatch(setIsTimedOut(toSet))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainStack)
