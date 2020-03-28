//basic imports
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import i18n from 'i18n-js';
import { Ionicons } from '@expo/vector-icons';


//other component imports
import StudySetItem from '../components/StudySetItem';
import FlatListSeparator from '../components/FlatListSeparator'

//redux
import { connect } from 'react-redux'
import { addLanguage, changeLanguage } from '../redux/actions/databaseActions'
import { setFirstOpen } from '../redux/actions/databaseActions'
import { Header } from 'react-native/Libraries/NewAppScreen';
import HeaderButtons from '../components/HeaderButtons';

function StudySetScreen(props) {


   //check if we're on first launch (maybe get better solution later;
   //this does an async operation every time this screen opens)
   useEffect(() => {
      if (props.isFirstOpen) {
         props.navigation.replace("LanguageSelect")
      }
   }, [])

   useEffect(() => {
      if (!props.isFirstOpen && !props.isFetching) {
         props.navigation.setParams({ primaryColor: props.colors.primaryColor })
      }
   }, [props.isFirstOpen])




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
      props.navigation.navigate({
         routeName: "LessonList",
         params: {
            title: item.title,
            studySetID: item.id,
            subtitle: item.subtitle,
            iconName: item.iconName
         }
      })
   }

   i18n.translations = {
      en: {
         loadingMessage: "Hang on, we're setting things up..."
      },
      es: {
         loadingMessage: "Espera, estamos preparando las cosas..."
      }
   };



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


   //if we're not fetching data, render the flatlist. if we are, render a loading screen
   if (!props.isFetching) {
      return (
         <View style={{ ...styles.screen, ...{ backgroundColor: props.colors.lessonSetScreenBG } }}>
            <FlatList
               data={props.database[props.database.currentLanguage].studySets}
               renderItem={renderStudySetItem}
            />
         </View>
      )
   } else {
      return (
         <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ textAlign: "center", fontSize: 30, marginVertical: 20 }}>{i18n.t('loadingMessage')}</Text>
            <ActivityIndicator size="large" color="black" />
         </View>
      )
   }
}

StudySetScreen.navigationOptions = navigationData => {
   const primaryColor = navigationData.navigation.getParam("primaryColor");

   return {
      headerTitle: "waha",
      headerBackTitle: "Back",
      headerStyle: {
         backgroundColor: primaryColor
      },
      headerTitleStyle: {
         color: "#fff",
         fontFamily: 'bold'
      },
      headerRight: () =>
         <HeaderButtons
            name='md-settings'
            onPress1={() => navigationData.navigation.navigate("Settings")}
            hasCompleteButton={false}
         />
   };
};

const styles = StyleSheet.create({
   screen: {
      flex: 1,
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
   }
})

/////////////
////REDUX////
/////////////

function mapStateToProps(state) {
   if (!state.database.isFetching)
      return {
         database: state.database,
         colors: state.database[state.database.currentLanguage].colors,
         appProgress: state.appProgress
      }
   else {
      return {
         isFetching: state.database.isFetching,
         isFirstOpen: state.database.isFirstOpen
      }
   }
};

function mapDispatchToProps(dispatch) {
   return {
      addLanguage: language => dispatch(addLanguage(language)),
      changeLanguage: language => dispatch(changeLanguage(language)),
      setFirstOpen: toSet => dispatch(setFirstOpen(toSet))
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);