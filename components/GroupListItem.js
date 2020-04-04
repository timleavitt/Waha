//imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux'
import { deleteGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'

function GroupListItem(props) {

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////
   var deleteButton;
   if (props.isEditing && props.activeGroup != props.name) {
      deleteButton =
         <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => props.deleteGroup(props.name)}
         >
            <MaterialCommunityIcons name='minus-circle' size={30} color="#FF0800" />
         </TouchableOpacity>
   } else {
      deleteButton = null
   }

   var rightButton;
   if (props.activeGroup === props.name) {
      rightButton = 
         <View style={styles.iconContainer}>
            <Ionicons
               name="md-checkmark"
               size={24}
               color="black"
            />
         </View>
   } else if (props.isEditing) {
      rightButton =
         <View
            style={styles.iconContainer}
            onPress={() => { }}
         >
            <Ionicons
               name={props.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
               size={50}
               color="gray"
            />
         </View>
   } else {
      rightButton = null;
   }

   return (
      <TouchableOpacity 
         style={[styles.groupListItemContainer, { direction: props.isRTL ? "rtl" : "ltr" }]}
         onPress={props.isEditing ? () => props.goToEditGroupScreen(props.name) : () => {props.changeActiveGroup(props.name)}}
      >
         {deleteButton}
         <View style={styles.iconContainer}>
            <Ionicons name='ios-people' size={50} />
         </View>
         <View style={styles.groupNameContainer}>
            <Text style={styles.groupNameText}>{props.name}</Text>
         </View>
         {rightButton}
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   groupListItemContainer: {
      height: 72 * scaleMultiplier,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      margin: 5,
   },
   iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 15,
      height: "100%"
   },
   groupNameContainer: {
      flex: 1, 
      height: "100%",
      justifyContent: "center"
   }, 
   groupNameText: {
      color: "#3A3C3F",
      fontSize: 18,
      fontFamily: 'bold'
   }
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      progress: state.appProgress,
      isRTL: state.database[activeGroup.language].isRTL,
      groups: state.groups,
      activeGroup: state.activeGroup
   }
};

function mapDispatchToProps(dispatch) {
   return {
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      changeActiveGroup: name => { dispatch(changeActiveGroup(name))}
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListItem);