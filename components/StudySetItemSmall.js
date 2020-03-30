//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux'

function StudySetItemSmall(props) {

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
      <View style={styles.studySetItem}>
         <View style={{ flexDirection: "row" }}>
            <View style={styles.progressImage}>
               <AnimatedCircularProgress
                  size={65}
                  width={5}
                  fill={(numCompleted / numLessons) * 100}
                  tintColor={fullyCompleted ? props.grayedOut : props.primaryColor}
                  rotation={0}
                  backgroundColor="#fff"
               >
                  {(fill) => (<MaterialCommunityIcons name={props.iconName} size={40} color={fullyCompleted ? props.grayedOut : props.primaryColor} />)}
               </AnimatedCircularProgress>
            </View>
            <View style={styles.titleContainer}>
               <Text style={{ ...styles.subtitle, ...{ color: fullyCompleted ? props.grayedOut : "black" } }}>{props.subtitle}</Text>
               <Text style={{ ...styles.title, ...{ color: fullyCompleted ? props.grayedOut : "black" } }}>{props.title}</Text>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   studySetItem: {
      flex: 1,
      height: 75,
      margin: 5,
      justifyContent: "center"
   },
   progressImage: {
      margin: 5
   },
   titleContainer: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      marginLeft: 10,
      marginRight: 5
   },
   title: {
      fontSize: 14,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'medium'
   },
   subtitle: {
      fontSize: 10,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'light'
   },
})


function mapStateToProps(state) {

   return {
      progress: state.appProgress,
      primaryColor: state.database[state.database.currentLanguage].colors.primaryColor,
      grayedOut: state.database[state.database.currentLanguage].colors.grayedOut,
   }
};

export default connect(mapStateToProps)(StudySetItemSmall);