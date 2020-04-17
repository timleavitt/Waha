//imports
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'

function LessonItem(props) {

   //// STATE

   const [isDownloaded, setIsDownloaded] = useState(false)

   //// FUNCTIONS

   // checks if the lesson is downloaded and set isDownloaded accordingly
   FileSystem.getInfoAsync(FileSystem.documentDirectory + props.lesson.id + '.mp3')
      .then(({ exists }) => {
         exists ? setIsDownloaded(true) : setIsDownloaded(false)
         props.setRefresh(old => !old)
      })

   // calls the various modal functions on lessonlistscreen
   function showSaveModal() {
      props.setActiveLessonInModal.call();
      props.setShowSaveLessonModal.call();
   }
   function showDeleteModal() {
      props.setActiveLessonInModal.call();
      props.setShowDeleteLessonModal.call();
   }
   function showLessonOptionsModal() {
      props.setActiveLessonInModal.call();
      props.setShowLessonOptionsModal.call();
   }

   //// RENDER

   // renders cloud icon conditionally as statuses can be downloaded, undownloaded, downloading, and no internet
   var downloadStatus = props.downloadProgress ?
      <View style={styles.downloadButtonContainer}><ActivityIndicator size="small" color="black" /></View> :
      <TouchableOpacity
         onPress={
            isDownloaded ? showDeleteModal :
               (props.isConnected ? showSaveModal :
                  () => Alert.alert(
                     props.translations.alerts.downloadNoInternet.header,
                     props.translations.alerts.downloadNoInternet.body,
                     [{ text: props.translations.alerts.options.ok, onPress: () => { } }]
                  ))}
         style={styles.downloadButtonContainer}
      >
         <Icon
            name={isDownloaded ? "cloud-check" : (props.isConnected ? "cloud-download" : "cloud-slash")}
            color={isDownloaded ? "#9FA5AD" : "#3A3C3F"}
            size={25 * scaleMultiplier}
         />
      </TouchableOpacity>

   // renders component for progress bar if the lesson is downloading
   var progressBar = props.downloadProgress ?
      <Progress.Bar progress={props.downloadProgress} width={400} color="black" borderColor="black" /> :
      null

   return (
      <View style={styles.lessonItem}>
         <View style={[styles.mainDisplay, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity
               style={[styles.progressAndTitle, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}
               onPress={
                  (!props.isConnected && !isDownloaded) ?
                     () => Alert.alert(
                        props.translations.alerts.playUndownloadedNoInternet.header,
                        props.translations.alerts.playUndownloadedNoInternet.body,
                        [{ text: props.translations.alerts.options.ok, onPress: () => { } }]) :
                     props.onLessonSelect
               }
               onLongPress={showLessonOptionsModal}
            >
               <TouchableOpacity
                  style={styles.completeStatusContainer}
                  onPress={() => {
                     props.toggleComplete(props.activeGroup.name, props.lesson.index)
                     props.setBookmark(props.activeGroup.name)
                  }}
               >
                  <Icon
                     name={props.isComplete ? "check-unfilled" : props.activeGroup.bookmark === props.lesson.index ? props.isRTL ? 'triangle-left' : "triangle-right" : null}
                     size={30 * scaleMultiplier}
                     color={props.isComplete ? "#828282" : props.colors.primaryColor}
                  />
               </TouchableOpacity>
               <View style={styles.titleContainer}>
                  <Text style={{ ...styles.title, ...{ color: props.isComplete ? "#9FA5AD" : "black", textAlign: props.isRTL ? 'right' : 'left' } }}>{props.lesson.title}</Text>
                  <Text style={{ ...styles.subtitle, ...{ color: props.isComplete ? "#9FA5AD" : "black", textAlign: props.isRTL ? 'right' : 'left' } }}>{props.lesson.subtitle}</Text>
               </View>

            </TouchableOpacity>
            {downloadStatus}
         </View>
         <View style={styles.progressBar}>
            {progressBar}
         </View>
      </View>
   )
}

//// STYLES

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
      width: 35 * scaleMultiplier
   },
   titleContainer: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
   },
   title: {
      fontSize: 18 * scaleMultiplier,
      textAlignVertical: "center",
      fontFamily: 'medium',
   },
   subtitle: {
      fontSize: 14 * scaleMultiplier,
      fontFamily: 'regular',
   },
   downloadButtonContainer: {
      justifyContent: "center",
      marginHorizontal: 15
   },
   progressBar: {
      width: "100%"
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonIndex) => { dispatch(toggleComplete(groupName, lessonIndex)) },
      setBookmark: groupName => { dispatch(setBookmark(groupName)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonItem);