import { createStackNavigator } from '@react-navigation/stack'
import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import { AppState, Image, LogBox, Text, View } from 'react-native'
import { connect } from 'react-redux'
import GroupAvatar from '../components/GroupAvatar'
import BackButton from '../components/standard/BackButton'
import { scaleMultiplier } from '../constants'
import { analyticsMode, dbMode, reduxMode } from '../modeSwitch'
import StorySetTabs from '../navigation/StorySetTabs'
import { setIsTimedOut, setTimer } from '../redux/actions/securityActions'
import AddSetScreen from '../screens/AddSetScreen'
import GroupsScreen from '../screens/GroupsScreen'
import KeyOrderSetScreen from '../screens/KeyOrderSetScreen'
import LanguageInstanceInstallScreen from '../screens/LanguageInstanceInstallScreen'
import LessonsScreen from '../screens/LessonsScreen'
import MobilizationToolsScreen from '../screens/MobilizationToolsScreen'
import MobilizationToolsUnlockScreen from '../screens/MobilizationToolsUnlockScreen'
import PianoAppScreen from '../screens/PianoAppScreen'
import PlayScreen from '../screens/PlayScreen'
import SecurityModeScreen from '../screens/SecurityModeScreen'
import SecurityOnboardingSlidesScreen from '../screens/SecurityOnboardingSlidesScreen'
import SplashScreen from '../screens/SplashScreen'
import StorageScreen from '../screens/StorageScreen'
import { colors } from '../styles/colors'
import {
  getLanguageFont,
  StandardTypography,
  SystemTypography
} from '../styles/typography'

LogBox.ignoreLogs(['Setting a timer'])

// Create our stack navigator.
const Stack = createStackNavigator()

function MainStack ({
  navigation: { navigate, goBack, toggleDrawer },
  isRTL,
  translations,
  font,
  activeGroup,
  security,
  setTimer,
  setIsTimedOut
}) {
  /** Keeps track of the current app state. Can be "active", "inactive", or "background". Set by the app state listener function. */
  const [appState, setAppState] = useState('')

  /**
   * useEffect function that reacts to changes in app state changes. This is used to display the splash screen to hide the app preview in multitasking as well as keeping track of security mode timeouts.
   * @function
   */
  useEffect(() => {
    if (appState === 'inactive' || appState === 'background') {
      // Hide screen during multitasking or going to the home screen on iOS.
      if (Platform.OS === 'ios') navigate('Splash')

      // Store the current time for security mode timeout checking later.
      setTimer(Date.now())
    } else if (appState === 'active') {
      if (security.securityEnabled) {
        // If we've already timed out...
        if (security.isTimedOut) {
          // ...then go straight to the piano screen.
          navigate('PianoApp')
        } else {
          // If we are now timed out, set isTimedOut to true and navigate to the piano screen.
          if (Date.now() - security.timer > security.timeoutDuration) {
            setIsTimedOut(true)
            navigate('PianoApp')
            // Otherwise, if we haven't timed out yet, on Android, do nothing. On iOS, we will have navigated to the splash screen upon coming back into the app so we have to go back to get back to the screen we were on before.
          } else {
            if (Platform.OS === 'ios') goBack()
          }
        }
        // Similarly, on iOS, we have to go back when we get back into the app since we previously navigated to the splash screen.
      } else {
        if (Platform.OS === 'ios') goBack()
      }
    }
  }, [appState])

  /**
   * useEffect function that acts as a constructor. It starts up the app state listener and cleans it up as well.
   * @function
   */
  useEffect(() => {
    const appStateUnsubscribe = AppState.addEventListener('change', change =>
      setAppState(change)
    )

    return function cleanup () {
      AppState.removeEventListener('change', change => setAppState(change))
    }
  }, [])

  /**
   * Function for fading out from the piano screen into the normal navigator.
   */
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress
    }
  })

  //+ RENDER

  return (
    <Stack.Navigator
      // Set the initial screen based on whether security is enabled or not. If it is, our initial screen should be the pianp app. Otherwise, it should be the StorySetTabs.
      initialRouteName={security.securityEnabled ? 'PianoApp' : 'StorySetTabs'}
      screenOptions={{
        gestureDirection: isRTL ? 'horizontal-inverted' : 'horizontal',
        gestureResponseDistance: {
          horizontal: 50 * scaleMultiplier,
          vertical: 135
        },
        headerTitleAlign: 'center'
      }}
      mode='card'
    >
      <Stack.Screen
        name='StorySetTabs'
        component={StorySetTabs}
        options={{
          headerStyle: {
            backgroundColor: colors.aquaHaze,
            // Remove the header shadow on Android.
            elevation: 0
          },
          headerTitle: () => (
            <Image
              style={{
                resizeMode: 'contain',
                width: 150,
                flex: 1,
                alignSelf: 'center'
              }}
              source={{
                uri:
                  FileSystem.documentDirectory +
                  activeGroup.language +
                  '-header.png'
              }}
            />
          ),
          headerLeft: isRTL
            ? () => (
                <View>
                  {dbMode === 'test' ||
                  reduxMode === 'test' ||
                  analyticsMode === 'test' ? (
                    <Text
                      style={[
                        StandardTypography(
                          { font, isRTL },
                          'p',
                          'Regular',
                          'center',
                          colors.red
                        ),
                        {
                          paddingHorizontal: 20
                        }
                      ]}
                    >
                      TEST MODE
                    </Text>
                  ) : null}
                </View>
              )
            : () => (
                <View style={{ paddingHorizontal: 10 }}>
                  <GroupAvatar
                    style={{ backgroundColor: colors.white }}
                    emoji={activeGroup.emoji}
                    size={35}
                    onPress={() => toggleDrawer()}
                    isActive={true}
                  />
                </View>
              ),
          headerRight: isRTL
            ? () => (
                <View style={{ paddingHorizontal: 10 }}>
                  <GroupAvatar
                    style={{ backgroundColor: colors.white }}
                    emoji={activeGroup.emoji}
                    size={35}
                    onPress={() => toggleDrawer()}
                    isActive={true}
                  />
                </View>
              )
            : () => (
                <View>
                  {dbMode === 'test' ||
                  reduxMode === 'test' ||
                  analyticsMode === 'test' ? (
                    <Text
                      style={[
                        StandardTypography(
                          { font, isRTL },
                          'p',
                          'Regular',
                          'center',
                          colors.red
                        ),
                        {
                          paddingHorizontal: 20
                        }
                      ]}
                    >
                      TEST MODE
                    </Text>
                  ) : null}
                </View>
              )
        }}
      />
      <Stack.Screen
        name='Lessons'
        component={LessonsScreen}
        options={{
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
            fontFamily: 'Roboto-Bold'
          },
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name='Groups'
        component={GroupsScreen}
        options={{
          headerTitle: translations.groups.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          }
        }}
      />
      <Stack.Screen
        name='AddSet'
        component={AddSetScreen}
        options={{
          title: '',
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='SubsequentlLanguageInstanceInstall'
        component={LanguageInstanceInstallScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: SystemTypography(
            true,
            '',
            'Bold',
            'center',
            colors.shark
          ),
          headerRight: isRTL
            ? () => <BackButton onPress={() => goBack()} />
            : () => <View></View>,
          headerLeft: isRTL
            ? () => <View></View>
            : () => <BackButton onPress={() => goBack()} />
        }}
      />
      <Stack.Screen
        name='Storage'
        component={StorageScreen}
        options={{
          headerTitle: translations.storage.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='MobilizationTools'
        component={MobilizationToolsScreen}
        options={{
          headerTitle: translations.mobilization_tools.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='MobilizationToolsUnlock'
        component={MobilizationToolsUnlockScreen}
        options={{
          headerTitle: translations.mobilization_tools.header,
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='SecurityMode'
        component={SecurityModeScreen}
        options={{
          headerTitle: translations.security.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='SecurityOnboardingSlides'
        component={SecurityOnboardingSlidesScreen}
        options={{
          headerTitle: translations.security.header,
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: font + '-Bold'
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
            fontFamily: font + '-Bold'
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
            fontFamily: font + '-Bold'
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
            fontFamily: font + '-Bold'
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
            fontFamily: font + '-Bold'
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
            fontFamily: font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='PianoApp'
        component={PianoAppScreen}
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
          animationEnabled: false
        }}
      />
    </Stack.Navigator>
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
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
