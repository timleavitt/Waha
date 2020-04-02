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


   //check if we're on first launch (maybe get better solution later;
   //this does an async operation every time this screen opens)
   useEffect(() => {
      if (props.isFirstOpen) {
         props.navigation.replace("LanguageSelect")
      }
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

   useEffect(() => {
      if (!props.isFirstOpen && !props.isFetching) {
         //props.navigation.setParams({ primaryColor: props.colors.primaryColor, isRTL: props.isRTL })
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
      props.navigation.navigate('LessonList', {
         title: item.title,
         studySetID: item.id,
         subtitle: item.subtitle,
         iconName: item.iconName,
         isRTL: props.isRTL
      }
      )
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
         <View style={styles.screen}>
            <FlatList
               data={props.database[props.database.currentLanguage].studySets}
               renderItem={renderStudySetItem}
            />
         </View>
      )
   } else {
      return (
         <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ textAlign: "center", fontSize: 30, padding: 10, fontFamily: "medium" }}>{i18n.t('loadingMessage')}</Text>
            <ActivityIndicator size="large" color="black" />
         </View>
      )
   }
}

StudySetScreen.navigationOptions = navigationData => {
   const isRTL = navigationData.navigation.getParam("isRTL");

   return {

      // gestureDirection: isRTL ? 'horizontal-inverted' : 'horizontal',
      // transitionSpec: {
      //    open: () => fromRight(),
      //    close: () => fromRight(),
      // }
   };
};

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
   if (!state.database.isFetching)
      return {
         database: state.database,
         colors: state.database[state.database.currentLanguage].colors,
         appProgress: state.appProgress,
         isRTL: state.database[state.database.currentLanguage].isRTL,
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