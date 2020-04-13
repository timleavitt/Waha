//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import * as ImagePicker from 'expo-image-picker';

//redux imports
import { connect } from 'react-redux'
import { editGroup, deleteGroup, resetProgress, changeActiveGroup } from '../redux/actions/groupsActions'
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import AvatarImage from '../components/AvatarImage'

function EditGroupScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////

   const [groupName, setGroupName] = useState(props.route.params.groupName)

   const [isActive, setIsActive] = useState(props.activeGroupName === props.route.params.groupName)
   const [editingGroup, setEditingGroup] = useState(props.groups.filter(item => item.name === props.route.params.groupName)[0])

   const [avatarSource, setAvatarSource] = useState(editingGroup.imageSource)
   const [showImagePickerModal, setShowImagePickerModal] = useState(false)

   //set language based on user's language vs user's location?
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [props.isRTL])

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
      props.changeActiveGroup(groupName)
      props.editGroup(props.route.params.groupName, groupName, avatarSource)
      props.navigation.goBack()
   }

   async function openImageLibraryHandler() {
      var permissionGranted = false
      await ImagePicker.getCameraRollPermissionsAsync()
         .then((permissionResponse) => {
            //console.log(permissionResponse)
            if (permissionResponse.status !== 'granted') {
               //console.log('not granted')
               // console.log('not granted')
               ImagePicker.requestCameraRollPermissionsAsync()
                  .then(permissionResponse => {
                     if (permissionResponse.status === 'granted') {
                        openImageLibraryHandler()
                     }
                  })
            }
            else {
               permissionGranted = true
            }
         })
      if (permissionGranted) {
         ImagePicker.launchImageLibraryAsync({})
            .then(returnObject => {
               if (returnObject.cancelled !== true) {
                  setAvatarSource(returnObject.uri)
               }
               setShowImagePickerModal(false)
            })
      }
   }

   async function openCameraHandler() {
      var permissionGranted = false
      await ImagePicker.getCameraPermissionsAsync()
         .then((permissionResponse) => {
            //console.log(permissionResponse)
            if (permissionResponse.status !== 'granted') {
               //console.log('not granted')
               // console.log('not granted')
               ImagePicker.requestCameraPermissionsAsync()
                  .then(permissionResponse => {
                     if (permissionResponse.status === 'granted') {
                        openCameraHandler()
                     }
                  })
            }
            else {
               permissionGranted = true
            }
         })
      if (permissionGranted) {
         ImagePicker.launchCameraAsync({})
            .then(returnObject => {
               if (returnObject.cancelled !== true) {
                  setAvatarSource(returnObject.uri)
               }
               setShowImagePickerModal(false)
            })
      }
   }

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   var deleteButton = isActive ? <Text style={[styles.cantDeleteText, {textAlign: props.isRTL ? 'right' : 'left'}]}>Can't delete currently selected group</Text> :
   <TouchableOpacity style={styles.deleteGroupButtonContainer} onPress={() => {props.deleteGroup(props.route.params.groupName); props.navigation.goBack();}}>
      <Text style={[styles.deleteGroupButtonText, {textAlign: props.isRTL ? 'right' : 'left'}]}>Delete Group</Text>
   </TouchableOpacity> 

   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.photoContainer}>
            <AvatarImage source={avatarSource} onPress={() => setShowImagePickerModal(true)} size={120} isChangeable={true}/>
         </View>
         <View style={styles.bottomHalfContainer}>
            <View style={styles.inputContainer}>
               <Text style={[styles.groupNameLabel, {textAlign: props.isRTL ? 'right' : 'left'}]}>Group Name</Text>
               <TextInput
                  style={[styles.addNewGroupContainer, {textAlign: props.isRTL ? 'right' : 'left'}]}
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
                  <Text style={[styles.resetProgressButtonText, {textAlign: props.isRTL ? 'right' : 'left'}]}>Reset Progress</Text>
               </TouchableOpacity>
               {deleteButton}
            </View>
            <TouchableOpacity style={[styles.saveButtonContainer, {alignSelf: props.isRTL ? 'flex-start' : "flex-end",}]} onPress={editGroup}>
               <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
         </View>
         <WahaModal isVisible={showImagePickerModal}>
            <ModalButton title='Take Photo' onPress={openCameraHandler} />
            <ModalButton title='Choose from Library...' onPress={openImageLibraryHandler} />
            <ModalButton title='Cancel' onPress={() => setShowImagePickerModal(false)} />
         </WahaModal>
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#FFFFFF"
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
      fontSize: 14 * scaleMultiplier,
      color: '#9FA5AD'
   },
   addNewGroupContainer: {
      borderBottomColor: '#EFF2F4',
      borderBottomWidth: 2,
      height: 40 * scaleMultiplier,
      fontSize: 18 * scaleMultiplier,
      fontFamily: 'regular'
   },
   resetProgressButtonContainer: {
      width: "100%",
      borderColor: '#FF0800',
      borderWidth: 1,
      borderRadius: 5,
      height: 55 * scaleMultiplier,
      marginVertical: 20,
      justifyContent: "center",
      paddingHorizontal: 15
   },
   resetProgressButtonText: {
      color: '#FF0800',
      fontFamily: 'regular',
      fontSize: 18 * scaleMultiplier,
   },
   deleteGroupButtonContainer: {
      width: "100%",
      borderRadius: 5,
      height: 55 * scaleMultiplier,
      justifyContent: "center",
      paddingHorizontal: 15,
      backgroundColor: '#FF0800'
   },
   deleteGroupButtonText: {
      color: '#FFFFFF',
      fontFamily: 'regular',
      fontSize: 18 * scaleMultiplier
   },
   cantDeleteText: {
      fontFamily: 'regular',
      fontSize: 14 * scaleMultiplier,
      color: '#9FA5AD'
   },
   saveButtonContainer: {
      width: 127 * scaleMultiplier,
      height: 52 * scaleMultiplier,
      borderRadius: 5,
      backgroundColor: "#60C239",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
      margin: 30,
   },
   saveButtonText: {
      fontSize: 18 * scaleMultiplier,
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
      groups: state.groups,
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroupName: activeGroup.name,
      activeGroupImageSource: activeGroup.imageSource
   }
};

function mapDispatchToProps(dispatch) {
   return {
      editGroup: (oldGroupName, newGroupName, imageSource) => dispatch(editGroup(oldGroupName, newGroupName, imageSource)),
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      resetProgress: name => { dispatch(resetProgress(name)) },
      changeActiveGroup: name => { dispatch(changeActiveGroup(name)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupScreen);