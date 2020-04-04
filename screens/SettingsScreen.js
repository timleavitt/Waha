//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import SettingsItem from '../components/SettingsItem'
import * as WebBrowser from 'expo-web-browser';
import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'

//redux imports
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { getActiveChildNavigationOptions } from 'react-navigation';

function SettingsScreen(props) {

  
  //////////////////////////////////////////
  ////STATE, CONSTRUCTOR, AND NAVIGATION////
  //////////////////////////////////////////


  
  //set language based on user's language vs user's location?
  useEffect(() => {
     props.navigation.setOptions(getNavOptions())
  }, [])

  function getNavOptions() {
   return {
       headerRight: props.route.params.isRTL ? () =>
         <BackButton
            isRTL={props.route.params.isRTL}
            onPress={() => props.navigation.goBack()}
         /> :
         () => <View></View>,
      headerLeft: props.route.params.isRTL ? () =>
         <View></View> :
         () =>
         <BackButton
            isRTL={props.route.params.isRTL}
            onPress={() => props.navigation.goBack()}
         />,
   }
}

  ///////////////////////
  ////OTHER FUNCTIONS////
  ///////////////////////

  async function openBrowser(url) {
     await WebBrowser.openBrowserAsync(url);
  }

  function deleteDownloadedLessons() {
     //look through all downloaded files
   FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
      //only delete the lessons which are 6 digit ids
      var regexp = /^[0-9]{6,6}/
      for (var i = 0; i < contents.length; i++) {
         var shouldDelete = regexp.exec(contents[i])
         if (shouldDelete)
            FileSystem.deleteAsync(FileSystem.documentDirectory + contents[i])
      }
  });
   props.navigation.replace("StudySet")
  }

  ////////////////////////////////
  ////RENDER/STYLES/NAVOPTIONS////
  ////////////////////////////////


  //create modal in here, pass state to show it to lesson item so lesson item
  //can change it and show the modal on this screen
  return (
    <ScrollView style={styles.screen}>
      <SettingsItem
         text="Privacy Policy"
         onPress={() => openBrowser('https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif')}
      />
      <SettingsItem
         text="Submit Feedback"
         onPress={() => openBrowser('https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif')}
      />
      <SettingsItem
         text="Language Instances"
         onPress={() => props.navigation.navigate("LanguageInstances")}
      />
      <SettingsItem
         text="Reset Progress"
         onPress={() => Alert.alert('Warning', 
            "Are you sure you'd like to reset all of your progress through the app?",
            [{
               text: 'Cancel', 
               onPress: () => {}
            },
            {
               text: 'Yes',
               onPress: () => {}
            }
            ])
         }
      />
      <SettingsItem
         text="Remove Downloaded Lessons"
         onPress={() => Alert.alert('Warning', 
            "Are you sure you'd like to remove all downloaded lessons from your device?",
            [{
               text: 'Cancel', 
               onPress: () => {}
            },
            {
               text: 'Yes',
               onPress: deleteDownloadedLessons
            }
            ])
         }
      />
      <SettingsItem
         text="Coaching Tools"
         onPress={() => {}}
      />
      <SettingsItem
         text="View Credits"
         onPress={() => openBrowser('https://media.giphy.com/media/C4msBrFb6szHG/giphy.gif')}
      /> 
    </ScrollView>
  )
}



const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#F7F7F7"
      //justifyContent: "flex-start"
   },
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
  //console.log(state.database)
  return {
    downloads: state.downloads,
    appProgress: state.appProgress,
    database: state.database,
    colors: state.database[state.database.currentLanguage].colors,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language)),
    changeLanguage: language => dispatch(changeLanguage(language)),
    resetProgress: () => dispatch(resetProgress())
  }
} 

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);