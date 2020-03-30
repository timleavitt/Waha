//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import SettingsItem from '../components/SettingsItem'
import * as WebBrowser from 'expo-web-browser';
import HeaderButtons from '../components/HeaderButtons'

//redux imports
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { resetProgress } from '../redux/actions/appProgressActions';

function LanguageInstancesScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////


   //needs to do 3 things:
   //1. display installed languages
   //2. allow user to add a new language
      //use props.addlanguage(2digitlanguagecode)
      //go to loading screen while isfetching is true
   //3. allow user to remove a language
      //delete key from object immutably

   //set language based on user's language vs user's location?
   useEffect(() => {
      props.navigation.setParams({ primaryColor: props.colors.primaryColor })

      setListOfInstalledLanguages(Object.keys(props.database).filter(item => item.length === 2))
   }, [])

   const [listOfInstalledLanguages, setListOfInstalledLanguages] = useState([])

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
         <Text>List of installed languages:</Text>
         <Text>{listOfInstalledLanguages}</Text>
      </View>
   )
}

LanguageInstancesScreen.navigationOptions = navigationData => {
   const primaryColor = navigationData.navigation.getParam("primaryColor");

   return {
      headerTitle: "waha",
      headerBackTitle: "Back",
      headerStyle: {
         backgroundColor: primaryColor
      },
      headerTitleStyle: {
         color: "#fff",
         fontFamily: 'bold'   
      },
      headerLeft: () =>
         <HeaderButtons
            name='ios-arrow-back'
            onPress1={() => navigationData.navigation.goBack()}
            hasCompleteButton={false}
         />,
   };
};

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center"
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

export default connect(mapStateToProps, mapDispatchToProps)(LanguageInstancesScreen);