import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'
import LanguageInstanceHeader from '../components/LanguageInstanceHeader';

function GroupsScreen(props) {

   //// STATE

   const [isEditing, setIsEditing] = useState(false)

   //// CONSTRUCTOR

   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [isEditing, props])

   //// NAV OPTIONS

   function getNavOptions() {
      return {
         headerRight: props.isRTL ? 
            () => <BackButton onPress={() => props.navigation.goBack()}/> :
            () => 
               <TouchableOpacity style={styles.editButtonContainer} onPress={() => setIsEditing(old => !old)}>
                  <Text style={styles.editButtonText}>{isEditing ? props.translations.labels.done : props.translations.labels.edit}</Text>
               </TouchableOpacity>,
         headerLeft: props.isRTL ? 
            () =>
               <TouchableOpacity style={styles.editButtonContainer} onPress={() => setIsEditing(old => !old)}>
                  <Text style={styles.editButtonText}>{isEditing ? props.translations.labels.done : props.translations.labels.edit}</Text>
               </TouchableOpacity> :
            () => <BackButton onPress={() => props.navigation.goBack()}/>,
      }
   }

   //// FUNCTIONS

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

   //// RENDER

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

   return (
      <View style={styles.screen}>
         <View style={styles.languageList}>
            <FlatList
               data={getInstalledLanguageInstances()}
               renderItem={renderLanguageInstanceItem}
               keyExtractor={item => item.languageID}
               ListFooterComponent={
                  <TouchableOpacity style={[styles.addNewLanguageContainer, {direction: props.isRTL ? "rtl" : "ltr"}]} onPress={() => props.navigation.navigate('AddNewLanguage', { installedLanguageInstances: getInstalledLanguageInstances() })}>
                     <Text style={[styles.addNewLanguageText, {textAlign: props.isRTL ? 'right' : 'left'}]}>{props.translations.labels.newLanguage}</Text>
                  </TouchableOpacity>
               }
            />
         </View>
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#EFF2F4",
   },
   languageList: {
      flex: 1
   },
   addNewLanguageContainer: {
      width: "100%",
      height: 80 * scaleMultiplier,
      justifyContent: "center",
      borderTopColor: '#EFF2F4'
   },
   addNewLanguageText: {
      fontFamily: 'medium',
      fontSize: 18  * scaleMultiplier,
      color: '#9FA5AD',
      marginHorizontal: 15,
      textAlign: "left"
   },
   editButtonContainer: {
      width: 80,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
   },
   editButtonText: {
      fontFamily: 'regular',
      fontSize: 18 * scaleMultiplier
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      database: state.database,
      isRTL: state.database[activeGroup.language].isRTL,
      translations: state.database[activeGroup.language].translations
   }
};

export default connect(mapStateToProps)(GroupsScreen);