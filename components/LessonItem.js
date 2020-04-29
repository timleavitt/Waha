//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { connect } from 'react-redux'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { removeDownload } from '../redux/actions/downloadActions'


function LessonItem(props) {

   //// FUNCTIONS

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
   var downloadStatus = props.downloads[props.thisLesson.id] && props.downloads[props.thisLesson.id] < 1 ?
      <View style={styles.downloadButtonContainer}>
         <AnimatedCircularProgress
            size={25 * scaleMultiplier}
            width={6 * scaleMultiplier}
            fill={ props.downloads[props.thisLesson.id] * 100}
            tintColor={"#828282"}
            rotation={0}
            backgroundColor="#FFFFFF"
         />
      </View> :
      <TouchableOpacity
         onPress={
            props.downloads[props.thisLesson.id] == 1 ? showDeleteModal :
               (props.isConnected ? showSaveModal :
                  () => Alert.alert(
                     props.translations.alerts.downloadNoInternet.header,
                     props.translations.alerts.downloadNoInternet.body,
                     [{ text: props.translations.alerts.options.ok, onPress: () => { } }]
                  ))}
         style={styles.downloadButtonContainer}
      >
         <Icon
            name={props.downloads[props.thisLesson.id] == 1 ? "cloud-check" : (props.isConnected ? "cloud-download" : "cloud-slash")}
            color={props.downloads[props.thisLesson.id] == 1 ? "#9FA5AD" : "#3A3C3F"}
            size={25 * scaleMultiplier}
         />
      </TouchableOpacity>

   return (
      <View style={[styles.lessonItem, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}>
         <TouchableOpacity
            style={[styles.progressAndTitle, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}
            onPress={
               (!props.isConnected && !props.downloads[props.thisLesson.id]) ?
                  () => Alert.alert(
                     props.translations.alerts.playUndownloadedNoInternet.header,
                     props.translations.alerts.playUndownloadedNoInternet.body,
                     [{ text: props.translations.alerts.options.ok, onPress: () => { } }]) :
                  props.onLessonSelect
            }
            onLongPress={showLessonOptionsModal}
         >
            <View
               style={styles.completeStatusContainer}
               onPress={() => {

               }}
            >
               <Icon
                  name={props.isComplete ? "check-unfilled" : props.activeGroup.bookmark === props.thisLesson.index ? props.isRTL ? 'triangle-left' : "triangle-right" : null}
                  size={30 * scaleMultiplier}
                  color={props.isComplete ? "#828282" : props.colors.primaryColor}
               />
            </View>
            <View style={styles.titleContainer}>
               <Text style={{ ...styles.title, ...{ color: props.isComplete ? "#9FA5AD" : "black", textAlign: props.isRTL ? 'right' : 'left' } }}>{props.thisLesson.title}</Text>
               <Text style={{ ...styles.subtitle, ...{ color: props.isComplete ? "#9FA5AD" : "black", textAlign: props.isRTL ? 'right' : 'left' } }}>{props.thisLesson.subtitle}</Text>
            </View>

         </TouchableOpacity>
         {downloadStatus}
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   lessonItem: {
      height: 72 * scaleMultiplier,
      justifyContent: "center",
      flexDirection: "row",
      alignContent: "center",
      backgroundColor: "#F7F9FA"
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
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
      downloads: state.downloads
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonIndex) => { dispatch(toggleComplete(groupName, lessonIndex)) },
      setBookmark: groupName => { dispatch(setBookmark(groupName)) },
      removeDownload: lessonID => { dispatch(removeDownload(lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonItem);