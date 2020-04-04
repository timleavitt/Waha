//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'
import { toggleComplete } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'

function LessonItem(props) {

   const [isDownloaded, setIsDownloaded] = useState(false)

   //check if the lesson is downloaded and set isDownloaded accordingly
   FileSystem.getInfoAsync(FileSystem.documentDirectory + props.id + '.mp3')
      .then(({ exists }) => {
         exists ? setIsDownloaded(true) : setIsDownloaded(false)
         props.setRefresh(old => !old)
      }
      )

   //functions to call modals from lessonlistscreen
   //function are setState functions passed from lessonlistscreen
   function showSaveModal() {
      props.setIDToDownload.call();
      props.setShowSaveLessonModal.call();
   }

   function showDeleteModal() {
      props.setIDToDownload.call();
      props.setShowDeleteLessonModal.call();
   }

   function showLessonOptionsModal() {
      props.setIDToDownload.call();
      props.setShowLessonOptionsModal.call();
   }

   //console.log(props.isDownloaded)


   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////


   //component for what to display on the far right of the list
   //can either be cloud down arrow (click to download), x (click to delete),
   //a no internet icon, or a spin icon if it's downloading
   var downloadedFeedback;
   var progressBar;
   if (!props.downloadProgress) {
      downloadedFeedback =
         <TouchableOpacity
            onPress={
               isDownloaded ? showDeleteModal :
                  (props.isConnected ? showSaveModal : 
                     () => Alert.alert(
                     'Error',
                     'Internet connection is required to download lessons',
                     [{ text: 'OK', onPress: () => { } }]))}
            style={styles.downloadButtonContainer}
         >
            <MaterialCommunityIcons
               name={isDownloaded ? "cloud-check" : (props.isConnected ? "cloud-download" : "cloud-off-outline")}
               color={isDownloaded ? "#9FA5AD" : "#3A3C3F"}
               size={25 * scaleMultiplier}
            />
         </TouchableOpacity>
      progressBar = null;
   } else {
      downloadedFeedback = <View style={styles.downloadButtonContainer}><ActivityIndicator size="small" color="black" /></View>
      progressBar = <Progress.Bar progress={props.downloadProgress} width={400} color="black" borderColor="black" />
   }

   return (
      <View style={[styles.lessonItem, {direction: props.isRTL ? "rtl" : "ltr"}]}>
         <View style={styles.mainDisplay}>
            <TouchableOpacity
               style={styles.progressAndTitle}
               onPress={
                  (!props.isConnected && !isDownloaded) ?
                     () => Alert.alert(
                        'Error',
                        'Internet connection is required to listen to undownloaded lessons',
                        [{ text: 'OK', onPress: () => { } }]) :
                     props.onLessonSelect
               }
               onLongPress={showLessonOptionsModal}
            >
               <TouchableOpacity style={styles.completeStatusContainer} onPress={() => props.toggleComplete(props.activeGroupName, props.id)}>
                  <MaterialCommunityIcons
                     name={props.isComplete ? "check-circle" : "play-box-outline"}
                     size={30}
                     color={props.isComplete ? "#828282" : props.colors.primaryColor}
                  />
               </TouchableOpacity>
               <View style={styles.titleContainer}>
                  <Text style={{ ...styles.title, ...{ color: props.isComplete ? "#9FA5AD" : "black" } }}>{props.title}</Text>
                  <Text style={{ ...styles.subtitle, ...{ color: props.isComplete ? "#9FA5AD" : "black" } }}>{props.subtitle}</Text>
               </View>

            </TouchableOpacity>
            {downloadedFeedback}
         </View>
         <View style={styles.progressBar}>
            {progressBar}
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   lessonItem: {
      height: 72 * scaleMultiplier,
      justifyContent: "center",
      flexDirection: "column",
      alignContent: "center",
   },
   mainDisplay: {
      flexDirection: "row",
   },
   progressAndTitle: {
      justifyContent: "flex-start",
      flexDirection: 'row',
      alignContent: "center",
      flex: 1,
   },
   completeStatusContainer: {
      justifyContent: "center",
      marginHorizontal: 10,
   },
   titleContainer: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
   },
   title: {
      fontSize: 18 * scaleMultiplier,
      textAlignVertical: "center",
      paddingHorizontal: 10,
      fontFamily: 'medium',
      textAlign: "left"
   },
   subtitle: {
      fontSize: 14 * scaleMultiplier,
      paddingHorizontal: 10,
      fontFamily: 'regular',
      textAlign: "left"
   },
   downloadButtonContainer: {
      justifyContent: "center",
      marginLeft: 5,
      marginRight: 15
   },
   progressBar: {
      width: "100%"
   }
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroupName: state.activeGroup
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonID) => { dispatch(toggleComplete(groupName, lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonItem);