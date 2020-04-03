//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'
import { toggleComplete } from '../redux/actions/appProgressActions'
import { scaleMultiplier } from '../constants'

function GroupListItem(props) {

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   return (
      <View style={[styles.groupListItemContainer, { direction: props.isRTL ? "rtl" : "ltr" }]}>
         <View style={styles.iconContainer}>
            <Ionicons name='ios-people' size={50} />
         </View>
         <Text style={styles.groupNameText}>{props.name}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   groupListItemContainer: {
      height: 72 * scaleMultiplier,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      margin: 5
   },
   iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 15
   },
   groupNameText: {
      color: "#3A3C3F",
      fontSize: 18,
      fontFamily: 'bold'
   }
})

function mapStateToProps(state) {
   return {
      colors: state.database[state.database.currentLanguage].colors,
      progress: state.appProgress,
      isRTL: state.database[state.database.currentLanguage].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: lessonID => { dispatch(toggleComplete(lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListItem);