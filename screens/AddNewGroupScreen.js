//imports
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Image } from 'react-native';

import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import * as ImagePicker from 'expo-image-picker';

//redux imports
import { connect } from 'react-redux'
import { createGroup } from '../redux/actions/groupsActions'
import WahaModal from '../components/WahaModal'
import ModalButton from '../components/ModalButton'
import AvatarImage from '../components/AvatarImage'

function AddNewGroupScreen(props) {


   //////////////////////////////////////////
   ////STATE, CONSTRUCTOR, AND NAVIGATION////
   //////////////////////////////////////////

   const [groupName, setGroupName] = useState('')

   const [avatarSource, setAvatarSource] = useState('')
   const [showImagePickerModal, setShowImagePickerModal] = useState(false)

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

   function addNewGroup() {
      props.createGroup(groupName, props.route.params.languageID, avatarSource)
      props.navigation.goBack()
   }

   async function openImageLibraryHandler() {
      var permissionGranted = false
      await ImagePicker.getCameraRollPermissionsAsync()
         .then((permissionResponse) => {
            //console.log(permissionResponse)
            if (permissionResponse.status !== 'granted') {
               console.log('not granted')
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
               console.log('not granted')
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




   //create modal in here, pass state to show it to lesson item so lesson item
   //can change it and show the modal on this screen
   return (
      <View style={styles.screen}>
         <View style={styles.photoContainer}>
            <AvatarImage source={avatarSource} onPress={() => setShowImagePickerModal(true)} size={120} />
         </View>
         <View style={styles.bottomHalfContainer}>
            <View style={styles.inputContainer}>
               <Text style={styles.groupNameLabel}>Group Name</Text>
               <TextInput
                  style={styles.addNewGroupContainer}
                  onChangeText={text => setGroupName(text)} value={groupName}
                  autoCapitalize='words'
                  autoCorrect={false}
                  placeholder='Group name here'
                  placeholderTextColor='#9FA5AD'
                  maxLength={50}
                  returnKeyType='done'
               />
            </View>
            <TouchableOpacity style={styles.saveButtonContainer} onPress={addNewGroup}>
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
   saveButtonContainer: {
      width: 127 * scaleMultiplier,
      height: 52 * scaleMultiplier,
      borderRadius: 5,
      backgroundColor: "#60C239",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
      margin: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
   },
   saveButtonText: {
      fontSize: 18 * scaleMultiplier,
      fontFamily: 'bold',
      color: "#FFFFFF"
   },
})


/////////////
////REDUX////
/////////////


function mapStateToProps(state) {
   //console.log(state.groups)
   return {
      downloads: state.downloads,
      appProgress: state.appProgress,
      database: state.database
   }
};

function mapDispatchToProps(dispatch) {
   return {
      createGroup: (groupName, language, imageSource) => dispatch(createGroup(groupName, language, imageSource)),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewGroupScreen);