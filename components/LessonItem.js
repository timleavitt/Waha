//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, AsyncStorage } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { connect } from 'react-redux'
import { toggleComplete, setBookmark } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
import { removeDownload, resumeDownload } from '../redux/actions/downloadActions'
import DownloadStatusIndicator from '../components/DownloadStatusIndicator'

function LessonItem(props) {

   useEffect(() => {
      if (props.downloads[props.thisLesson.id] == 1) {
         props.removeDownload(props.thisLesson.id)
      }
   }, [props.downloads])
   
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


   return (
      <View style={[styles.lessonItem, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}>
         <TouchableOpacity
            style={[styles.progressAndTitle, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}
            onPress={
               (!props.isConnected && !props.isDownloaded) ?
                  () => Alert.alert(
                     props.translations.alerts.playUndownloadedNoInternet.header,
                     props.translations.alerts.playUndownloadedNoInternet.body,
                     [{ text: props.translations.alerts.options.ok, onPress: () => { } }]) :
                  props.onLessonSelect
            }
            onLongPress={showLessonOptionsModal}
         >
            <View style={styles.completeStatusContainer}>
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
         <DownloadStatusIndicator 
            isDownloaded={props.isDownloaded} 
            isConnected={props.isConnected}
            showDeleteModal={showDeleteModal}
            showSaveModal={showSaveModal}
            lessonID={props.thisLesson.id}
         />
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
   
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
      downloads: state.downloads,
      translations: state.database[activeGroup.language].translations,
      isConnected: state.network.isConnected
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: (groupName, lessonIndex) => { dispatch(toggleComplete(groupName, lessonIndex)) },
      setBookmark: groupName => { dispatch(setBookmark(groupName)) },
      removeDownload: lessonID => { dispatch(removeDownload(lessonID)) },
      resumeDownload: (lessonID, downloadSnapshotJSON) => { dispatch(resumeDownload(lessonID, downloadSnapshotJSON))}
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonItem);