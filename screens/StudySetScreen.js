//basic imports
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

//other component imports
import StudySetItem from '../components/StudySetItem';
import AvatarImage from '../components/AvatarImage'

//redux
import { connect } from 'react-redux'
import { headerImages } from '../constants'

function StudySetScreen(props) {
   useEffect(() => {
      props.navigation.setOptions(getNavOptions())
   }, [props])

   function getNavOptions() {
      return {
         headerTitle: () => <Image style={styles.headerImage} source={headerImages[props.activeGroupLanguage]} />,
         headerLeft: props.isRTL ?
            () => <View></View> :
            () =>
               <AvatarImage
                  source={props.activeGroupImageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
               />,
         headerRight: props.isRTL ?
            () =>
               <AvatarImage
                  source={props.activeGroupImageSource}
                  size={40}
                  onPress={() => props.navigation.toggleDrawer()}
                  isActive={true}
               /> :
            () => <View></View>
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
   //console.log(state.groups)
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      database: state.database[activeGroup.language],
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      studySets: state.database[activeGroup.language].studySets,
      activeGroupImageSource: activeGroup.imageSource,
      activeGroupLanguage: activeGroup.language
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(StudySetScreen);