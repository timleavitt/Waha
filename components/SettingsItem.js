//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'

function SettingsItem(props) {

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   return (
      <TouchableOpacity style={styles.settingsItem} onPress={props.onPress}>
         <Text style={styles.title}>{props.text}</Text>
         <Ionicons
            name='ios-arrow-forward'
            size={50}
            color="gray"
         />
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   settingsItem: {
      height: 75,
      padding: 5,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 20
   },
   title: {
      fontSize: 20,
      textAlignVertical: "center",
      paddingHorizontal: 10,
      fontFamily: 'regular'
   },
})

function mapStateToProps(state) {
   return {
      grayedOut: state.database[state.database.currentLanguage].colors.grayedOut,
      accentColor: state.database[state.database.currentLanguage].colors.accentColor,
      progress: state.appProgress,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: lessonID => { dispatch(toggleComplete(lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsItem);