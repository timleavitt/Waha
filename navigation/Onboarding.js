import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { getSystemIsRTL } from '../constants'
import LanguageInstanceInstallScreen from '../screens/LanguageInstanceInstallScreen'
import LoadingScreen from '../screens/LoadingScreen'
import WahaOnboardingSlidesScreen from '../screens/WahaOnboardingSlidesScreen'

const Stack = createStackNavigator()

function Onboarding () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureDirection: getSystemIsRTL()
            ? 'horizontal-inverted'
            : 'horizontal'
        }}
      >
        <Stack.Screen
          name='InitialLanguageInstanceInstall'
          component={LanguageInstanceInstallScreen}
        />
        <Stack.Screen
          name='WahaOnboardingSlides'
          component={WahaOnboardingSlidesScreen}
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen name='Loading' component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Onboarding
