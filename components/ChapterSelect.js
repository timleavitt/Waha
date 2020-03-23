//basic imports
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux'

function ChapterSelect(props) {

   //CHAPTE 2 BUTTON ICON
   var chapter2IconName;

   if (props.activeChapter === 'fellowship') {
      chapter2IconName = 'numeric-2'
   } else if (props.activeChapter === 'passage') {
      chapter2IconName = 'numeric-2-box'
   } else {
      chapter2IconName = 'checkbox-marked'
   }

   var chapter2Button;   

   //CHAPTER 2 BUTTON
   if (props.id in props.downloads) {
      chapter2Button =
         <View style={{ ...styles.chapterSelect, flexDirection: "row", borderColor: props.colors.grayedOut }}>
            <AnimatedCircularProgress
               size={20}
               width={4}
               fill={(props.downloads[props.id] * 100)}
               tintColor={props.colors.grayedOut}
               rotation={0}
               backgroundColor="white"
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: props.colors.grayedOut } }}>Passage</Text>
         </View>
   } else {
      chapter2Button =
         <TouchableOpacity 
            style={{ ...styles.chapterSelect, ...{ borderColor: props.colors.accentColor } }} 
            onPress={() => props.onPress('passage')}
         >
            <MaterialCommunityIcons
               name={chapter2IconName}
               size={30}
               color={props.colors.accentColor}
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: props.colors.accentColor } }}>Passage</Text>
         </TouchableOpacity>
   }


   return (
      <View style={styles.chapterSelectContainer}>
         <TouchableOpacity style={{ ...styles.chapterSelect, ...{ borderColor: props.colors.accentColor } }} onPress={() => props.onPress('fellowship')}>
            <MaterialCommunityIcons
               name={(props.activeChapter === 'fellowship') ? "numeric-1-box" : "checkbox-marked"}
               size={30}
               color={props.colors.accentColor}
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: props.colors.accentColor } }}>Fellowship</Text>
         </TouchableOpacity>
         {chapter2Button}
         <TouchableOpacity style={{ ...styles.chapterSelect, ...{ borderColor: props.colors.accentColor } }} onPress={() => props.onPress('application')}>
            <MaterialCommunityIcons
               name={(props.activeChapter === 'application') ? "numeric-3-box" : "numeric-3"}
               size={30}
               color={props.colors.accentColor}
            />
            <Text style={{ ...styles.chapterSelectText, ...{ color: props.colors.accentColor } }}>Application</Text>
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
      borderTopWidth: 2,
      borderBottomWidth: 2
   },
   chapterSelectText: {
      fontFamily: 'open-sans-regular',
      fontSize: 16
   },
})

function mapStateToProps(state) {
   //console.log(state.downloads)
   return {
      colors: state.database[state.database.currentLanguage].colors
   }
};

export default connect(mapStateToProps)(ChapterSelect);
