//imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Picker, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { Audio } from 'expo-av';

//redux imports
import { connect } from 'react-redux'

function LanguageSelectScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  //state for our selected language; set default to english
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  //sound for the text to speech
  const soundObject = new Audio.Sound(); 

  //onboarding translations for language select screen
  i18n.translations = {
    en: { 
      welcome: 'Hello',
      selectLanguage: 'Please select your language' ,
      letsBegin: 'Let\'s begin!'
    },
    es: { 
      welcome: 'Bienvenidos',
      selectLanguage: 'Por favor selecciona tu idioma',
      letsBegin: '¡Vamos a empezar!' 
    },
  };

  //set language based on user's language vs user's location?
  useEffect(() => {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;
  }, [])

  //function to navigate to the play screen
  //props.navigation.navigate takes us to the play screen
  //params is the information we want to pass to play screen
  function navigateToOnboarding() {
    // console.log(`type of language parameter passed: ${typeof selectedLanguage}`)
    // console.log(`language parameter passed: ${selectedLanguage}`)
    props.navigation.replace({
      routeName: "OnboardingSlides",
      params: {
        selectedLanguage: selectedLanguage
      }
    })
  }

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
      case 'es':
        await soundObject
        .loadAsync(require('../assets/language_mp3s/es.mp3'))
        .then(() => {
          soundObject.playAsync()
        })
        break;
    }
    //await soundObject.playAsync();
  }




  function onPickerChange(language) {
    //console.log(language)
    setSelectedLanguage(language)
    i18n.locale = language
  }

  //console.log(i18n.locale)

  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////

  
  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <View style={styles.screen}>
      <View>
        <Text style={{fontSize: 50, textAlign: "center"}}> {i18n.t('welcome')}</Text>
        <Text style={{fontSize: 30, textAlign: "center"}}> {i18n.t('selectLanguage')}</Text>
      </View>
      <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20}}>
        <View style={{flex: 1}}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(language) => onPickerChange(language)}
            mode="dropdown"
          >
            <Picker.Item label="🇺🇸English" value="en" />
            <Picker.Item label="🇪🇸Spanish" value="es" />
          </Picker>
        </View>
        <View style={{}}>
          <Ionicons.Button 
            name="ios-volume-high" 
            size={30} 
            backgroundColor="rgba(0,0,0,0)"
            color="black"
            onPress={playAudio}
            // style={{width: 20}}
          />
        </View>
      </View>
      <View>
        <Button title={i18n.t('letsBegin')} onPress={navigateToOnboarding}/>
      </View>
    </View>
  )
}

LanguageSelectScreen.navigationOptions = navigationData => {
  return {
    headerShown: false
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center"
  }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
  //console.log(state.database)
  return {
    downloads: state.downloads,
    appProgress: state.appProgress,
    database: state.database
  }
};

function mapDispatchToProps(dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelectScreen);