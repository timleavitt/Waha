import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import LanguageSelectScreen from '../screens/LanguageSelectScreen'
import LoadingScreen from '../screens/LoadingScreen'
import OnboardingSlidesScreen from '../screens/OnboardingSlidesScreen'

const Stack = createStackNavigator()

function Onboarding () {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
