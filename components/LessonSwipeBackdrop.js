import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function LessonSwipeBackdrop(props) {

   //// RENDER

   // render complete button conditionally since it could be complete or incomplete
   var completeButton = props.isComplete ?
      <TouchableOpacity 
         style={[styles.buttonContainer, { backgroundColor: "#82868D" }]}
         onPress={props.toggleComplete}
      >
         <View style={styles.iconContainer}>
            <Icon name='cancel' size={20} color="#FFFFFF" />
         </View>

      </TouchableOpacity> :
      <TouchableOpacity 
         style={[styles.buttonContainer, { backgroundColor: "#60C239", alignItems: props.isRTL ? "flex-end" : "flex-start" }]}
         onPress={props.toggleComplete}
      >
         <View style={styles.iconContainer}>
            <Icon name='check-filled' size={20} color="#FFFFFF" />
         </View>
      </TouchableOpacity>

   return (
      <View style={[styles.lessonSwipeBackdropContainer, { flexDirection: props.isRLT ? "row-reverse" : "row" }]}>
         {completeButton}
         <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: "#2D9CDB", alignItems: props.isRLT ? "flex-start" : "flex-end" }]}>
            <View style={styles.iconContainer}>
               <Icon name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'} size={20} color="#FFFFFF" />
            </View>
         </TouchableOpacity>
      </View>
   )
}

//// STYLES

const styles = StyleSheet.create({
   lessonSwipeBackdropContainer: {
      width: "100%",
      flex: 1
   },
   buttonContainer: {
      flex: 1,
      justifyContent: 'center',
   },
   iconContainer: {
      width: 50 * scaleMultiplier,
      justifyContent: "center",
      alignItems: 'center',
   },
   label: {
      color: "#FFFFFF",
      fontFamily: 'regular',
      fontSize: 10 * scaleMultiplier,
      margin: 2
   }
})

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0];
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

export default connect(mapStateToProps)(LessonSwipeBackdrop);