//basic imports
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'

function StudySetItemSmall(props) {

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
      <View style={[styles.studySetItem, {direction: props.isRTL ? "rtl" : "ltr"}]}>
         <View style={{ flexDirection: "row" }}>
            <View style={styles.progressImage}>
               <AnimatedCircularProgress
                  size={65 * scaleMultiplier}
                  width={5 * scaleMultiplier}
                  fill={(numCompleted / numLessons) * 100}
                  tintColor={fullyCompleted ? "#828282" : "#1D1E20"}
                  rotation={0}
                  backgroundColor="#FFFFFF"
               >
                  {(fill) => (<View style={{backgroundColor: chooseAccentColor(), width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}><MaterialCommunityIcons name={props.iconName} size={40 * scaleMultiplier} color={fullyCompleted ? "#828282" : "#1D1E20"} /></View>)}
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
      height: 90 * scaleMultiplier,
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
      fontSize: 24 * scaleMultiplier,
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'black',
      textAlign: "left"
   },
   subtitle: {
      fontSize: 14 * scaleMultiplier, 
      textAlignVertical: "center",
      flexWrap: "wrap",
      fontFamily: 'light',
      textAlign: "left"
   },
})


function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      progress: state.appProgress,
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL
   }
};

export default connect(mapStateToProps)(StudySetItemSmall);