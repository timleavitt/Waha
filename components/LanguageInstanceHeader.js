import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList, Alert, Image } from 'react-native';
import { connect } from 'react-redux'
import GroupListItem from '../components/GroupListItem'
import { scaleMultiplier, headerImages } from '../constants'
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
         style={[styles.trashButtonContainer, {marginRight: props.isRTL ? 15 : -15, marginLeft: props.isRTL ? -15 : 15}]}
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
         <Icon name='trash' size={25 * scaleMultiplier} color='#FF0800'/>
      </TouchableOpacity> : null
   
   return (
      <View style={styles.languageHeaderListContainer}>
         <View style={[styles.languageHeaderContainer, {flexDirection: props.isRTL ? 'row-reverse' : 'row'}]}>
            {trashButton}
            <Text style={[styles.languageHeaderText, {textAlign: props.isRTL ? 'right' :'left'}]}>{props.languageName}</Text>
            <Image style={styles.languageLogo} source={headerImages[props.languageID]} />
         </View>
         <FlatList
            data={props.groups.filter(group => group.language === props.languageID)}
            renderItem={renderGroupItem}
            keyExtractor={item => item.name}
         />
         <TouchableOpacity style={[styles.addGroupContainer, {flexDirection: props.isRTL ? "row-reverse" : "row"}]} onPress={props.goToAddNewGroupScreen}>
            <Icon name='group-add' size={35 * scaleMultiplier} color='#DEE3E9' style={{marginHorizontal: 15}}/>
            <Text style={[styles.addGroupText, {textAlign: props.isRTL ? 'right' :'left'}]}>New group</Text>
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
      width: '100%',
      height: 30,
   }, 
   trashButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
   }, 
   languageHeaderText: {
      fontSize: 18 * scaleMultiplier,
      fontFamily: "regular",
      color: "#9FA5AD",
      marginHorizontal: 30,
      flex: 1,
   },
   languageLogo: {
      resizeMode: "stretch",
      width: 96 * scaleMultiplier,
      height: 32 * scaleMultiplier,
      alignSelf: "flex-end",
      marginHorizontal: 10
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
      textAlign: 'left'
   },
})
function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      groups: state.groups,
      activeLanguage: activeGroup.language,
      database: state.database,
      activeGroupLanguage: activeGroup.language
   }
};

function mapDispatchToProps(dispatch) {
   return {
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      deleteLanguage: language => { dispatch(deleteLanguage(language))},
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageInstanceHeader);