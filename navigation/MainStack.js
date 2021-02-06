import { createStackNavigator } from '@react-navigation/stack'
import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import {
  AppState,
  Image,
  LogBox,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import GroupAvatar from '../components/GroupAvatar'
import BackButton from '../components/standard/BackButton'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'
import { analyticsMode, dbMode, reduxMode } from '../modeSwitch'
import SetTabs from '../navigation/SetTabs'
import { setIsTimedOut, setTimer } from '../redux/actions/securityActions'
import AddSetScreen from '../screens/AddSetScreen'
import GroupsScreen from '../screens/GroupsScreen'
import KeyOrderSetScreen from '../screens/KeyOrderSetScreen'
import LanguageSelectScreen from '../screens/LanguageSelectScreen'
import LessonListScreen from '../screens/LessonListScreen'
import MobilizationToolsScreen from '../screens/MobilizationToolsScreen'
import PasscodeScreen from '../screens/PasscodeScreen'
import PianoAppScreen from '../screens/PianoAppScreen'
import PlayScreen from '../screens/PlayScreen'
import SecurityOnboardingSlidesScreen from '../screens/SecurityOnboardingSlidesScreen'
import SecurityScreen from '../screens/SecurityScreen'
import SplashScreen from '../screens/SplashScreen'
import StorageScreen from '../screens/StorageScreen'
// import VideoScreen from '../screens/VideoScreen'
import { StandardTypography, SystemTypography } from '../styles/typography'
LogBox.ignoreLogs(['Setting a timer'])

const Stack = createStackNavigator()

function MainStack (props) {
  async function getTime () {
    return Date.now()
  }

  //+ APP STATE STUFF

  const [appState, setAppState] = useState('')

  function handleAppStateChange (change) {
    setAppState(change)
  }

  useEffect(() => {
    if (appState === 'inactive' || appState === 'background') {
      // hide screen during multitasking / going home
      if (Platform.OS === 'ios') props.navigation.navigate('Splash')

      // store current time for timeout checking later
      props.setTimer(Date.now())
    }
    if (appState === 'active') {
      if (props.security.securityEnabled) {
        // if we've already timed out, go straight to game
        if (props.security.isTimedOut) {
          props.navigation.navigate('PianoApp')
        } else {
          // check if we are now timed out
          // if we are, set isTimedOut to true and navigate to gamez
          if (
            Date.now() - props.security.timer >
            props.security.timeoutDuration
          ) {
            props.setIsTimedOut(true)
            props.navigation.navigate('PianoApp')
            // otherwise, if we haven't timed out, just go back to normal screen
          } else {
            if (Platform.OS === 'ios') props.navigation.goBack()
          }
        }
        // default: go back from splash to whatever screen we were on before
      } else {
        if (Platform.OS === 'ios') props.navigation.goBack()
      }
    }
  }, [appState])

  // start up app state listeners
  useEffect(() => {
    const appStateUnsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange
    )

    return function cleanup () {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  //- function for fading in/out game screen
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress
    }
  })

  //+ RENDER

  return (
    <Stack.Navigator
      // set the initial screen based on whether security is enabled or not
      initialRouteName={props.security.securityEnabled ? 'PianoApp' : 'SetTabs'}
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
      <Stack.Screen
        name='SetTabs'
        component={SetTabs}
        options={{
          headerStyle: {
            backgroundColor: colors.aquaHaze,
            elevation: 0 // remove shadow on Android
          },
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
                <View>
                  {dbMode === 'test' ||
                  reduxMode === 'test' ||
                  analyticsMode === 'test' ? (
                    <Text
                      style={[
                        StandardTypography(
                          props,
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
                  {props.languageCoreFilesToUpdate.length !== 0 ? (
                    // <View
                    //   style={{
                    //     width: '100%',
                    //     height: 12,
                    //     position: 'absolute',
                    //     alignSelf: 'flex-start'
                    //   }}
                    // >
                    <View>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          position: 'absolute',
                          backgroundColor: colors.apple,
                          alignSelf: 'flex-end',
                          zIndex: 100
                        }}
                      />
                      <View style={{ width: 5 }} />
                    </View>
                  ) : null}
                  <GroupAvatar
                    style={{ backgroundColor: colors.white }}
                    emoji={props.activeGroup.emoji}
                    size={35}
                    onPress={() => props.navigation.toggleDrawer()}
                    isActive={true}
                  />
                </View>
              ),
          headerRight: props.isRTL
            ? () => (
                <View style={{ paddingHorizontal: 10 }}>
                  <GroupAvatar
                    style={{ backgroundColor: colors.white }}
                    emoji={props.activeGroup.emoji}
                    size={35}
                    onPress={() => props.navigation.toggleDrawer()}
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
                          props,
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
        name='LessonList'
        component={LessonListScreen}
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
          headerTitle: props.translations.groups.header,
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
            fontFamily: props.font + '-Bold'
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
          headerTitleStyle: SystemTypography(
            true,
            '',
            'Bold',
            'center',
            colors.shark
          ),
          headerRight: props.isRTL
            ? () => <BackButton onPress={() => props.navigation.goBack()} />
            : () => <View></View>,
          headerLeft: props.isRTL
            ? () => <View></View>
            : () => <BackButton onPress={() => props.navigation.goBack()} />
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
            fontFamily: props.font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='MobilizationTools'
        component={MobilizationToolsScreen}
        options={{
          headerTitle: props.translations.mobilization_tools.header,
          headerStyle: {
            backgroundColor: colors.aquaHaze
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
          }
        }}
      />
      <Stack.Screen
        name='SecurityOnboardingSlides'
        component={SecurityOnboardingSlidesScreen}
        options={{
          headerTitle: props.translations.security.header,
          headerStyle: {
            backgroundColor: colors.white
          },
          headerTitleStyle: {
            color: colors.shark,
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
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
            fontFamily: props.font + '-Bold'
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
      {/* <Stack.Screen
        name='Video'
        component={VideoScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade
        }}
      /> */}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    resizeMode: 'contain',
    width: 150,
    flex: 1,
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
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    security: state.security,
    languageCoreFilesToUpdate: state.database.languageCoreFilesToUpdate
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
