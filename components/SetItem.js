import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { scaleMultiplier, setImages } from '../constants'
import Icon from '../assets/fonts/icons'

function SetItem(props) {

   //// STATE

   // keeps track of the number of completed lessons in this set
   const [numCompleted, setNumCompleted] = useState(0)

   // keeps track of the number of total lessons in a set
   const [numLessons, setNumLessons] = useState(1)

   // keeps track of whether the set is fully completed or not
   const [fullyCompleted, setFullyCompleted] = useState(false)

   //// CONSTRUCTOR

   useEffect(() => {
      for (const set of props.database.sets) {
         if (set.id === props.id) {
            setNumLessons(set.length)
         }
      }
   }, [props.progress])

   //// FUNCTIONS

   // changes a set as completed 
   useEffect(() => {
      if (numCompleted === numLessons) {
         setFullyCompleted(true)
      } else {
         setFullyCompleted(false)
      }
   }, [numCompleted])

   //// RENDER

   // render the percentage text conditionally as we don't need it for the small set items
   // note: small item appears on lesson list screen
   var percentageText = props.isSmall ? null :
      <View style={styles.percentageTextContainer}>
         <Text style={styles.percentageText}>{Math.round((numCompleted / numLessons) * 100)}%</Text>
      </View>

   // render the triangle icon conditionally as we don't need it for small set items
   var triangleIcon = props.isSmall ? null :
      <View style={styles.iconContainer}>
         <Icon
            name={props.isRTL ? 'triangle-left' : 'triangle-right'}
            size={37 * scaleMultiplier}
            color="#828282"
         />
      </View>

   return (
      <TouchableOpacity style={[styles.studySetItem, { flexDirection: props.isRTL ? "row-reverse" : "row" }]} onPress={props.onSetSelect}>
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
                  <View style={{ backgroundColor: props.color, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                     <MaterialCommunityIcons name={setImages[props.index]} size={props.isSmall ? 40 * scaleMultiplier : 50 * scaleMultiplier} color={fullyCompleted ? "#828282" : "#1D1E20"} />
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

//// STYLES

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
   iconContainer: {
      justifyContent: "center",
      marginRight: 15
   }
})

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   console.log(activeGroup.progress)
   return {
      progress: activeGroup.progress,
      isRTL: state.database[activeGroup.language].isRTL,
      database: state.database[activeGroup.language]
   }
};

export default connect(mapStateToProps)(SetItem);