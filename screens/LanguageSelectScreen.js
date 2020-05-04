import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Picker, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { Audio } from 'expo-av';
import { scaleMultiplier, languageT2S } from '../constants'
import NetInfo from '@react-native-community/netinfo';


function LanguageSelectScreen(props) {

   //// STATE

   // keeps track of language selected in picker (TODO: change default to user's default language)
   const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale)

   // keeps track of whether the uesr has an internet connection
   const [isConnected, setIsConnected] = useState(true)

   // sound for the text to speech
   const soundObject = new Audio.Sound();

   // translations for language select
   i18n.translations = {
      en: {
         welcome: 'Hello and welcome!',
         selectLanguage: 'Please select your language.',
         letsBegin: 'Let\'s begin!',
         noInternet: 'Error: an internet connection is required to set up the app'
      },
      te: {
         welcome: 'morbi tristique senectus et!',
         selectLanguage: 'eget nulla facilisi etiam.',
         letsBegin: 'nibh ipsum!',
         noInternet: 'morbi tristique senectus et eget nulla facilisi etiam'
      }
   };

   //// CONSTRUCTOR

   useEffect(() => {
      i18n.locale = Localization.locale;
      i18n.fallbacks = true;

      const unsubscribe = NetInfo.addEventListener(state => {
         setIsConnected(state.isConnected)
      });

      return function cleanup() {
         unsubscribe();
      }
   }, [])

   //// FUNCTIONS

   // plays text-to-speech audio file of language
   async function playAudio() {
      soundObject.unloadAsync();
      await soundObject.loadAsync(languageT2S[i18n.locale]).then(() => { soundObject.playAsync() })
   }

   // updates language on picker change
   function onPickerChange(language) {
      setSelectedLanguage(language)
      i18n.locale = language
   }

   //// RENDER

   // render start button conditionally as the user can't start if they don't have internet
   var startButton = isConnected ?
      <TouchableOpacity onPress={() => props.navigation.navigate('OnboardingSlides', { selectedLanguage: selectedLanguage })} style={styles.button}>
         <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
      </TouchableOpacity> :
      <View style={[styles.button, { backgroundColor: "#828282" }]}>
         <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
      </View>

   var errorMessage = isConnected ?
      <View style={styles.errorMessageContainer}></View> :
      <View style={styles.errorMessageContainer}>
         <Text style={styles.errorMessage}>{i18n.t('noInternet')}</Text>
      </View>


   return (
      <View style={styles.screen}>
         <View>
            <Text style={styles.title}> {i18n.t('welcome')}</Text>
            <Text style={styles.subtitle}> {i18n.t('selectLanguage')}</Text>
         </View>
         <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 }}>
            <View style={{ flex: 1 }}>
               <Picker
                  selectedValue={selectedLanguage}
                  onValueChange={(language) => onPickerChange(language)}
                  mode="dropdown"
               >
                  <Picker.Item label="🇺🇸English" value="en" />
                  <Picker.Item label="⭐️Test Language" value="te" />
               </Picker>
            </View>
            <View style={{}}>
               <Ionicons.Button
                  name="ios-volume-high"
                  size={30}
                  backgroundColor="rgba(0,0,0,0)"
                  color="black"
                  onPress={playAudio}
               />
            </View>
         </View>
         {startButton}
         {errorMessage}
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F7F7F7"
   },
   title: {
      textAlign: "center",
      fontSize: 36 * scaleMultiplier,
      fontFamily: 'black',
      margin: 5
   },
   subtitle: {
      textAlign: "center",
      fontSize: 24 * scaleMultiplier,
      fontFamily: 'medium'
   },
   button: {
      width: 200,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1D1E20",
      borderRadius: 5
   },
   buttonTitle: {
      textAlign: "center",
      fontSize: 24 * scaleMultiplier,
      fontFamily: 'medium',
      color: "#FFFFFF"
   },
   errorMessageContainer: {
      height: "10%",
      width: "100%"
   },
   errorMessage: {
      textAlign: "center",
      fontSize: 16 * scaleMultiplier,
      fontFamily: 'regular',
      color: "#828282",
      marginTop: 10
   }
})

export default LanguageSelectScreen