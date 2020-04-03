//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'

//redux imports
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { resetProgress } from '../redux/actions/appProgressActions';
import LanguageInstanceHeader from '../components/LanguageInstanceHeader';

function GroupsScreen(props) {


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

   ///////////////////////
   ////OTHER FUNCTIONS////
   ///////////////////////



   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   function renderLanguageInstanceItem(languageInstances) {
      return (
         <LanguageInstanceHeader
            languageInstance={languageInstances.item}
            goToAddNewGroupScreen={() => props.navigation.navigate('AddNewGroup', {languageInstance: languageInstances.item})}
         />
      )
   }

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.languageList}>
         <FlatList
            data={Object.keys(props.database)}
            renderItem={renderLanguageInstanceItem}
            keyExtractor={item => item}
         />
         </View>
         <TouchableOpacity style={styles.addNewLanguageContainer} onPress={() => props.addLanguage('TestLanguageOne')}>
            <Text style={styles.addNewLanguageText}>Add new language</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#DEE3E9",
      //justifyContent: "flex-start"
   },
   languageList: {
      marginTop: 10,
      flex: 1
   },
   addNewLanguageContainer: {
      width: "100%",
      height: 50
   },
   addNewLanguageText: {
      fontFamily: 'regular',
      fontSize: 18,
      color: '#9FA5AD',
      marginHorizontal: 15
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);