import React from 'react';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import OnboardingSlidesScreen from '../screens/OnboardingSlidesScreen';
import LoadingScreen from '../screens/LoadingScreen'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function OnboardingNavigator() {
   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
               name="LanguageSelect"
               component={LanguageSelectScreen}
            />
            <Stack.Screen
               name="OnboardingSlides"
               component={OnboardingSlidesScreen}
            />
            <Stack.Screen 
               name="Loading"
               component={LoadingScreen}
            />
         </Stack.Navigator>
      </NavigationContainer>
   )
}

export default OnboardingNavigator
