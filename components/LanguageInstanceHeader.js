import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux'
import GroupListItem from '../components/GroupListItem'
import {scaleMultiplier} from '../constants'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { deleteGroup } from '../redux/actions/groupsActions'
import { deleteLanguage } from '../redux/actions/databaseActions'
import * as FileSystem from 'expo-file-system';

function LanguageInstanceHeader(props) {

   function deleteLanguageInstance() {

      //1. delete all groups w/ this language
      props.groups.map(group => {
         if (group.language === props.languageID) {
            props.deleteGroup(group.name)
         }
      })

      //2. delete all downloaded files for this language
      FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
         //only delete the lessons which are 6 digit ids
         for (var i = 0; i < contents.length; i++) {
            if (contents[i].slice(0, 2) === props.database[props.languageID].studySets[0].id.slice(0,2) ||
            contents[i].slice(0, 2) === props.languageID)
            FileSystem.deleteAsync(FileSystem.documentDirectory + contents[i])
         }
      });

      //3. delete section of database for this language
      props.deleteLanguage(props.languageID)
   }

   function renderGroupItem(groups) {
      return (
         <GroupListItem
            name={groups.item.name}
            isEditing={props.isEditing}
            goToEditGroupScreen={props.goToEditGroupScreen}
            avatarSource={groups.item.imageSource}
         />
      )
   }

   var trashButton = (props.isEditing && !(props.activeLanguage === props.languageID)) ?
      <TouchableOpacity
         style={styles.trashButtonContainer}
         onPress={
            () => Alert.alert(
               'Warning',
               "Are you sure you'd like to delete all data for this language instance? This includes, downloaded lessons, groups, and progress.",
               [{
                  text: 'Cancel',
                  onPress: () => { }
               },
               {
                  text: 'OK',
                  onPress: deleteLanguageInstance
               }]
            )
         }
      >
         <Ionicons name='md-trash' size={25 * scaleMultiplier} color='#FF0800'/>
      </TouchableOpacity> : null
   
   return (
      <View style={styles.languageHeaderListContainer}>
         <View style={styles.languageHeaderContainer}>
            {trashButton}
            <Text style={styles.languageHeaderText}>{props.languageName}</Text>
         </View>
         <FlatList
            data={props.groups.filter(group => group.language === props.languageID)}
            renderItem={renderGroupItem}
            keyExtractor={item => item.name}
         />
         <TouchableOpacity style={[styles.addGroupContainer, {direction: props.isRTL ? "rtl" : "ltr"}]} onPress={props.goToAddNewGroupScreen}>
            <MaterialIcons name='group-add' size={30 * scaleMultiplier} color='#DEE3E9' style={{marginLeft: 10}}/>
            <Text style={styles.addGroupText}>New group</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   languageHeaderListContainer: {
      width: "100%",
      marginBottom: 15,
      marginTop: 3
   },
   languageHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   }, 
   trashButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 15,
      marginRight: -15
   }, 
   languageHeaderText: {
      fontSize: 18 * scaleMultiplier,
      fontFamily: "regular",
      color: "#9FA5AD",
      marginLeft: 30
   },
   addGroupContainer: {
      height: 80 * scaleMultiplier,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      margin: 3,
   },
   addGroupText: {
      color: "#2D9CDB",
      fontSize: 18 * scaleMultiplier,
      fontFamily: 'medium-italic',
      marginLeft: 15,
      textAlign: 'left'
   }
})
function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      groups: state.groups,
      activeLanguage: activeGroup.language,
      database: state.database
   }
};

function mapDispatchToProps(dispatch) {
   return {
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      deleteLanguage: language => { dispatch(deleteLanguage(language))},
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageInstanceHeader);