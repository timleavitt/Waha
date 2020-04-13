//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import Icon from '../assets/fonts/icons'

function StudySetItem(props) {

   function chooseAccentColor() {

      value = parseInt(props.id.substr(2, 4)) % 4

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
   const [numLessons, setNumLessons] = useState(1)

   useEffect(() => {

      for (const studySet of props.database.studySets) {
         if (studySet.id === props.id) {
            setNumLessons(studySet.lessons.length)
         }
      }
      var localNumCompleted = 0
      for (const lesson of props.progress) {
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

   var percentageText = props.isSmall ? null :
      <View style={styles.percentageTextContainer}>
         <Text style={styles.percentageText}>{Math.round((numCompleted / numLessons) * 100)}%</Text>
      </View>

   var triangleIcon = props.isSmall ? null :
      <View style={styles.iconContainer}>
         <Icon
            name={props.isRTL ? 'triangle-left' : 'triangle-right'}
            size={37 * scaleMultiplier}
            color="#828282"
         />
      </View>


   return (
      <TouchableOpacity style={[styles.studySetItem, { flexDirection: props.isRTL ? "row-reverse" : "row" }]} onPress={props.onStudySetSelect}>
         <View style={styles.progressContainer}>
            <AnimatedCircularProgress
               size={props.isSmall ? 70 * scaleMultiplier : 85 * scaleMultiplier}
               width={props.isSmall ? 5 * scaleMultiplier : 8 * scaleMultiplier}
               fill={(numCompleted / numLessons) * 100}
               tintColor={fullyCompleted ? "#828282" : "#1D1E20"}
               rotation={0}
               backgroundColor="#FFFFFF"
            >
               {(fill) => (
                  <View style={{ backgroundColor: chooseAccentColor(), width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                     <MaterialCommunityIcons name={props.iconName} size={props.isSmall ? 40 * scaleMultiplier : 50 * scaleMultiplier} color={fullyCompleted ? "#828282" : "#1D1E20"} />
                  </View>)}
            </AnimatedCircularProgress>
            {percentageText}
         </View>
         <View style={styles.titleContainer}>
            <Text style={{
               color: fullyCompleted ? "#9FA5AD" : "black", 
               textAlign: props.isRTL ? 'right' : 'left',
               fontSize: props.isSmall ? 14 * scaleMultiplier : 12 * scaleMultiplier,
               textAlignVertical: "center",
               flexWrap: "wrap",
               fontFamily: 'light',
            }}>{props.subtitle}</Text>
            <Text style={{
               color: fullyCompleted ? "#9FA5AD" : "black",
               textAlign: props.isRTL ? 'right' : 'left',
               fontSize: props.isSmall ? 24 * scaleMultiplier : 18 * scaleMultiplier,
               textAlignVertical: "center",
               flexWrap: "wrap",
               fontFamily: props.isSmall ? 'black' : 'bold',
            }}>{props.title}</Text>
         </View>
         {triangleIcon}
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

   },
   subtitle: {
 
   },
   iconContainer: {
      justifyContent: "center",
      marginRight: 15
   }
})


function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      progress: activeGroup.progress,
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      database: state.database[activeGroup.language]
   }
};

export default connect(mapStateToProps)(StudySetItem);