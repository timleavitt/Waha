//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'

//redux imports
import { connect } from 'react-redux'
import { editGroup, deleteGroup, resetProgress } from '../redux/actions/groupsActions'

function EditGroupScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////

   const [groupName, setGroupName] = useState(props.route.params.groupName)

   const [isActive, setIsActive] = useState(props.activeGroupName === props.route.params.groupName)

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

   function editGroup() {
      props.editGroup(props.route.params.groupName, groupName)
      props.navigation.goBack()
   }

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   var deleteButton = isActive ? <Text style={styles.cantDeleteText}>Can't delete currently selected group</Text> :
   <TouchableOpacity style={styles.deleteGroupButtonContainer} onPress={() => {props.deleteGroup(props.route.params.groupName); props.navigation.goBack();}}>
      <Text style={styles.deleteGroupButtonText}>Delete Group</Text>
   </TouchableOpacity> 

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.photoContainer}>
            <Text>Todo: photo stuff</Text>
         </View>
         <View style={styles.bottomHalfContainer}>
            <View style={styles.inputContainer}>
               <Text style={styles.groupNameLabel}>Group Name</Text>
               <TextInput
                  style={styles.addNewGroupContainer}
                  onChangeText={text => setGroupName(text)} value={groupName}
                  autoCapitalize='words'
                  autoCorrect={false}
                  placeholderTextColor='#9FA5AD'
                  maxLength={50}
                  returnKeyType='done'
               />
               <TouchableOpacity 
                  style={styles.resetProgressButtonContainer} 
                  onPress={
                     () => Alert.alert(
                        'Warning',
                        "Are you sure you'd like to reset your progress for this group?",
                        [{
                           text: 'Cancel',
                           onPress: () => { }
                        },
                        {
                           text: 'OK',
                           onPress: () => {props.resetProgress(props.route.params.groupName); props.navigation.goBack()}
                        }]
                     )
                  }
               >
                  <Text style={styles.resetProgressButtonText}>Reset Progress</Text>
               </TouchableOpacity>
               {deleteButton}
            </View>
            <TouchableOpacity style={styles.saveButtonContainer} onPress={editGroup}>
               <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#F7F7F7"
      //justifyContent: "flex-start"
   },
   photoContainer: {
      width: "100%",
      height: "30%",
      justifyContent: "center",
      alignItems: "center"
   },
   bottomHalfContainer: {
      flex: 1,
      justifyContent: "space-between",
   },
   inputContainer: {
      marginHorizontal: 25,
      padding: 3,
   },
   groupNameLabel: {
      fontFamily: "regular",
      fontSize: 14,
      color: '#9FA5AD'
   },
   addNewGroupContainer: {
      borderBottomColor: '#EFF2F4',
      borderBottomWidth: 2,
      height: 40,

      fontSize: 18,
      fontFamily: 'regular'
   },
   resetProgressButtonContainer: {
      width: "100%",
      borderColor: '#FF0800',
      borderWidth: 1,
      borderRadius: 5,
      height: 55,
      marginVertical: 20,
      justifyContent: "center",
      paddingLeft: 15
   },
   resetProgressButtonText: {
      color: '#FF0800',
      fontFamily: 'regular',
      fontSize: 18
   },
   deleteGroupButtonContainer: {
      width: "100%",
      borderRadius: 5,
      height: 55,
      justifyContent: "center",
      paddingLeft: 15,
      backgroundColor: '#FF0800'
   },
   deleteGroupButtonText: {
      color: '#FFFFFF',
      fontFamily: 'regular',
      fontSize: 18
   },
   cantDeleteText: {
      fontFamily: 'regular',
      fontSize: 14,
      color: '#9FA5AD'
   },
   saveButtonContainer: {
      width: 127,
      height: 52,
      borderRadius: 5,
      backgroundColor: "#60C239",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
      margin: 30,
   },
   saveButtonText: {
      fontSize: 18,
      fontFamily: 'bold',
      color: "#FFFFFF",
   },
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroupName: activeGroup.name
   }
};

function mapDispatchToProps(dispatch) {
   return {
      editGroup: (oldGroupName, newGroupName) => dispatch(editGroup(oldGroupName, newGroupName)),
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      resetProgress: name => { dispatch(resetProgress(name)) },
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupScreen);