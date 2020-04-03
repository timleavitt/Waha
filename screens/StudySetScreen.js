//basic imports
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import i18n from 'i18n-js';
import { scaleMultiplier } from '../constants'

//other component imports
import StudySetItem from '../components/StudySetItem';

//redux
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { setFirstOpen } from '../redux/actions/databaseActions'
import HeaderButtons from '../components/HeaderButtons';
import { fromRight, fromLeft } from 'react-navigation-transitions';

function StudySetScreen(props) {
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [])

   function getNavOptions() {
      return {
         headerRight: props.isRTL ?
            () =>
               <HeaderButtons
                  name='ios-people'
                  onPress1={() => props.navigation.toggleDrawer()}
                  hasCompleteButton={false}
               /> : null,
         headerLeft: props.isRTL ? null : () =>
            <HeaderButtons
               name='ios-people'
               onPress1={() => props.navigation.toggleDrawer()}
               hasCompleteButton={false}
            />,
      }
   }

   FileSystem.getFreeDiskStorageAsync().then(freeDiskStorage => {
      //console.log(freeDiskStorage)
   });

   FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
      //console.log(contents)
   });

   //function to navigate to the lesson list screen
   //props.navigation.navigate takes us to lessonlist screen
   //params is the information we want to pass to lessonlist screen
   function navigateToLessonList(item) {
      props.navigation.navigate('LessonList', {
         title: item.title,
         studySetID: item.id,
         subtitle: item.subtitle,
         iconName: item.iconName,
         isRTL: props.isRTL
      }
      )
   }


   ////////////////////////////////
   ////RENDER/STYLES/NAVOPTIONS////
   ////////////////////////////////


   //function to render the studyset items
   //includes onSelect which navigates to the appropriate lesson list screen
   function renderStudySetItem(studySetList) {
      return (
         <StudySetItem
            title={studySetList.item.title}
            subtitle={studySetList.item.subtitle}
            onStudySetSelect={() => navigateToLessonList(studySetList.item)}
            id={studySetList.item.id}
            iconName={studySetList.item.iconName}
         />
      )
   }

   return (
      <View style={styles.screen}>
         <FlatList
            data={props.database[props.database.currentLanguage].studySets}
            renderItem={renderStudySetItem}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "#EAEEF0"
   },
   text: {
      textAlign: "center",
      margin: 40
   },
   headerButtonsContainer: {
      flexDirection: "row",
      width: 80
   },
   headerButton: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1
   },
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})

/////////////
////REDUX////
/////////////

function mapStateToProps(state) {
   return {
      database: state.database,
      colors: state.database[state.database.currentLanguage].colors,
      isRTL: state.database[state.database.currentLanguage].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);