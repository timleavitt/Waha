//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'

//redux imports
import { connect } from 'react-redux'
import { createGroup } from '../redux/actions/groupsActions'
import { addLanguage } from '../redux/actions/databaseActions'

function AddNewLanguageScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////


   //set language based on user's language vs user's location?
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [])

   function getNavOptions() {
      return {
         headerRight: props.isRTL ? () =>
            <BackButton
               isRTL={props.isRTL}
               onPress={() => props.navigation.goBack()}
            /> :
            () => <View></View>,
         headerLeft: props.isRTL ? () =>
            <View></View> :
            () =>
               <BackButton
                  isRTL={props.isRTL}
                  onPress={() => props.navigation.goBack()}
               />,
      }
   }

   var languageInstanceList = [
      {
         id: 'en',
         displayName: 'English'
      },
      {
         id: 'kl',
         displayName: 'Klingon'
      },
   ]

   var installedLanguageInstances = []
   for (key in props.database) {
      if (key.length === 2) {
         installedLanguageInstances.push(key)
      }
   }

   ///////////////////////
   ////OTHER FUNCTIONS////
   ///////////////////////

   function addNewLanguage(language) {
      props.addLanguage(language)
   }

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   function renderLanguageInstanceItem(languageInstanceList) {
      return (
         <TouchableOpacity
            style={styles.languageInstanceItem}
            onPress={() => Alert.alert
               ("Are you sure you'd like to add a new language instance?",
                  "You will not be able to use the app until the language instance is added",
                  [{
                     text: 'Cancel',
                     onPress: () => { }
                  },
                  {
                     text: 'OK',
                     onPress: () => addNewLanguage(languageInstanceList.item.id)
                  }
                  ])}>
            <Text style={styles.languageInstanceText}>{languageInstanceList.item.displayName}</Text>
         </TouchableOpacity>
      )
   }

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <FlatList
            data={languageInstanceList.filter(item => !installedLanguageInstances.includes(item.id))}
            renderItem={renderLanguageInstanceItem}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#F7F7F7"
      //justifyContent: "flex-start"
   },
   languageInstanceItem: {
      flexDirection: "row",
      alignItems: "center",
      height: 60,
      margin: 5,
      borderWidth: 2,
      borderColor: "#9FA5AD"
   },
   languageInstanceText: {
      color: '#82868D',
      paddingLeft: 10,
      fontSize: 18,
      fontFamily: 'regular'
   }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   return {
      downloads: state.downloads,
      appProgress: state.appProgress,
      database: state.database,
      colors: state.database[state.database.currentLanguage].colors,
      isRTL: state.database[state.database.currentLanguage].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      addLanguage: language => dispatch(addLanguage(language)),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewLanguageScreen);