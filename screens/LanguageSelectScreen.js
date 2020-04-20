import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Picker, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { Audio } from 'expo-av';
import { scaleMultiplier } from '../constants'

function LanguageSelectScreen(props) {

   //// STATE

   // keeps track of language selected in picker (TODO: change default to user's default language)
   const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale)

   // sound for the text to speech
   const soundObject = new Audio.Sound();

   // translations for language select
   i18n.translations = {
      en: {
         welcome: 'Hello and welcome!',
         selectLanguage: 'Please select your language.',
         letsBegin: 'Let\'s begin!'
      },
      te: {
         welcome: 'morbi tristique senectus et!',
         selectLanguage: 'eget nulla facilisi etiam.',
         letsBegin: 'nibh ipsum!'
      }
   };

   //// CONSTRUCTOR

   useEffect(() => {
      i18n.locale = Localization.locale;
      i18n.fallbacks = true;
   }, [])

   //// FUNCTIONS

   // plays text-to-speech audio file of language
   async function playAudio() {
      soundObject.unloadAsync();
      switch (i18n.locale) {
         case 'en':
            await soundObject
               .loadAsync(require('../assets/language_mp3s/en.mp3'))
               .then(() => {
                  soundObject.playAsync()
               })
            break;
      }
   }

   // updates language on picker change
   function onPickerChange(language) {
      setSelectedLanguage(language)
      i18n.locale = language
   }

   //// RENDER

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
                  <Picker.Item label="Test" value="te" />
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
         <TouchableOpacity onPress={() => props.navigation.navigate('OnboardingSlides', {selectedLanguage: selectedLanguage})} style={styles.button}>
            <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
         </TouchableOpacity>
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
      fontFamily: 'bold',
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
   }
})

export default LanguageSelectScreen