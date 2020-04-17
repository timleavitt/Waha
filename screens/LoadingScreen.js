import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import i18n from 'i18n-js';

function LoadingScreen(props) {
   i18n.translations = {
      en: {
         loadingMessage: "Hang on, we're setting things up..."
      },
   };
   return (
      <View style={{ flex: 1, justifyContent: "center" }}>
         <Text style={{ textAlign: "center", fontSize: 30, padding: 10, fontFamily: "medium" }}>{i18n.t('loadingMessage')}</Text>
         <ActivityIndicator size="large" color="black" />
      </View>
   )
}

export default LoadingScreen