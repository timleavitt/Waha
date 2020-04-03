//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function DrawerItem(props) {

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   return (
      <TouchableOpacity style={[styles.settingsItem, { direction: props.isRTL ? "rtl" : "ltr" }]} onPress={props.onPress}>
         <View style={styles.iconContainer}>
            <Ionicons
               name={props.name}
               size={50 * scaleMultiplier}
               color="#3A3C3F"
            />
         </View>
         <Text style={styles.title}>{props.text}</Text>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   settingsItem: {
      height: 52 * scaleMultiplier,
      paddingLeft: 5,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      margin: 5
   },
   iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: 50 * scaleMultiplier
   },
   title: {
      color: '#3A3C3F',
      fontSize: 18 * scaleMultiplier,
      textAlignVertical: "center",
      paddingHorizontal: 10,
      fontFamily: 'medium',
      textAlign: "center"
   },
})

function mapStateToProps(state) {
   if (!state.database.isFetching) {
      return {
         isRTL: state.database[state.database.currentLanguage].isRTL,
      }
   } else {
      return {
         isFetching: state.database.isFetching,
      }
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: lessonID => { dispatch(toggleComplete(lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItem);