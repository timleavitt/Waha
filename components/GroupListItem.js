//imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { deleteGroup, changeActiveGroup } from '../redux/actions/groupsActions'
import { scaleMultiplier } from '../constants'
import AvatarImage from '../components/AvatarImage'

function GroupListItem(props) {
   function getBookmarkText() {
      // var thisGroup = props.groups.filter(item => item.name === props.name)[0]
      // var thisGroupDatabase = props.database[thisGroup.language]
      // var bookmarkInt = 0;
      // var thisGroupProgress = props.groups.filter(item => item.name === props.name)[0].progress

      // //if a group has no progress, return the first lesson in the first study set
      // if (thisGroupProgress.length === 0) {
      //    var firstLesson = thisGroupDatabase.studySets[0].lessons[0]
      //    return (firstLesson.subtitle + ' ' + firstLesson.title)
      // }
      // thisGroupProgress.map(lessonID => {
      //    if (parseInt(lessonID.slice(-4)) > bookmarkInt)
      //       bookmarkInt = parseInt(lessonID.slice(-4))
      //    return null;
      // })

      // //string of the id of the last completed lesson 
      // var bookmarkString = bookmarkInt.toString();
      // var extraZero = ''
      // if (bookmarkString.length < 4)
      //    extraZero = '0'
      // bookmarkString = extraZero + bookmarkString

      // var lessonListOfBookmarkStudySet = thisGroupDatabase.studySets.filter(
      //    studySet => (studySet.id).slice(2, 4) === bookmarkString.slice(0, 2)
      // )[0].lessons

      // //edge case: the last completed lesson is the last in a study set
      // if (parseInt(bookmarkString.slice(-2)) === lessonListOfBookmarkStudySet.length) {
      //    //edge case: the last completed lesson is the last available lesson in any study set
      //    if (parseInt(bookmarkString.slice(0, 2)) === thisGroupDatabase.studySets.length) {
      //       return ('Contact us for more study sets!')
      //    } else {
      //       bookmarkString = (extraZero + (parseInt(bookmarkString.slice(0, 2)) + 1)).toString().concat(bookmarkString.slice(-2))
      //       lessonListOfBookmarkStudySet = thisGroupDatabase.studySets.filter(
      //          studySet => (studySet.id).slice(2, 4) === bookmarkString.slice(0, 2)
      //       )[0].lessons
      //       bookmarkLesson = lessonListOfBookmarkStudySet.filter(
      //          lesson => lesson.id === (lesson.id).slice(0, 2).concat(bookmarkString.slice(0, 2), '01')
      //       )
      //    }

      //    //normal case
      // } else {
      //    //get the lesson AFTER the last completed lesson 
      //    bookmarkLesson = lessonListOfBookmarkStudySet.filter(
      //       lesson => lesson.id === (lesson.id).slice(0, 2).concat(extraZero, (parseInt(bookmarkString) + 1).toString())
      //    )
      // }
      // return (bookmarkLesson[0].subtitle + ' ' + bookmarkLesson[0].title)
      return 'dummy text'
   }

   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////
   var deleteButton;
   if (props.isEditing && props.activeGroup != props.name) {
      deleteButton =
         <TouchableOpacity
            style={[styles.minusButtonContainer, { marginLeft: props.isRTL ? -5 : 10, marginRight: props.isRTL ? 10 : -5,}]}
            onPress={() => props.deleteGroup(props.name)}
         >
            <Icon name='minus-filled' size={24 * scaleMultiplier} color="#FF0800" />
         </TouchableOpacity>
   } else if (props.isEditing && props.activeGroup === props.name) {
      deleteButton =
         <View style={[styles.minusButtonContainer, { marginLeft: props.isRTL ? -5 : 10, marginRight: props.isRTL ? 10 : -5,}]}>
            <Icon
               name="check"
               size={24 * scaleMultiplier}
               color="#2D9CDB"
            />
         </View>
   }

   var rightButton;
   if (props.isEditing) {
      rightButton =
         <View
            style={styles.iconContainer}
            onPress={() => { }}
         >
            <Icon
               name={props.isRTL ? 'arrow-left' : 'arrow-right'}
               size={36 * scaleMultiplier}
               color="gray"
            />
         </View>
   } else if (props.activeGroup === props.name) {
      rightButton =
         <View style={styles.iconContainer}>
            <Icon
               name="check"
               size={24 * scaleMultiplier}
               color="#2D9CDB"
            />
         </View>
   } else {
      rightButton = null;
   }

   return (
      <View style={[styles.groupListItemContainer, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}>
      {deleteButton}
      <TouchableOpacity
         style={[styles.touchableContainer, { flexDirection: props.isRTL ? "row-reverse" : "row" }]}
         onPress={props.isEditing ? () => props.goToEditGroupScreen(props.name) : () => { props.changeActiveGroup(props.name) }}
      >
         <AvatarImage size={50 * scaleMultiplier} onPress={() => {}} source={props.avatarSource} isActive={props.activeGroup === props.name}/>
         <View style={styles.groupNameContainer}>
            <Text style={[styles.groupNameText, {textAlign: props.isRTL ? 'right' :'left'}]}>{props.name}</Text>
            <Text style={[styles.checkpointText, {textAlign: props.isRTL ? 'right' :'left'}]}>{getBookmarkText()}</Text>
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
      margin: 2
   },
   touchableContainer: {
      flex: 1,
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
      height: "100%",
      width: 30
   },
   groupNameContainer: {
      flex: 1,
      height: "100%",
      justifyContent: "center",
      flexWrap: 'nowrap'
   },
   groupNameText: {
      color: "#3A3C3F",
      fontSize: 18 * scaleMultiplier,
      fontFamily: 'bold',
      textAlign: "left"
   },
   checkpointText: {
      fontFamily: 'regular',
      fontSize: 12 * scaleMultiplier,
      color: '#9FA5AD',
      textAlign: "left"
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
      database: state.database
   }
};

function mapDispatchToProps(dispatch) {
   return {
      deleteGroup: name => { dispatch(deleteGroup(name)) },
      changeActiveGroup: name => { dispatch(changeActiveGroup(name)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListItem);