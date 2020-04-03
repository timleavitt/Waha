//basic imports
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

//other component imports
import StudySetItem from '../components/StudySetItem';

//redux
import { connect } from 'react-redux'
import HeaderButtons from '../components/HeaderButtons';

function StudySetScreen(props) {
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [])

   function getNavOptions() {
      return {
         headerLeft: () =>
            <HeaderButtons
               name='ios-people'
               onPress1={() => props.navigation.toggleDrawer()}
               hasCompleteButton={false}
            />,
         //gestureDirection: props.isRTL ? 'horizontal-inverted' : 'horizontal'
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
            data={props.studySets}
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
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      database: state.database[activeGroup.language],
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      studySets: state.database[activeGroup.language].studySets
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);