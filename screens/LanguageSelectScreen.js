//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Picker, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

//redux imports
import { connect } from 'react-redux'

function LanguageSelectScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  const [selectedLanguage, setSelectedLanguage] = useState('')

  //function to navigate to the play screen
  //props.navigation.navigate takes us to the play screen
  //params is the information we want to pass to play screen
  function navigateToOnboarding() {
    props.navigation.navigate({
      routeName: "OnboardingSlides",
      params: {}
    })
  }

  function testNavigate() {
    props.navigation.navigate({
      routeName: "StudySet",
      params: {
      }
    })
  }

  function playAudio() {
    //load audio
    //play audio from local file  
  }




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
      <Text>Welcome</Text>
      <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", height: "100%", alignItems: "center", padding: 20}}>
        <View style={{flex: 1}}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(language) => setSelectedLanguage(language)}
          >
            <Picker.Item label="English" value="english" />
            <Picker.Item label="Spanish" value="spanish" />
            <Picker.Item label="French" value="french" />
            <Picker.Item label="German" value="german" />
          </Picker>
        </View>
        <View style={{}}>
          <Ionicons.Button 
            name="ios-volume-high" 
            size={30} 
            backgroundColor="rgba(0,0,0,0)"
            color="black"
            onPress={() => {}}
            // style={{width: 20}}
          />
        </View>
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
  console.log(state.database)
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