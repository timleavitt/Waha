import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import LanguageInstanceInstallScreen from '../screens/LanguageInstanceInstallScreen'
import LoadingScreen from '../screens/LoadingScreen'
import WahaOnboardingSlidesScreen from '../screens/WahaOnboardingSlidesScreen'

// Create the stack navigator.
const Stack = createStackNavigator()

/**
 * This component renders the stack navigator used for the initial onboarding screens. This navigator is the first thing the user sees when they open the app for the first time. It contains the language instance install screen, the onboarindg slides screen, and the loading screen.
 */
const Onboarding = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          // Use fade screen transition for this navigator since we won't necessarily know if a language is RTL or LTR on the first screen.
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress
            }
          })
        }}
      >
        <Stack.Screen
          name='InitialLanguageInstanceInstall'
          component={LanguageInstanceInstallScreen}
        />
        <Stack.Screen
          name='WahaOnboardingSlides'
          component={WahaOnboardingSlidesScreen}
        />
        <Stack.Screen name='Loading' component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Onboarding
