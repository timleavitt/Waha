//imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { deleteGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'

function GroupListItem(props) {

   function getBookmarkText() {
      var bookmarkInt = 0;
      var thisGroupProgress = props.groups.filter(item => item.name === props.name)[0].progress
      //if a group has no progress, return the first lesson in the first study set
      if (thisGroupProgress.length === 0) {
         var firstLesson = props.currentDatabase.studySets[0].lessons[0]
         return (firstLesson.subtitle + ' ' + firstLesson.title)
      }
      thisGroupProgress.map(lessonID => {
         if (parseInt(lessonID) > bookmarkInt)
            bookmarkInt = parseInt(lessonID)
         return null;
      })


      //string of the id of the last completed lesson 
      var bookmarkString = bookmarkInt.toString();
      var extraZero = ''
      if (bookmarkString.length < 6)
         extraZero = '0'
      bookmarkString = extraZero + bookmarkString

      var lessonListOfBookmarkStudySet = props.currentDatabase.studySets.filter(
         studySet => studySet.id === bookmarkString.slice(-6, -2)
      )[0].lessons

      //edge case: the last completed lesson is the last in a study set
      if (parseInt(bookmarkString.slice(-2)) === lessonListOfBookmarkStudySet.length) {
         //edge case: the last completed lesson is the last available lesson in any study set
         if (parseInt(bookmarkString.slice(-4, -2)) === props.currentDatabase.studySets.length) {
            return ('Contact us for more study sets!')
         } else {
            bookmarkString = (bookmarkString.slice(-6, -4).concat((extraZero + (parseInt(bookmarkString.slice(-4, -2)) + 1)).toString(), bookmarkString.slice(-2)))
            lessonListOfBookmarkStudySet = props.currentDatabase.studySets.filter(
               studySet => studySet.id === bookmarkString.slice(-6, -2)
            )[0].lessons
            bookmarkLesson = lessonListOfBookmarkStudySet.filter(
               lesson => lesson.id === bookmarkString.slice(-6, -2).concat('01')
            )
         }

         //normal case
      } else {
         //get the lesson AFTER the last completed lesson 
         bookmarkLesson = lessonListOfBookmarkStudySet.filter(
            lesson => lesson.id === '0'.concat((parseInt(bookmarkString) + 1).toString())
         )
      }
      return (bookmarkLesson[0].subtitle + ' ' + bookmarkLesson[0].title)
   }

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////
   var deleteButton;
   if (props.isEditing && props.activeGroup != props.name) {
      deleteButton =
         <TouchableOpacity
            style={styles.minusButtonContainer}
            onPress={() => props.deleteGroup(props.name)}
         >
            <MaterialCommunityIcons name='minus-circle' size={24} color="#FF0800" />
         </TouchableOpacity>
   } else if (props.isEditing && props.activeGroup === props.name) {
      deleteButton =
         <View
            style={styles.minusButtonContainer}
            onPress={() => props.deleteGroup(props.name)}
         >
            <MaterialCommunityIcons name='minus-circle' size={24} color="#DEE3E9" />
         </View>
   }

   var rightButton;
   if (props.isEditing) {
      rightButton =
         <View
            style={styles.iconContainer}
            onPress={() => { }}
         >
            <Ionicons
               name={props.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
               size={36}
               color="gray"
            />
         </View>
   } else if (props.activeGroup === props.name) {
      rightButton =
         <View style={styles.iconContainer}>
            <Ionicons
               name="md-checkmark"
               size={24}
               color="black"
            />
         </View>
   } else {
      rightButton = null;
   }

   return (
      <View style={[styles.groupListItemContainer, { direction: props.isRTL ? "rtl" : "ltr" }]}>
      {deleteButton}
      <TouchableOpacity
         style={[styles.touchableContainer, { direction: props.isRTL ? "rtl" : "ltr" }]}
         onPress={props.isEditing ? () => props.goToEditGroupScreen(props.name) : () => { props.changeActiveGroup(props.name) }}
      >
         <View style={styles.iconContainer}>
            <MaterialIcons name='group' size={49} />
         </View>
         <View style={styles.groupNameContainer}>
            <Text style={styles.groupNameText}>{props.name}</Text>
            <Text style={styles.checkpointText}>{getBookmarkText()}</Text>
         </View>
         {rightButton}
      </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   groupListItemContainer: {
      height: 80 * scaleMultiplier,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      margin: 3
   },
   touchableContainer: {
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
   },
   iconContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 15,
      height: "100%",
   },
   minusButtonContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
      marginRight: -5,
      height: "100%"
   },
   groupNameContainer: {
      flex: 1,
      height: "100%",
      justifyContent: "center",
      flexWrap: 'nowrap'
   },
   groupNameText: {
      color: "#3A3C3F",
      fontSize: 18,
      fontFamily: 'bold'
   },
   checkpointText: {
      fontFamily: 'regular',
      fontSize: 12,
      color: '#9FA5AD'
   }
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      currentProgress: activeGroup.progress,
      isRTL: state.database[activeGroup.language].isRTL,
      groups: state.groups,
      activeGroup: state.activeGroup,
      currentDatabase: state.database[activeGroup.language]
   }
};

function mapDispatchToProps(dispatch) {
   return {
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      changeActiveGroup: name => { dispatch(changeActiveGroup(name)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListItem);