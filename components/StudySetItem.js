//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { scaleMultiplier} from '../constants'

function StudySetItem(props) {

   function chooseAccentColor() {

      value = parseInt(props.id.substr(2,4)) % 4

      if (value === 1) {
         return props.colors.primaryColor
      } else if (value === 2) {
         return props.colors.accentColor1
      } else if (value === 3) {
         return props.colors.accentColor3
      } else { 
         return props.colors.accentColor4
      }
   }

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
      <TouchableOpacity style={[styles.studySetItem, {direction: props.isRTL ? "rtl" : "ltr"}]} onPress={props.onStudySetSelect}>
            <View style={styles.progressContainer}>
               <AnimatedCircularProgress
                  size={85 * scaleMultiplier}
                  width={8 * scaleMultiplier}
                  fill={(numCompleted / numLessons) * 100}
                  tintColor={fullyCompleted ? "#828282" : "#1D1E20"}
                  rotation={0}
                  backgroundColor="#FFFFFF"
               >
                  {(fill) => (<View style={{backgroundColor: chooseAccentColor(), width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}><MaterialCommunityIcons name={props.iconName} size={50 * scaleMultiplier} color={fullyCompleted ? "#828282" : "#1D1E20"} /></View>)}
               </AnimatedCircularProgress>
               <View style={styles.percentageTextContainer}>
                  <Text style={styles.percentageText}>{Math.round((numCompleted / numLessons) * 100)}%</Text>
               </View>
            </View>
            <View style={styles.titleContainer}>
               <Text style={[styles.subtitle, { color: fullyCompleted ? "#9FA5AD" : "black" }]}>{props.subtitle}</Text>
               <Text style={[styles.title, { color: fullyCompleted ? "#9FA5AD" : "black" }]}>{props.title}</Text>
            </View>
            <View style={styles.iconContainer}>
               <Entypo
                  name= {props.isRTL ? 'triangle-left' : 'triangle-right'}
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
      height: 128 * scaleMultiplier,
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
      fontSize: 18 * scaleMultiplier,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'bold',
      textAlign: "left"
   },
   subtitle: {
      fontSize: 12 * scaleMultiplier,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'light',
      textAlign: "left"
   },
   iconContainer: {
      justifyContent: "center",
      marginRight: 15
   }
})


function mapStateToProps(state) {
   return {
      progress: state.appProgress,
      colors: state.database[state.database.currentLanguage].colors,
      isRTL: state.database[state.database.currentLanguage].isRTL
   }
};

export default connect(mapStateToProps)(StudySetItem);