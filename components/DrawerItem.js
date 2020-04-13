//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function DrawerItem(props) {

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////

   return (
      <TouchableOpacity style={[styles.settingsItem, { flexDirection: props.isRTL ? "row-reverse" : "row" }]} onPress={props.onPress}>
         <View style={styles.iconContainer}>
            <Icon
               name={props.name}
               size={50 * scaleMultiplier}
               color="#3A3C3F"
            />
         </View>
         <Text style={[styles.title, {textAlign: props.isRTL ? 'right' : 'left'}]}>{props.text}</Text>
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
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0];
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
      downloadLesson: (lessonID, source) => { dispatch(downloadLesson(lessonID, source)) },
      toggleComplete: lessonID => { dispatch(toggleComplete(lessonID)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItem);