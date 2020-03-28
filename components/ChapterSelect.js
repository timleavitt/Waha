//basic imports
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { AnimatedCircularProgress } from 'react-native-circular-progress';

function ChapterSelect(props) {

   //CHAPTE 2 BUTTON ICON
   var chapter2IconName;

   if (props.activeChapter === 'fellowship') {
      chapter2IconName = 'numeric-2-box'
   } else if (props.activeChapter === 'passage') {
      chapter2IconName = 'numeric-2-box'
   } else {
      chapter2IconName = 'checkbox-marked'
   }

   var chapter2Button;   

   //CHAPTER 2 BUTTON
   if (props.lessonID in props.downloads) {
      chapter2Button =
         <View style={{ ...styles.chapterSelect, flexDirection: "row", borderColor: props.colors.grayedOut }}>
            <AnimatedCircularProgress
               size={20}
               width={4}
               fill={(props.downloads[props.lessonID] * 100)}
               tintColor={props.colors.grayedOut}
               rotation={0}
               backgroundColor="white"
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: props.colors.grayedOut } }}>Passage</Text>
         </View>
   } else {
      chapter2Button =
      <TouchableOpacity 
         style={{ ...styles.chapterSelect, ...{ 
            borderColor: props.colors.accentColor,
            backgroundColor: (props.activeChapter === 'passage') ? props.colors.accentColor : "#EFF2F4"},
         }} 
         onPress={() => props.onPress('passage')}
      >
         <MaterialCommunityIcons
            name={chapter2IconName}
            size={25}
            color={(props.activeChapter === 'passage') ? "white" : props.colors.accentColor}
         />
         <Text style={{ ...styles.chapterSelectText, ...{ color: (props.activeChapter === 'passage') ? "white" : props.colors.accentColor } }}>Passage</Text>
      </TouchableOpacity>
   }


   return (
      <View style={styles.chapterSelectContainer}>
         <TouchableOpacity 
            style={{ ...styles.chapterSelect, ...{ 
               borderColor: props.colors.accentColor,
               backgroundColor: (props.activeChapter === 'fellowship') ? props.colors.accentColor : "#EFF2F4"},
            }} 
            onPress={() => props.onPress('fellowship')}
         >
            <MaterialCommunityIcons
               name={(props.activeChapter === 'fellowship') ? "numeric-1-box" : "checkbox-marked"}
               size={25}
               color={(props.activeChapter === 'fellowship') ? "white" : props.colors.accentColor}
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: (props.activeChapter === 'fellowship') ? "white" : props.colors.accentColor } }}>Fellowship</Text>
         </TouchableOpacity>
         {chapter2Button}
         <TouchableOpacity 
            style={{ ...styles.chapterSelect, ...{ 
               borderColor: props.colors.accentColor , 
               backgroundColor: (props.activeChapter === 'application') ? props.colors.accentColor : "#EFF2F4"}, 
            }} 
            onPress={() => props.onPress('application')}
         >
            <MaterialCommunityIcons
               name="numeric-3-box"
               size={25}
               color={(props.activeChapter === 'application') ? "white" : props.colors.accentColor}
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: (props.activeChapter === 'application') ? "white" : props.colors.accentColor } }}>Fellowship</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   chapterSelectContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   chapterSelect: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      justifyContent: "center",
      borderWidth: 2
   },
   chapterSelectText: {
      fontFamily: 'black',
      fontSize: 16
   },
})

function mapStateToProps(state) {
   //console.log(state.downloads)
   return {
      colors: state.database[state.database.currentLanguage].colors,
      downloads: state.downloads,
   }
};

export default connect(mapStateToProps)(ChapterSelect);
