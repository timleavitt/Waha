//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'

//redux imports
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import LanguageInstanceHeader from '../components/LanguageInstanceHeader';

function GroupsScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////

   const [isEditing, setIsEditing] = useState(false)

   //set language based on user's language vs user's location?
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [isEditing])

   function getNavOptions() {
      return {
         headerRight: props.isRTL ? 
            () =>
               <BackButton
                  isRTL={props.isRTL}
                  onPress={() => props.navigation.goBack()}
               /> :
            () => 
               <TouchableOpacity style={styles.editButtonContainer} onPress={() => setIsEditing(old => !old)}>
                  <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
               </TouchableOpacity>,
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

   function getInstalledLanguageInstances() {
      var installedLanguageInstances = []
      for (key in props.database) {
         if (key.length === 2) {
            var languageObject = {};
            languageObject['languageName'] = props.database[key].displayName
            languageObject['languageID'] = key
            installedLanguageInstances.push(languageObject)
         }
      }
      return installedLanguageInstances
   }



   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   function renderLanguageInstanceItem(languageInstances) {
      return (
         <LanguageInstanceHeader
            languageName={languageInstances.item.languageName}
            languageID={languageInstances.item.languageID}
            goToAddNewGroupScreen={() => props.navigation.navigate('AddNewGroup', {languageID: languageInstances.item.languageID})}
            goToEditGroupScreen={groupName => props.navigation.navigate('EditGroup', {groupName: groupName})}
            isEditing={isEditing}
         />
      )
   }

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.languageList}>
         <FlatList   
            data={getInstalledLanguageInstances()}
            renderItem={renderLanguageInstanceItem}
            keyExtractor={item => item.languageID}
         />
         </View>
         <TouchableOpacity style={styles.addNewLanguageContainer} onPress={() => props.navigation.navigate('AddNewLanguage', {installedLanguageInstances: getInstalledLanguageInstances()})}>
            <Text style={styles.addNewLanguageText}>+ New language</Text>
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
      height: 80 * scaleMultiplier,
      justifyContent: "center",
      borderTopWidth: 2,
      borderTopColor: '#EFF2F4'
   },
   addNewLanguageText: {
      fontFamily: 'medium',
      fontSize: 18,
      color: '#9FA5AD',
      marginHorizontal: 15
   },
   editButtonContainer: {
      width: 80,
      height: "100%",
      justifyContent: "center",
      alignItems: "center"
   },
   editButtonText: {
      fontFamily: 'regular',
      fontSize: 18
   }
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   //console.log(state.groups)
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