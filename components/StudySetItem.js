//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux'

function StudySetItem(props) {

   const [numCompleted, setNumCompleted] = useState(0)
   const [fullyCompleted, setFullyCompleted] = useState(false)

   var numLessons = 13

   useEffect(() => {
      var localNumCompleted = 0
      for (lesson in props.progress) {
         if (lesson.startsWith(props.id)) {
            localNumCompleted += 1
         }
      }
      setNumCompleted(localNumCompleted)
   }, [props.progress])

   useEffect(() => {
      if (numCompleted === numLessons) {
         setFullyCompleted(true)
      } else {
         setFullyCompleted(false)
      }
   }, [numCompleted])


   return (
      <TouchableOpacity style={styles.studySetItem} onPress={props.onStudySetSelect}>
            <View style={styles.progressContainer}>
               <AnimatedCircularProgress
                  size={85}
                  width={8}
                  fill={(numCompleted / numLessons) * 100}
                  tintColor={fullyCompleted ? props.grayedOut : props.primaryColor}
                  rotation={0}
                  backgroundColor="#fff"
               >
                  {(fill) => (<MaterialCommunityIcons name={props.iconName} size={50} color={fullyCompleted ? props.grayedOut : props.primaryColor} />)}
               </AnimatedCircularProgress>
               <View style={styles.percentageTextContainer}>
                  <Text style={styles.percentageText}>{Math.round((numCompleted / numLessons) * 100)}%</Text>
               </View>
            </View>
            <View style={styles.titleContainer}>
               <Text style={{ ...styles.subtitle, ...{ color: fullyCompleted ? props.grayedOut : "black" } }}>{props.subtitle}</Text>
               <Text style={{ ...styles.title, ...{ color: fullyCompleted ? props.grayedOut : "black" } }}>{props.title}</Text>
            </View>
            <View style={styles.iconContainer}>
               <Entypo
                  name='triangle-right'
                  size={40}
                  color="gray"
               />
            </View>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   studySetItem: {
      flexDirection: "row",
      flex: 1,
      height: 128,
      margin: 5,
      justifyContent: "center"
   },
   progressContainer: {
      flexDirection: "column",
      justifyContent: "center",
      margin: 5
   },
   percentageTextContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 5
   },
   percentageText: {
      fontFamily: 'light',
      color: "#9FA5AD",
      fontSize: 10
   },
   titleContainer: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      marginLeft: 10,
      marginRight: 5
   },
   title: {
      fontSize: 18,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'bold'
   },
   subtitle: {
      fontSize: 12,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'light'
   },
   iconContainer: {
      justifyContent: "center",
      marginRight: 15
   }
})


function mapStateToProps(state) {

   return {
      progress: state.appProgress,
      primaryColor: state.database[state.database.currentLanguage].colors.primaryColor,
      grayedOut: state.database[state.database.currentLanguage].colors.grayedOut,
   }
};

export default connect(mapStateToProps)(StudySetItem);