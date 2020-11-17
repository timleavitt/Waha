import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { getSystemIsRTL } from '../constants'
import LanguageSelectScreen from '../screens/LanguageSelectScreen'
import LoadingScreen from '../screens/LoadingScreen'
import OnboardingSlidesScreen from '../screens/OnboardingSlidesScreen'

const Stack = createStackNavigator()

function Onboarding () {
  //+ RENDER
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
        <Stack.Screen name='LanguageSelect' component={LanguageSelectScreen} />
        <Stack.Screen
          name='OnboardingSlides'
          component={OnboardingSlidesScreen}
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
